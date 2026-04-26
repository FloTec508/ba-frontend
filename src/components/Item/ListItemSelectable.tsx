import TruncateText from "../TruncateText";
import ListImageWrapper from "../Wrapper/ListImageWrapper";
import CoverArt from "../CoverArt";

import { CheckCircleIcon, CircleIcon } from "@phosphor-icons/react";
import { getImage, getDuration, getSubtitle } from "@/util";
import { AnyItem, Storage, Track } from "@/types";
import { SharedUnsharedIcon } from "../Icons";
import { ICON_SM } from "@/constants";

interface ListItemSelectable {
  item: AnyItem;
  image?: string;
  selected?: boolean;
  onClick?: () => void;
}

const ListItemSelectable = ({ item, selected = false, onClick }: ListItemSelectable) => {
  const title = (item as Track).name;
  const subtitle = getSubtitle(item);
  const duration = getDuration(item);
  const src = getImage((item as Track).images?.[0]?.uri);

  return (
    <>
      <div onClick={onClick} className="flex items-center w-full cursor-pointer justify-between relative">
        <div className="py-3 px-4 flex justify-between w-full relative items-center">
          <div className="flex items-center w-full">
            <ListImageWrapper>
              <CoverArt type={item.__model__} src={src} title={title} />
              <SharedUnsharedIcon shared={(item as Storage).shared} classname="absolute -top-1 left-8" />
            </ListImageWrapper>
            <div className="grow pr-5">
              <div className="flex items-center text-left">
                <div className="flex flex-col">
                  <h2 className="text-lg font-medium tracking-tight flex">
                    <TruncateText>{title}</TruncateText>
                  </h2>
                  {subtitle && (
                    <div className={`${window.innerHeight < 400 ? "mt-0" : "-mt-1"} text-secondary font-medium`}>
                      <TruncateText>{subtitle as string}</TruncateText>
                    </div>
                  )}
                </div>
                {duration && <div className="ml-auto mr-2 text-secondary text-sm">{duration}</div>}
              </div>
            </div>
            {selected ? <CheckCircleIcon weight="fill" size={ICON_SM} /> : <CircleIcon size={25} className="opacity-50" />}
          </div>
        </div>
      </div>
    </>
  );
};

export default ListItemSelectable;
