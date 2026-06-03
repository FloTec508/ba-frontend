import { useMultiroomActions } from "@/hooks/useMultiroomActions";
import { ArrowsClockwiseIcon } from "@phosphor-icons/react";
import { ICON_SM, ICON_WEIGHT } from "@/constants";

import ButtonIcon from "@/components/Button/ButtonIcon";
import Spinner from "@/components/Spinner";

const ButtonMulitroomScan = () => {
  const { fetchServers, loading } = useMultiroomActions();

  return (
    <ButtonIcon onClick={() => fetchServers(true)} className="mr-1">
      {loading ? <Spinner /> : <ArrowsClockwiseIcon weight={ICON_WEIGHT} size={ICON_SM} />}
    </ButtonIcon>
  );
};

export default ButtonMulitroomScan;
