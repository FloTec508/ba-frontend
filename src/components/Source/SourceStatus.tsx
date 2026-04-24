import { JSX } from "react";
import { useSelector } from "react-redux";
import { ICON_SM, ICON_WEIGHT } from "@/constants";
import { AirplayIcon, BluetoothIcon, FolderIcon, GlobeHemisphereEastIcon, RadioButtonIcon, RadioIcon, SpeakerHifiIcon, SpotifyLogoIcon, VinylRecordIcon } from "@phosphor-icons/react";
import ButtonIcon from "../Button/ButtonIcon";

const SourceStatus = () => {
  const { source } = useSelector((state: any) => state.player);

  const sourceIcon: Record<string, JSX.Element | null> = {
    local: <VinylRecordIcon weight={ICON_WEIGHT} size={ICON_SM} />,
    storage: <FolderIcon weight={ICON_WEIGHT} size={ICON_SM} />,
    radio: <GlobeHemisphereEastIcon weight={ICON_WEIGHT} size={ICON_SM} />,
    linein: <RadioButtonIcon weight={ICON_WEIGHT} size={ICON_SM} />,
    spotify: <SpotifyLogoIcon weight={ICON_WEIGHT} size={ICON_SM} />,
    shairportsync: <AirplayIcon weight={ICON_WEIGHT} size={ICON_SM} />,
    tuner: <RadioIcon weight={ICON_WEIGHT} size={ICON_SM} />,
    bluetooth: <BluetoothIcon weight={ICON_WEIGHT} size={ICON_SM} />,
    snapcast: <SpeakerHifiIcon weight={ICON_WEIGHT} size={ICON_SM} />,
  };

  return <ButtonIcon onClick={undefined}>{sourceIcon[source.uri]}</ButtonIcon>;
};

export default SourceStatus;
