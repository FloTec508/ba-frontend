import { useMultiroomActions } from "@/hooks/useMultiroomActions";
import { ICON_SM, ICON_WEIGHT } from "@/constants";
import { InfoIcon } from "@phosphor-icons/react";

import ButtonIcon from "@/components/Button/ButtonIcon";

const ButtonSnapcastInfo = () => {
  const { showServerInfo } = useMultiroomActions();

  return (
    <ButtonIcon onClick={() => showServerInfo()}>
      <InfoIcon weight={ICON_WEIGHT} size={ICON_SM} />
    </ButtonIcon>
  );
};

export default ButtonSnapcastInfo;
