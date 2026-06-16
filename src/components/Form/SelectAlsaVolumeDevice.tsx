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
  // Wir initialisieren mit einem leeren Array
  const [devices, setDevices] = useState<AlsaVolumeDevice[]>([]);

  useEffect(() => {
    const fetchVolumeDevices = async () => {
      // Wenn keine Card übergeben wurde, brauchen wir das Backend gar nicht erst fragen
      if (!props.card) {
        setDevices([]);
        return;
      }

      try {
        const response = await getAlsaVolumeDevices(props.card);
        // Falls das Backend null oder undefined liefert, nutzen wir den Fallback || []
        setDevices(response || []);
      } catch (error) {
        console.error("Fehler beim Laden der Volume Devices:", error);
        setDevices([]); // Bei einem Fehler ebenfalls auf leeres Array zurückfallen
      }
    };
    fetchVolumeDevices();
  }, [props.card]);

  // Zur absoluten Sicherheit mappen wir auf (devices || []), 
  // falls der State jemals wieder korrumpiert wird
  const items = (devices || []).map((device) => ({
    label: device.name,
    value: device.name,
    description: device.description,
  }));

  const hasCurrentValue = (devices || []).some((device) => device.name === props.value);
  const value = hasCurrentValue ? props.value : null;

  return <SelectComboBox items={items} {...props} value={value} />;
}

export default SelectAlsaVolumeDevice;