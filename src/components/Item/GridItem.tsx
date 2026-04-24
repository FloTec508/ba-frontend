import TruncateText from "../TruncateText";
import CoverArt from "../CoverArt";

import { AnyItem, Storage, Track } from "@/types";
import { getImage, getSubtitle } from "@/util";
import { SharedUnsharedIcon } from "../Icons";
import { useState } from "react";
import { usePlayNow } from "@/hooks/usePlayNow";

interface GridItem {
  loading?: boolean;
  item: AnyItem;
  shadow?: boolean;
  actions?: React.ReactNode;
  onClickCoverArt?: () => void;
  onClick?: () => void;
  cover_only?: boolean;
}

const GridItem = ({ item, shadow = false, actions, onClick, cover_only = false }: GridItem) => {
  const title = item.name;
  const subtitle = getSubtitle(item, item.__model__);
  const src = getImage((item as Track).images?.[0]?.uri);

  const { handlePlayNow } = usePlayNow();

  const [loading, setLoading] = useState<boolean>(false);
  const [loadingCover, setLoadingCover] = useState<boolean>(false);

  const onClickItem = async () => {
    setLoading(true);
    try {
      await Promise.resolve(onClick?.());
    } finally {
      setLoading(false);
    }
  };

  const onClickCoverArt = async () => {
    setLoadingCover(true);
    try {
      await handlePlayNow(item);
    } finally {
      setLoadingCover(false);
    }
  };

  return (
    <div className="w-full" onClick={onClickItem}>
      <div className="relative">
        <CoverArt type={item.__model__} src={src} title={title} shadow={shadow} loading={loading || loadingCover} onClick={onClickCoverArt} />
        <SharedUnsharedIcon shared={(item as Storage).shared} classname="absolute top-2 right-2" />
      </div>
      {!cover_only && (
        <div className="flex justify-between mt-2">
          <div className="overflow-hidden text-left">
            {title && (
              <h2 className={`text-lg font-medium tracking-tight `}>
                <TruncateText>{title}</TruncateText>
              </h2>
            )}

            {subtitle && (
              <div className="text-secondary font-medium">
                <TruncateText>{subtitle}</TruncateText>
              </div>
            )}
          </div>
          {actions && <div className="-mr-2">{actions}</div>}
        </div>
      )}
    </div>
  );
};

export default GridItem;
