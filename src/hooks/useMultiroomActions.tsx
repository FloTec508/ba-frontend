import { useState } from "react";
import { useDispatch } from "react-redux";
import { useMultiroomService } from "@/services/multiroom";
import { DIALOG_EVENTS, INTERNAL_EVENTS } from "@/store/constants";
import { EVENTS } from "@/constants/events";

export function useMultiroomActions() {
  const dispatch = useDispatch();
  const { getServers, getStatus } = useMultiroomService();

  const [loading, setLoading] = useState<boolean>(false);

  const fetchServers = async (rescan: boolean = false) => {
    setLoading(true);
    const response = await getServers(rescan);

    if (rescan) {
      dispatch({
        type: INTERNAL_EVENTS.MULTIROOM_SCAN_COMPLETED,
        payload: response,
      });
    } else {
      dispatch({
        type: INTERNAL_EVENTS.MULTIROOM_LIST,
        payload: response,
      });
    }

    getServerStatus();
    setLoading(false);
  };

  const getServerStatus = async () => {
    setLoading(true);
    const response = await getStatus();

    dispatch({
      type: EVENTS.MULTIROOM_STATE_CHANGED,
      payload: response,
    });
    setLoading(false);
  };

  const showServerInfo = () => {
    dispatch({ type: DIALOG_EVENTS.DIALOG_MULTIROOM_INFO });
  };

  return {
    fetchServers,
    getServerStatus,
    showServerInfo,
    loading,
  };
}
