import { JSX } from "react";
import { useSelector } from "react-redux";
import { ICON_SM, ICON_WEIGHT } from "@/constants";
import { AirplayIcon, BluetoothIcon, RadioIcon, SpeakerHifiIcon, SpotifyLogoIcon } from "@phosphor-icons/react";

const Source = ({ className, hideText, hideIcon = false }: { className?: string; hideText?: boolean; hideIcon?: boolean }) => {
  const { source } = useSelector((state: any) => state.player);
  const source_name = source.state?.name === "none" ? "" : source.state?.name;

  const sourceIcon: Record<string, JSX.Element | null> = {
    local: null,
    spotify: <SpotifyLogoIcon weight={ICON_WEIGHT} size={ICON_SM} />,
    shairportsync: <AirplayIcon weight={ICON_WEIGHT} size={ICON_SM} />,
    tuner: <RadioIcon weight={ICON_WEIGHT} size={ICON_SM} />,
    bluetooth: <BluetoothIcon weight={ICON_WEIGHT} size={ICON_SM} />,
    snapcast: <SpeakerHifiIcon weight={ICON_WEIGHT} size={ICON_SM} />,
  };

  return ["spotify", "shairportsync", "bluetooth", "tuner"].includes(source?.uri) ? (
    source?.state?.connected ? (
      <div className={`flex items-center ${className}`}>
        {!hideIcon && <div className={`cursor-pointer flex items-center relative rounded-full ${!hideText && "mr-2"}`}>{sourceIcon[source.uri]}</div>}
        {!hideText && <div>{source_name}</div>}
      </div>
    ) : (
      <span>{!hideText && "No device connected"}</span>
    )
  ) : null;
};

export default Source;
