import { AnyItem } from "@/types";
import { PlusIcon } from "@phosphor-icons/react";
import { useAddToQueue } from "@/hooks/useAddToQueue";
import { ICON_WEIGHT, ICON_XS } from "@/constants";

import Spinner from "@/components/Spinner";
import Button from ".";

const ButtonAddToQueue = ({ item }: { item: AnyItem }) => {
  const { handleAddToQueue, loading } = useAddToQueue();

  return (
    <Button type="primary" size="sm" onClick={() => handleAddToQueue(item)}>
      {loading ?<Spinner mode="light" /> : <PlusIcon weight={ICON_WEIGHT} size={ICON_XS} />} <div className="ml-2 text-sm"> Add to Queue</div>
    </Button>
  );
};

export default ButtonAddToQueue;
