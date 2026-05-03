import { useNavigate } from "react-router-dom";
import { useStorageService } from "@/services/storage";
import { GearIcon, HardDriveIcon } from "@phosphor-icons/react";
import { AnyItem, Storage } from "@/types";
import { ICON_SM, ICON_WEIGHT } from "@/constants";
import { EVENTS } from "@/constants/events";
import { REF } from "@/constants/refs";

import Page from "@/components/Page";
import ButtonIcon from "@/components/Button/ButtonIcon";
import ButtonAddSmb from "@/components/Button/ButtonAddSmb";
import List from "@/components/InfiniteScroll/List";
import NoItems from "@/components/Item/NoItems";

const Storages = () => {
  const navigate = useNavigate();

  const { getDirectory } = useStorageService();

  const onClickItem = async (item: AnyItem) => {
    if ((item as Storage).status === "unmounted") return;
    navigate(`/storage/${(item as Storage).uri}`);
  };

  const handleEvent = (event: string, payload: any, setItems: React.Dispatch<React.SetStateAction<AnyItem[]>>) => {
    switch (event) {
      case EVENTS.STORAGE_MOUNTED:
      case EVENTS.STORAGE_UNMOUNTED:
        setItems((prev) => prev.map((item) => ((item as Storage).dev === payload.storage.dev ? { ...item, ...payload.storage } : item)));
        break;
    }
  };

  return (
    <Page
      backButton
      title={"Storage"}
      rightComponent={
        <div className="flex items-center">
          <div className="mr-4">
            <ButtonAddSmb />
          </div>
          <div className="mr-4">
            <ButtonIcon onClick={() => navigate("/settings/storage")}>
              <GearIcon weight={ICON_WEIGHT} size={ICON_SM} />
            </ButtonIcon>
          </div>
        </div>
      }
    >
      <List
        uri={REF.STORAGE}
        getDirectory={getDirectory}
        onClickCallback={onClickItem}
        onEvent={handleEvent}
        emptyComponent={<NoItems title="No storages found" desc="Nothing here yet." icon={<HardDriveIcon weight={ICON_WEIGHT} size={ICON_SM} />} />}
      />
    </Page>
  );
};
export default Storages;
