import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useBluetoothService } from "@/services/bluetooth";
import { BluetoothIcon, BluetoothSlashIcon } from "@phosphor-icons/react";
import { ICON_SM, ICON_WEIGHT } from "@/constants";
import { INTERNAL_EVENTS } from "@/store/constants";

import ButtonIcon from "@/components/Button/ButtonIcon";

const ButtonBluetoothToggle = () => {
  const dispatch = useDispatch();

  const { adapter_state } = useSelector((state: any) => state.bluetooth);
  const { getAdapterState, setAdapterState } = useBluetoothService();

  const toggleBluetooth = async () => {
    await setAdapterState(!adapter_state.powered);
  };

  const fetchAdapterState = async () => {
    const res = await getAdapterState();
    dispatch({
      type: INTERNAL_EVENTS.BLUETOOTH_STATE_UPDATED,
      payload: res,
    });
  };

  useEffect(() => {
    fetchAdapterState();
  }, []);

  return (
    <ButtonIcon onClick={() => toggleBluetooth()} className="mr-1">
      {adapter_state?.powered ? (
        <BluetoothIcon weight={ICON_WEIGHT} size={ICON_SM} className={`${adapter_state.discoverable ? "text-primary" : ""}`} />
      ) : (
        <BluetoothSlashIcon weight={ICON_WEIGHT} size={ICON_SM} />
      )}
    </ButtonIcon>
  );
};

export default ButtonBluetoothToggle;
