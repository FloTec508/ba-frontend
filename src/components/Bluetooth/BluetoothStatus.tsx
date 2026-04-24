import { BluetoothDevice } from "@/types";
import { BluetoothDeviceIcon } from "@/util";
import { useSelector } from "react-redux";

import ButtonIcon from "../Button/ButtonIcon";

const BluetoothStatus = () => {
  const { devices } = useSelector((state: any) => state.bluetooth);

  return (
    <ButtonIcon onClick={undefined}>
      {devices.map((device: BluetoothDevice) => device.connected && <BluetoothDeviceIcon type={device.icon} />)}
    </ButtonIcon>
  );
};

export default BluetoothStatus;
