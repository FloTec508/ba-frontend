import { useState } from "react";
import { useDispatch } from "react-redux";
import { useBluetoothService } from "@/services/bluetooth";
import { INTERNAL_EVENTS } from "@/store/constants";

export function useBluetoothActions() {
  const dispatch = useDispatch();

  const { getDevices } = useBluetoothService();

  const [loading, setLoading] = useState<boolean>(false);

  const fetchDevices = async (rescan: boolean = false) => {
    setLoading(true);
    const response = await getDevices(rescan);

    if (rescan) {
      dispatch({
        type: INTERNAL_EVENTS.BLUETOOTH_SCAN_COMPLETED,
        payload: response,
      });
    } else {
      dispatch({
        type: INTERNAL_EVENTS.BLUETOOTH_LIST,
        payload: response,
      });
    }
    setLoading(false);
  };

  return {
    fetchDevices,
    loading,
  };
}
