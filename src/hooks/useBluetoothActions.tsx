import { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useBluetoothService } from "@/services/bluetooth";
import { INTERNAL_EVENTS } from "@/store/constants";

export function useBluetoothActions() {
  const dispatch = useDispatch();
  const { getDevices } = useBluetoothService();
  const [loading, setLoading] = useState<boolean>(true);

  const fetchDevices = useCallback(async (rescan: boolean = false) => {
    setLoading(true);
    const response = await getDevices(rescan);
    dispatch({
      type: rescan
        ? INTERNAL_EVENTS.BLUETOOTH_SCAN_COMPLETED
        : INTERNAL_EVENTS.BLUETOOTH_LIST,
      payload: response,
    });
    setLoading(false);
  }, [dispatch, getDevices]);

  return {
    fetchDevices,
    loading,
  };
}