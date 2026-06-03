import TruncateText from "../TruncateText";
import CoverArt from "../CoverArt";
import ActionMenu from "../Actions";

import type { CSSProperties, KeyboardEvent } from "react";
import { AnyItem, Track } from "@/types";
import { getSubtitle } from "@/util";
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
  style?: CSSProperties;
}

const GridItem = ({ item, shadow = false, onClick, style }: GridItem) => {
  const title = (item as Track).name;
  const subtitle = getSubtitle(item);

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

  const onKeyDownItem = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onClickItem();
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
    <div
      role="button"
      tabIndex={0}
      onClick={onClickItem}
      onKeyDown={onKeyDownItem}
      className="cursor-pointer relative p-3 lg:p-4 pb-6 hover:bg-button-hover rounded-md transition-all duration-200 outline-none focus:border-ring focus:ring-ring/50 focus:ring-[3px]"
      style={style}
    >
      <div className="w-full">
        <div>
          <CoverArt
            item={item}
            shadow={shadow}
            loading={loading || loadingCover}
            onClick={(e: React.MouseEvent<HTMLElement>) => {
              e.stopPropagation();
              onClickCoverArt();
            }}
          />
        </div>
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
          <div className="-mr-2" onClick={(e) => e.stopPropagation()}>
            <ActionMenu items={itemsMenu(item)} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GridItem;
