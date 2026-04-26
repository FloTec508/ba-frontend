import { useDispatch } from "react-redux";
import { TlTrack } from "@/types";
import { INTERNAL_EVENTS } from "@/store/constants";
import { useTracklistService } from "@/services/tracklist";

export function useTracklistActions() {
  const dispatch = useDispatch();

  const tracklistRemove = async (item: TlTrack) => {
    const { remove } = useTracklistService();

    if (await remove(item.tlid)) {
      dispatch({
        type: INTERNAL_EVENTS.TRACKLIST_TRACK_REMOVED,
        payload: item,
      });
    }
  };

  return { tracklistRemove };
}
