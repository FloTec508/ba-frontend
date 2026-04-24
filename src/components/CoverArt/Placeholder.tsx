import { CouchIcon, FolderSimpleIcon, MusicNoteSimpleIcon, PlaylistIcon, UserIcon, VinylRecordIcon } from "@phosphor-icons/react";
import { ICON_SM, ICON_WEIGHT } from "@/constants";
import { MODEL } from "@/constants/refs";

const Placeholder = ({
  type,
  width = "auto",
  height = "auto",
  variant,
}: {
  type?: MODEL;
  width?: number | string;
  height?: number | string;
  variant?: string;
}) => {
  const getIconByType = (type?: string) => {
    switch (type) {
      case MODEL.DIRECTORY:
        return <FolderSimpleIcon weight={ICON_WEIGHT} size={ICON_SM} />;
      case MODEL.FILE:
        return <MusicNoteSimpleIcon weight={ICON_WEIGHT} size={ICON_SM} />;
      case MODEL.ARTIST:
        return <UserIcon weight={ICON_WEIGHT} size={ICON_SM} />;
      case MODEL.TRACK:
        return <MusicNoteSimpleIcon weight={ICON_WEIGHT} size={ICON_SM} />;
      case MODEL.ALBUM:
        return <VinylRecordIcon weight={ICON_WEIGHT} size={ICON_SM} />;
      case MODEL.PLAYLIST:
        return <PlaylistIcon weight={ICON_WEIGHT} size={ICON_SM} />;
      case MODEL.ROOM:
        return <CouchIcon weight={ICON_WEIGHT} size={ICON_SM} />;
      default:
        return <FolderSimpleIcon weight={ICON_WEIGHT} size={ICON_SM} />;
    }
  };

  return (
    <div
      style={{ width, height }}
      className={`dark:bg-neutral-900 bg-white text-white  flex items-center justify-center aspect-square w-full overflow-hidden ${
        variant === "primary" ? "text-primary" : ""
      }`}
    >
      {getIconByType(type)}
    </div>
  );
};

export default Placeholder;
