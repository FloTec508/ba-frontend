import { ICON_SM, ICON_WEIGHT } from "@/constants";
import { useTracklistService } from "@/services/tracklist";
import { TrashSimpleIcon } from "@phosphor-icons/react";

import ButtonIcon from "@/components/Button/ButtonIcon";
import { useDispatch } from "react-redux";
import { INTERNAL_EVENTS } from "@/store/constants";

/**
 * A button component that clears the current queue.
 *
 * @returns {JSX.Element} The rendered clear playlist button.
 */
const ButtonQueueClear = () => {
  const dispatch = useDispatch();
  const { clear } = useTracklistService();

  const onClickHandler = () => {
    clear();
    dispatch({
      type: INTERNAL_EVENTS.CLEAR_QUEUE,
    });
  };

  return (
    <ButtonIcon onClick={onClickHandler}>
      <TrashSimpleIcon weight={ICON_WEIGHT} size={ICON_SM} />
    </ButtonIcon>
  );
};

export default ButtonQueueClear;
