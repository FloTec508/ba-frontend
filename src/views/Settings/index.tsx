import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import {
  FadersIcon,
  FolderSimpleIcon,
  GearIcon,
  HandHeartIcon,
  InfoIcon,
  MonitorIcon,
  NetworkIcon,
  RadioButtonIcon,
  RadioIcon,
  SpeakerHifiIcon,
  SpeakerHighIcon,
  StackIcon,
} from "@phosphor-icons/react";
import { ICON_SM, ICON_WEIGHT } from "@/constants";

import Page from "@/components/Page";
import ListMenu from "@/components/ListMenu";

export interface SettingsItem {
  name: string;
  alias: string;
  icon: ReactNode;
  url: string;
  disabled?: boolean;
}

const SettingsItems: SettingsItem[] = [
  {
    name: "General",
    alias: "general",
    icon: <GearIcon weight={ICON_WEIGHT} size={ICON_SM} />,
    url: "/settings/general",
  },
    {
    name: "Mixer",
    alias: "mixer",
    icon: <SpeakerHighIcon weight={ICON_WEIGHT} size={ICON_SM} />,
    url: "/settings/mixer",
  },
  {
    name: "Library",
    alias: "local",
    icon: <StackIcon weight={ICON_WEIGHT} size={ICON_SM} />,
    url: "/settings/local",
  },

  {
    name: "Network",
    alias: "network",
    icon: <NetworkIcon weight={ICON_WEIGHT} size={ICON_SM} />,
    url: "/settings/network",
  },
  {
    name: "Storage & Sharing",
    alias: "sharing",
    icon: <FolderSimpleIcon weight={ICON_WEIGHT} size={ICON_SM} />,
    url: "/settings/storage",
  },
  {
    name: "Multiroom",
    alias: "multiroom",
    icon: <SpeakerHifiIcon weight={ICON_WEIGHT} size={ICON_SM} />,
    url: "/settings/multiroom",
  },
  {
    name: "Display",
    alias: "display",
    icon: <MonitorIcon weight={ICON_WEIGHT} size={ICON_SM} />,
    url: "/settings/display",
  },
  {
    name: "Line-in",
    alias: "linein",
    icon: <RadioButtonIcon weight={ICON_WEIGHT} size={ICON_SM} />,
    url: "/settings/linein",
  },
  {
    name: "Tuner",
    alias: "tuner",
    icon: <RadioIcon weight={ICON_WEIGHT} size={ICON_SM} />,
    url: "/settings/tuner",
  },
  {
    name: "DSP",
    alias: "dsp",
    icon: <FadersIcon weight={ICON_WEIGHT} size={ICON_SM} />,
    url: "/settings/dsp",
  },
  {
    name: "System",
    alias: "system",
    icon: <InfoIcon weight={ICON_WEIGHT} size={ICON_SM} />,
    url: "/settings/system",
  },
  {
    name: "Support",
    alias: "support",
    icon: <HandHeartIcon weight={ICON_WEIGHT} size={ICON_SM} className="text-primary" />,
    url: "/settings/support",
  },
];

const Settings = () => {
  const navigate = useNavigate();

  const onClickHandler = async (source: any) => {
    if (source.url) navigate(source.url);
  };

  return (
    <Page backButton title="Settings">
      {SettingsItems.map((source: SettingsItem, index: number) => (
        <ListMenu key={index} name={source.name} icon={source.icon} onClick={() => onClickHandler(source)} disabled={source?.disabled} />
      ))}
    </Page>
  );
};

export default Settings;
