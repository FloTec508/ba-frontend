import { useDispatch, useSelector } from "react-redux";
import { SpeakerHighIcon, SpeakerSlashIcon } from "@phosphor-icons/react";
import { ICON_SM, ICON_WEIGHT } from "@/constants";

import ButtonIcon from "@/components/Button/ButtonIcon";
import { OVERLAY_EVENTS } from "@/store/constants";

const ButtonVolume = () => {
  const dispatch = useDispatch();
  const { volume, mute } = useSelector((state: any) => state.player);

  return (
    <ButtonIcon onClick={() =>  dispatch({ type: OVERLAY_EVENTS.OVERLAY_VOLUME })} className="w-18">
      <div className="flex items-center px-3">
      {mute ? (
        <SpeakerSlashIcon
          size={ICON_SM}
          weight={ICON_WEIGHT}
          className="mr-1 opacity-30"
        />
      ) : (
        <SpeakerHighIcon size={ICON_SM} weight={ICON_WEIGHT} className="mr-1" />
      )}

      {volume}
      </div>
    </ButtonIcon>
  );
};

export default ButtonVolume;
