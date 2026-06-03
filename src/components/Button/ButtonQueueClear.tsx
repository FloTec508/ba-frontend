import { useTracklistService } from "@/services/tracklist";
import { TrashSimpleIcon } from "@phosphor-icons/react";
import { ICON_SM, ICON_WEIGHT } from "@/constants";
import { useSelector } from "react-redux";

import ButtonIcon from "@/components/Button/ButtonIcon";

const ButtonQueueClear = () => {
  const { tl_tracks } = useSelector((state: any) => state.tracklist);
  const { clear } = useTracklistService();

  return (
    <ButtonIcon onClick={() => clear()} disabled={!tl_tracks.length}>
      <TrashSimpleIcon weight={ICON_WEIGHT} size={ICON_SM} />
    </ButtonIcon>
  );
};

export default ButtonQueueClear;
