import TruncateText from "../TruncateText";
import ListImageWrapper from "../Wrapper/ListImageWrapper";
import CoverArt from "../CoverArt";
import ActionMenu from "../Actions";

import { MusicNotesIcon } from "@phosphor-icons/react";
import { formatNo, getImage, getDuration, getSubtitle } from "@/util";
import { AnyItem, Storage, Track } from "@/types";
import { SharedUnsharedIcon } from "../Icons";
import { usePlayNow } from "@/hooks/usePlayNow";
import { useState } from "react";
import { useMenuActions } from "@/hooks/useMenuActions";

interface ListItem {
  no?: number;
  item: AnyItem;
  image?: string;
  selected?: boolean;
  onClick?: () => void;
}

const ListItem = ({ no, item, selected = false, onClick }: ListItem) => {
  const title = (item as Track).name;
  const subtitle = getSubtitle(item);
  const duration = getDuration(item);
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
    <>
      <div onClick={onClickItem} className="flex items-center w-full cursor-pointer justify-between relative">
        <div className="py-3 px-4 flex justify-between w-full relative items-center">
          <div className="flex items-center w-full">
            {no && <div className="-ml-1 mr-4 text-sm text-secondary w-2.5 text-center">{formatNo(no)}</div>}
            <ListImageWrapper>
              <CoverArt
                type={item.__model__}
                src={src}
                title={title}
                loading={loadingCover || loading}
                onClick={(e: React.MouseEvent<HTMLElement>) => {
                  e.stopPropagation();
                  onClickCoverArt();
                }}
              />
              <SharedUnsharedIcon shared={(item as Storage).shared} classname="absolute -top-1 left-8" />
            </ListImageWrapper>
            <div className="grow ">
              <div className="flex items-center text-left">
                <div className="flex flex-col overflow-hidden w-0 grow pr-5">
                  <h2 className="text-lg font-medium tracking-tight flex ">
                    <TruncateText>{title}</TruncateText>
                    {selected && <MusicNotesIcon className="text-primary inline-block ml-1 mt-1.5" weight={"fill"} size={15} />}
                  </h2>
                  {subtitle && (
                    <div className={`${window.innerHeight < 400 ? "mt-0" : "-mt-1"} text-secondary font-medium`}>
                      <TruncateText>{subtitle as string}</TruncateText>
                    </div>
                  )}
                </div>
                {duration && <div className="ml-auto text-secondary text-sm">{duration}</div>}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="pr-2">
        <ActionMenu items={itemsMenu(item)} />
      </div>
    </>
  );
};

export default ListItem;
