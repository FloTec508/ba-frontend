import TruncateText from "../TruncateText";
import CoverArt from "../CoverArt";
import ActionMenu from "../Actions";

import { AnyItem, Storage, Track } from "@/types";
import { getImage, getSubtitle } from "@/util";
import { SharedUnsharedIcon } from "../Icons";
import { useState } from "react";
import { usePlayNow } from "@/hooks/usePlayNow";
import { useMenuActions } from "@/hooks/useMenuActions";

interface GridItem {
  loading?: boolean;
  item: AnyItem;
  shadow?: boolean;
  onClickCoverArt?: () => void;
  onClick?: () => void;
  cover_only?: boolean;
}

const GridItem = ({ item, shadow = false, onClick }: GridItem) => {
  const title = (item as Track).name;
  const subtitle = getSubtitle(item);
  const src = getImage((item as Track).images?.[0]?.uri);

  const { handlePlayNow } = usePlayNow();
  const { itemsMenu } = useMenuActions();

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
    <div className="w-full">
      <div className="relative">
        <CoverArt
          type={item.__model__}
          src={src}
          title={title}
          shadow={shadow}
          loading={loading || loadingCover}
          onClick={(e: React.MouseEvent<HTMLElement>) => {
            e.stopPropagation();
            onClickCoverArt();
          }}
        />
        <SharedUnsharedIcon shared={(item as Storage).shared} classname="absolute top-2 right-2" />
      </div>
      <div className="flex justify-between mt-2">
        <div className="overflow-hidden text-left" onClick={onClickItem}>
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
        <div className="-mr-2">
          <ActionMenu items={itemsMenu(item)} />
        </div>
      </div>
    </div>
  );
};

export default GridItem;
