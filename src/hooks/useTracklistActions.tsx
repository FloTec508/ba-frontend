import { TlTrack } from "@/types";
import { useTracklistService } from "@/services/tracklist";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { INTERNAL_EVENTS } from "@/store/constants";

export function useTracklistActions() {
  const dispatch = useDispatch();
  const { removeTrack, getTracklist } = useTracklistService();

  const [loading, setLoading] = useState<boolean>(false);

  const tracklistRemove = async (item: TlTrack) => {
    setLoading(true);
    try {
      await removeTrack(item.tlid);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const tracklistFetch = async () => {
    setLoading(true);
    try {
      const response = await getTracklist();
      dispatch({
        type: INTERNAL_EVENTS.TRACKLIST_LIST,
        payload: response,
      });
      return response;
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return { tracklistFetch, tracklistRemove, loading };
}
