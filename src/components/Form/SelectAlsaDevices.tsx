import { useEffect, useState } from "react";
import { useMixerService } from "@/services/mixer";
import { AlsaDevice } from "@/types";

import SelectComboBox from "./SelectComboBox";
interface SelectAlsaDevicesProps {
  value?: string | null;
  onChange: (value: string | null) => void;
  onSelectedCard?: (device: AlsaDevice) => void;
  placeholder?: string;
  cmd: "aplay" | "arecord";
}

function SelectAlsaDevices(props: SelectAlsaDevicesProps) {
  const { getAlsaDevices } = useMixerService();
  const [devices, setDevices] = useState<AlsaDevice[]>([]);

  useEffect(() => {
    const fetchPlaybackDevices = async () => {
      const response = await getAlsaDevices(props.cmd);
      setDevices(response);
    };
    fetchPlaybackDevices();
  }, [props.cmd]);

  const onChangeHandler = (value: string) => {
    const device = devices.find((d) => d.device === value);

    props.onSelectedCard?.(device as AlsaDevice);
    props.onChange(value);
  };

  const items = devices.map((device) => ({
    label: device.name,
    value: device.device,
    description: device.description,
  }));

  const hasCurrentValue = devices.some((device) => device.device === props.value);
  const safeValue = hasCurrentValue ? props.value : null;

  return <SelectComboBox items={items} {...props} value={safeValue} onChange={onChangeHandler} />;
}

export default SelectAlsaDevices;
