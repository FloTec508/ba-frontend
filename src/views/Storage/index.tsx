import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useStorageService } from "@/services/storage";
import { useStorageActions } from "@/hooks/useStorageActions";
import { useMenuActions } from "@/hooks/useMenuActions";
import { FolderOpenIcon, GearIcon, HardDriveIcon, NetworkIcon, UsbIcon } from "@phosphor-icons/react";
import { Storage, ViewMode, Directory, AnyItem } from "@/types";
import { formatBytes } from "@/util";
import { ICON_SM, ICON_WEIGHT } from "@/constants";
import { MODEL } from "@/constants/refs";
import { EVENTS } from "@/constants/events";

import Page from "@/components/Page";
import Spinner from "@/components/Spinner";
import ActionMenu from "@/components/Actions";
import LayoutHeightWrapper from "@/components/Wrapper/LayoutHeightWrapper";
import ItemWrapper from "@/components/Wrapper/ItemWrapper";
import ItemPadding from "@/components/Wrapper/ItemPadding";
import ButtonIcon from "@/components/Button/ButtonIcon";
import List from "@/components/InfiniteScroll/List";
import Grid from "@/components/InfiniteScroll/Grid";
import NoItems from "@/components/Item/NoItems";
import ButtonLayoutToggle from "@/components/Button/ButtonLayoutToggle";
import ButtonAddSmb from "@/components/Button/ButtonAddSmb";

const StorageView = () => {
  const navigate = useNavigate();

  const { getDirectory } = useStorageService();
  const { storageFetch, loading } = useStorageActions();
  const { itemsMenu } = useMenuActions();

  const { storages } = useSelector((state: any) => state.storage);
  const { "*": path } = useParams<{ "*": string }>();

  const [layout, setLayout] = useState<ViewMode>("list");
  const [dirCur, setDirCur] = useState<string>();

  useEffect(() => {
    storageFetch();
  }, []);

  useEffect(() => {
    if (path) {
      const cur_dir = path.split("/");
      setDirCur(cur_dir[cur_dir.length - 1]);
    } else {
      setDirCur("Storage");
    }
  }, [path]);

  const onClickItem = async (item: AnyItem) => {
    if (item.__model__ === MODEL.FILE) return;
    const path = (item as Directory).uri.replace("storage:", "");
    navigate(`/storage${path}`);
  };

  const handleEvent = (event: string, payload: any, setItems: React.Dispatch<React.SetStateAction<AnyItem[]>>) => {
    switch (event) {
      case EVENTS.STORAGE_SHARED:
      case EVENTS.STORAGE_UNSHARED:
        setItems((prev) => prev.map((item) => ((item as Directory).uri === payload.directory.uri ? { ...item, ...payload.directory } : item)));
        break;
    }
  };

  const ListItemStorage = ({ item }: { item: Storage }) => {
    const is_mounted = item.status == "mounted";

    return (
      <div className="w-full">
        <div className="flex justify-between">
          <button onClick={() => is_mounted && onClickItem(item)} className="cursor-pointer w-full">
            <div className="font-medium">
              <div className="w-full flex">
                <div className="flex text-lg ">
                  {item.type === "internal" && <HardDriveIcon weight={ICON_WEIGHT} size={ICON_SM} className="mr-2" />}
                  {item.type === "removable" && <UsbIcon weight={ICON_WEIGHT} size={ICON_SM} className="mr-2" />}
                  {item.type === "nas" && <NetworkIcon weight={ICON_WEIGHT} size={ICON_SM} className="mr-2" />}
                  {item.name}
                </div>
              </div>
              <div className="mb-1  text-secondary text-left">{`${
                is_mounted ? `${formatBytes(item.usage?.free as number)} available of ${formatBytes(item.usage?.total as number)}` : "Unmounted"
              }`}</div>
            </div>
          </button>
          <div className="-mr-2">{item.type !== "internal" && <ActionMenu items={itemsMenu(item)} />}</div>
        </div>

        <div onClick={() => is_mounted && onClickItem(item)} className="w-full bg-popover rounded-full h-1 mt-3 mb-1">
          {item.usage?.used && item.usage?.total && (
            <div
              className={`${is_mounted ? "bg-primary" : ""} h-1 rounded-full`}
              style={{ width: `${(item.usage?.used / item.usage?.total) * 100}%` }}
            ></div>
          )}
        </div>
      </div>
    );
  };

  return (
    <Page
      backButton
      wfull={layout === "grid" && path != ""}
      title={dirCur || "Storage"}
      rightComponent={
        <div className="flex items-center">
          {path && (
            <div className="mr-2">
              <ButtonLayoutToggle setLayoutype={setLayout} layoutType={layout} />
            </div>
          )}

          {!path && (
            <div className="mr-4">
              <ButtonAddSmb />
            </div>
          )}

          <div className="mr-4">
            <ButtonIcon onClick={() => navigate("/settings/storage")}>
              <GearIcon weight={ICON_WEIGHT} size={ICON_SM} />
            </ButtonIcon>
          </div>
        </div>
      }
    >
      {path ? (
        loading ? (
          <LayoutHeightWrapper>
            <Spinner />
          </LayoutHeightWrapper>
        ) : (
          <>
            {layout === "list" && (
              <List
                uri={`storage:/${path}`}
                getDirectory={getDirectory}
                onClickCallback={onClickItem}
                onEvent={handleEvent}
                emptyComponent={<NoItems title="Empty Folder" desc="No files here" icon={<FolderOpenIcon weight={ICON_WEIGHT} size={ICON_SM} />} />}
              />
            )}
            {layout === "grid" && (
              <Grid
                uri={`storage:/${path}`}
                getDirectory={getDirectory}
                onClickCallback={onClickItem}
                onEvent={handleEvent}
                emptyComponent={<NoItems title="Empty Folder" desc="No files here" icon={<FolderOpenIcon weight={ICON_WEIGHT} size={ICON_SM} />} />}
              />
            )}
          </>
        )
      ) : (
        storages.map((item: Storage) => (
          <ItemWrapper key={item.uri}>
            <ItemPadding>
              <ListItemStorage item={item} />
            </ItemPadding>
          </ItemWrapper>
        ))
      )}
    </Page>
  );
};
export default StorageView;
