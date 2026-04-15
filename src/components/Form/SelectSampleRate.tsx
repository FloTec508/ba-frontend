import SelectComboBox, { ComboboxItem } from "./SelectComboBox";

interface SelectSampleRateProps {
  value?: string | number | null;
  onChange: (value: string | number | null) => void;
  placeholder?: string;
}

const items: ComboboxItem[] = [
  { label: "None", value: null      },
  { label: "44100",   value: 44100  },
  { label: "48000",   value: 48000  },
  { label: "88200",   value: 88200  },
  { label: "96000",   value: 96000  },
  { label: "176400",  value: 176400 },
  { label: "192000",  value: 192000 },
  // { label: "352800",  value: 352800 },
  // { label: "384000",  value: 384000 },
  // { label: "705600",  value: 705600 },
  // { label: "768000",  value: 768000 },
];

function SelectSampleRate({ ...props }: SelectSampleRateProps) {
  return <SelectComboBox items={items} {...props} />;
}

export default SelectSampleRate;
