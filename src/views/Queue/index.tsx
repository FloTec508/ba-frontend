import ButtonPlaylistCreate from "@/components/Button/ButtonPlaylistCreate";
import LayoutHeightWrapper from "@/components/Wrapper/LayoutHeightWrapper";
import SortableList from "@/components/SortableList";
import NoItems from "@/components/Item/NoItems";
import Page from "@/components/Page";
import ButtonQueueClear from "@/components/Button/ButtonQueueClear";

import { useEffect } from "react";
import { useTracklistActions } from "@/hooks/useTracklistActions";
import { useTracklistService } from "@/services/tracklist";
import { useSelector } from "react-redux";
import { QueueIcon } from "@phosphor-icons/react";
import { ICON_SM, ICON_WEIGHT } from "@/constants";

const Queue = () => {
  const { moveTrack } = useTracklistService();
  const { tracklistFetch } = useTracklistActions();
  const { tl_tracks } = useSelector((state: any) => state.tracklist);

  useEffect(() => {
    (async () => {
      await tracklistFetch();
    })();
  }, []);

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
      {tl_tracks?.length ? (
        <SortableList tracks={tl_tracks} onMoveCallback={moveTrack} />
      ) : (
        <LayoutHeightWrapper>
          <NoItems title="No tracks in queue" desc={"Add some music"} icon={<QueueIcon weight={ICON_WEIGHT} size={ICON_SM} />} />
        </LayoutHeightWrapper>
      )}
    </Page>
  );
};

export default Queue;
