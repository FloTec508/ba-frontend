import ButtonPlaylistCreate from "@/components/Button/ButtonPlaylistCreate";
import LayoutHeightWrapper from "@/components/Wrapper/LayoutHeightWrapper";
import SortableList from "@/components/SortableList";
import NoItems from "@/components/Item/NoItems";
import Page from "@/components/Page";
import ButtonQueueClear from "@/components/Button/ButtonQueueClear";

import { QueueIcon } from "@phosphor-icons/react";
import { useSelector } from "react-redux";
import { useTracklistService } from "@/services/tracklist";
import { ICON_SM, ICON_WEIGHT } from "@/constants";

const Queue = () => {
  const { current_playlist } = useSelector((state: any) => state.player);
  const { move } = useTracklistService();

  return (
    <Page
      backButton
      title="Now Playing"
      rightComponent={
        <div className="flex">
          <div className="mr-2">
            <ButtonQueueClear />
          </div>
          <div className="mr-4">
            <ButtonPlaylistCreate fromQueue={true} />
          </div>
        </div>
      }
    >
      {current_playlist?.length ? (
        <SortableList tracks={current_playlist} onMoveCallback={move} />
      ) : (
        <LayoutHeightWrapper>
          <NoItems title="No tracks in queue" desc={"Add some music"} icon={<QueueIcon weight={ICON_WEIGHT} size={ICON_SM} />} />
        </LayoutHeightWrapper>
      )}
    </Page>
  );
};

export default Queue;
