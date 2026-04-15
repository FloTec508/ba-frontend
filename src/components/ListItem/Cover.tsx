import Directory from "./directory";
import TruncateText from "../TruncateText";
import Spinner from "../Spinner";
import React, { useState } from "react";

import { REF } from "@/constants/refs";
import { Item } from "@/types";
import { getSubtitle } from ".";
import { getImage } from "@/util";
import { SharedUnsharedIcon } from "../Icons";
import { PlayCircleIcon } from "@phosphor-icons/react";
import { ICON_LG } from "@/constants";

interface Cover {
  loading?: boolean;
  item: Item;
  view?: REF;
  shadow?: boolean;
  actions?: React.ReactNode;
  onClick?: () => void;
  cover_only?: boolean;
}

const Cover = ({ item, view = REF.TRACK, loading = false, shadow = false, actions, onClick, cover_only = false }: Cover) => {
  const title = item?.name;
  const item_type = item?.type;
  const subtitle = getSubtitle(item, view);
  const image = getImage(item?.images?.[0]?.uri);

  const [imgError, setImgError] = useState(false);

  return (
    <div className="w-full">
      <button onClick={onClick} className="w-full cursor-pointer  shadow-1xl relative">
        <div className={`mb-2 md:mb-1 overflow-hidden rounded-md transition-all ${shadow ?? "shadow-[1px_14px_21px_-6px_rgba(0,0,0,0.1)]"}`}>
          {image && !imgError ? (
            <img
              src={image}
              alt={title}
              className="object-cover w-full h-full aspect-square grayscale-30 inline-block"
              onError={() => setImgError(true)}
            />
          ) : (
            <Directory type={item_type} variant="primary" />
          )}

          <div
            className={`absolute top-0  left-0 w-full h-full rounded-md flex items-center justify-center z-2 ${loading ? "opacity-100" : "opacity-0 hover:opacity-100"}  hover:bg-black/50 transition duration-150`}
          >
            {loading ? <Spinner /> : <PlayCircleIcon size={ICON_LG} weight={"fill"} />}
          </div>
        </div>

        <SharedUnsharedIcon shared={item.shared} classname="absolute top-2 right-2" />
      </button>
      {!cover_only && (
        <div className="flex justify-between">
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

export default React.memo(Cover);
