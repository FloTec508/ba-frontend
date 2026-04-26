import ButtonIcon from "@/components/Button/ButtonIcon";

import { usePlaylistActions } from "@/hooks/usePlaylistActions";
import { AnyItem } from "@/types";
import { PlaylistIcon } from "@phosphor-icons/react";
import { ICON_SM, ICON_WEIGHT } from "@/constants";

const ButtonAddToPlaylist = ({ item }: { item: AnyItem }) => {
  const { playlistAddDialog } = usePlaylistActions();

  return (
    <ButtonIcon onClick={() => playlistAddDialog(item)}>
      <PlaylistIcon weight={ICON_WEIGHT} size={ICON_SM} />
    </ButtonIcon>
  );
};

export default ButtonAddToPlaylist;
