import { useEffect, useState } from "react";
import { useMixerService } from "@/services/mixer";
import { AlsaVolumeDevice } from "@/types";

import SelectComboBox from "./SelectComboBox";
interface SelectAlsaDevicesProps {
  value?: string | null;
  onChange: (value: string | null) => void;
  placeholder?: string;
  card?: string;
}

function SelectAlsaVolumeDevice(props: SelectAlsaDevicesProps) {
  const { getAlsaVolumeDevices } = useMixerService();
  const [devices, setDevices] = useState<AlsaVolumeDevice[]>([]);

  useEffect(() => {
    const fetchVolumeDevices = async () => {
      const response = await getAlsaVolumeDevices(props?.card);
      setDevices(response);
    };
    fetchVolumeDevices();
  }, [props.card]);

  const items = devices.map((device) => ({
    label: device.name,
    value: device.name,
    description: device.description,
  }));

  const hasCurrentValue = devices.some((device) => device.name === props.value);
  const value = hasCurrentValue ? props.value : null;

  return <SelectComboBox items={items} {...props} value={value} />;
}

export default SelectAlsaVolumeDevice;
