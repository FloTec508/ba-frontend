import {
  BluetoothIcon,
  CouchIcon,
  DeviceMobileIcon,
  FolderSimpleIcon,
  FolderSimpleUserIcon,
  HeadphonesIcon,
  HeadsetIcon,
  LaptopIcon,
  MusicNoteSimpleIcon,
  PlaylistIcon,
  RadioIcon,
  SpeakerHifiIcon,
  UserIcon,
  VinylRecordIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react";
import { ICON_SM, ICON_WEIGHT } from "@/constants";
import { BLUETOOTH_ICON, MODEL } from "@/constants/refs";
import { AnyItem } from "@/types";

const Placeholder = ({
  item,
  width = "auto",
  height = "auto",
  variant,
}: {
  item: AnyItem;
  width?: number | string;
  height?: number | string;
  variant?: string;
}) => {
  const getIconByType = (item: AnyItem) => {
    switch (item.__model__) {
      case MODEL.DIRECTORY:
        if (item.shared) {
          return <FolderSimpleUserIcon weight={ICON_WEIGHT} size={ICON_SM} />;
        }
        return <FolderSimpleIcon weight={ICON_WEIGHT} size={ICON_SM} />;
      case MODEL.STORAGE:
      case MODEL.CATEGORY:
        return <FolderSimpleIcon weight={ICON_WEIGHT} size={ICON_SM} />;
      case MODEL.ARTIST:
        return <UserIcon weight={ICON_WEIGHT} size={ICON_SM} />;
      case MODEL.TLTRACK:
        switch (item.track.__model__) {
          case MODEL.TRACK:
            return <MusicNoteSimpleIcon weight={ICON_WEIGHT} size={ICON_SM} />;
          case MODEL.TUNER:
            return <RadioIcon weight={ICON_WEIGHT} size={ICON_SM} />;
        }
      case MODEL.TRACK:
      case MODEL.FILE:
        return <MusicNoteSimpleIcon weight={ICON_WEIGHT} size={ICON_SM} />;
      case MODEL.TUNER:
        return <RadioIcon weight={ICON_WEIGHT} size={ICON_SM} />;
      case MODEL.ALBUM:
        return <VinylRecordIcon weight={ICON_WEIGHT} size={ICON_SM} />;
      case MODEL.PLAYLIST:
        return <PlaylistIcon weight={ICON_WEIGHT} size={ICON_SM} />;
      case MODEL.ROOM:
        return <CouchIcon weight={ICON_WEIGHT} size={ICON_SM} />;
      case MODEL.BLUETOOTH:
        switch (item.icon) {
          case BLUETOOTH_ICON.AUDIO_HEADSET:
            return <HeadsetIcon weight={ICON_WEIGHT} size={ICON_SM} />;
          case BLUETOOTH_ICON.AUDIO_HEADPHONES:
            return <HeadphonesIcon weight={ICON_WEIGHT} size={ICON_SM} />;
          case BLUETOOTH_ICON.AUDIO_CARD:
            return <SpeakerHifiIcon weight={ICON_WEIGHT} size={ICON_SM} />;
          case BLUETOOTH_ICON.COMPUTER:
            return <LaptopIcon weight={ICON_WEIGHT} size={ICON_SM} />;
          case BLUETOOTH_ICON.PHONE:
            return <DeviceMobileIcon weight={ICON_WEIGHT} size={ICON_SM} />;
          default:
            return <BluetoothIcon weight={ICON_WEIGHT} size={ICON_SM} />;
        }
      default:
        return <WarningCircleIcon weight={ICON_WEIGHT} size={ICON_SM} />;
    }
  };

  return (
    <div
      style={{ width, height }}
      className={`dark:bg-neutral-900 bg-white text-neutral-900 dark:text-white  flex items-center justify-center aspect-square w-full overflow-hidden ${
        variant === "primary" ? "text-primary" : ""
      }`}
    >
      {getIconByType(item)}
    </div>
  );
};

export default Placeholder;
