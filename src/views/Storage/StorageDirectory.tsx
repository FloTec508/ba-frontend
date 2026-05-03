import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useStorageActions } from "@/hooks/useStorageActions";
import { FolderOpenIcon, GearIcon } from "@phosphor-icons/react";
import { ViewMode, Directory, AnyItem } from "@/types";
import { ICON_SM, ICON_WEIGHT } from "@/constants";
import { MODEL } from "@/constants/refs";
import { EVENTS } from "@/constants/events";

import Page from "@/components/Page";
import ButtonIcon from "@/components/Button/ButtonIcon";
import List from "@/components/InfiniteScroll/List";
import Grid from "@/components/InfiniteScroll/Grid";
import NoItems from "@/components/Item/NoItems";
import ButtonLayoutToggle from "@/components/Button/ButtonLayoutToggle";

const StorageDirectory = () => {
  const navigate = useNavigate();

  const { storageFetch } = useStorageActions();
  const { "*": path } = useParams<{ "*": string }>();

  const [layout, setLayout] = useState<ViewMode>("list");
  const [dirCur, setDirCur] = useState<string>();

  useEffect(() => {
    if (path) {
      const cur_dir = path.split("/");
      setDirCur(cur_dir[cur_dir.length - 1]);
    }
  }, [path]);

  const onClickItem = async (item: AnyItem) => {
    if (item.__model__ === MODEL.FILE) return;
    if (item.__model__ === MODEL.DIRECTORY) {
      navigate(`/storage/${item.uri}`);
    }
  };

  const handleEvent = (event: string, payload: any, setItems: React.Dispatch<React.SetStateAction<AnyItem[]>>) => {
    switch (event) {
      case EVENTS.STORAGE_SHARED:
      case EVENTS.STORAGE_UNSHARED:
        setItems((prev) => prev.map((item) => ((item as Directory).uri === payload.directory.uri ? { ...item, ...payload.directory } : item)));
        break;
    }
  };

  return (
    <Page
      backButton
      wfull={layout === "grid" && !!path}
      title={dirCur}
      rightComponent={
        <div className="flex items-center">
          {path && (
            <div className="mr-2">
              <ButtonLayoutToggle setLayoutype={setLayout} layoutType={layout} />
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
      {layout === "list" && path && (
        <List
          uri={path}
          getDirectory={storageFetch}
          onClickCallback={onClickItem}
          onEvent={handleEvent}
          emptyComponent={<NoItems title="Empty Folder" desc="No files here" icon={<FolderOpenIcon weight={ICON_WEIGHT} size={ICON_SM} />} />}
        />
      )}
      {layout === "grid" && path && (
        <Grid
          uri={path}
          getDirectory={storageFetch}
          onClickCallback={onClickItem}
          onEvent={handleEvent}
          emptyComponent={<NoItems title="Empty Folder" desc="No files here" icon={<FolderOpenIcon weight={ICON_WEIGHT} size={ICON_SM} />} />}
        />
      )}
    </Page>
  );
};
export default StorageDirectory;
