import { useSelector } from "react-redux";
import { useState } from "react";
import { useBluetoothActions } from "@/hooks/useBluetoothActions";
import { ArrowsClockwiseIcon } from "@phosphor-icons/react";
import { ICON_SM, ICON_WEIGHT } from "@/constants";

import ButtonIcon from "@/components/Button/ButtonIcon";
import Spinner from "@/components/Spinner";

const ButtonBluetoothScan = () => {
  const { adapter_state } = useSelector((state: any) => state.bluetooth);
  const { fetchDevices } = useBluetoothActions();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleScan = async () => {
    setIsLoading(true);
    await fetchDevices(true);
    setIsLoading(false);
  };

  return (
    <ButtonIcon onClick={handleScan} className="mr-1" disabled={!adapter_state?.powered}>
      {isLoading ? <Spinner /> : <ArrowsClockwiseIcon weight={ICON_WEIGHT} size={ICON_SM} />}
    </ButtonIcon>
  );
};

export default ButtonBluetoothScan;
