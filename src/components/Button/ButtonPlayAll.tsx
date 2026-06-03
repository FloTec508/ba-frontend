import { PlayIcon } from "@phosphor-icons/react";
import { usePlayNow } from "@/hooks/usePlayNow";
import { AnyItem } from "@/types";
import { ICON_WEIGHT, ICON_XS } from "@/constants";

import Spinner from "@/components/Spinner";
import Button from ".";

const ButtonPlayAll = ({ item }: { item: AnyItem }) => {
  const { handlePlayNow, loading } = usePlayNow();

  return (
    <Button type="primary" size="sm" onClick={() => handlePlayNow(item)} >
      {loading ? <Spinner mode="light"/> : <PlayIcon weight={ICON_WEIGHT} size={ICON_XS} />} <div className="ml-2 text-sm"> Play All</div>
    </Button>
  );
};

export default ButtonPlayAll;
