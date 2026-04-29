import { useState } from "react";
import { AnyItem, Bluetooth } from "@/types";
import { PlayCircleIcon } from "@phosphor-icons/react";
import { ICON_LG } from "@/constants";
import { MODEL } from "@/constants/refs";

import Placeholder from "./Placeholder";
import Spinner from "../Spinner";

interface CoverArt {
  item: AnyItem;
  src?: string;
  title?: string;
  shadow?: boolean;
  loading?: boolean;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
}

const CoverArt = ({ item, src = "", title = "", shadow = false, loading = false, onClick }: CoverArt) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="w-full  shadow-1xl relative">
      <div className={`overflow-hidden rounded-md transition-all ${shadow ?? "shadow-[1px_14px_21px_-6px_rgba(0,0,0,0.1)]"}`}>
        {src && !imgError ? (
          <img
            src={src}
            alt={title}
            className="object-cover w-full h-full aspect-square grayscale-30 inline-block"
            onError={() => setImgError(true)}
          />
        ) : (
          <Placeholder item={item} variant={(item as Bluetooth).connected ? "" : "primary"} />
        )}

        {[MODEL.ALBUM, MODEL.ARTIST, MODEL.FILE, MODEL.TRACK, MODEL.TUNER, MODEL.TLTRACK, MODEL.PLAYLIST].includes(item.__model__) && (
          <button
            onClick={onClick}
            className={`absolute top-0 cursor-pointer left-0 w-full h-full rounded-md flex items-center justify-center z-2 ${loading ? "opacity-100" : "opacity-0 hover:opacity-100"}  hover:bg-black/50 transition duration-150`}
          >
            {loading ? <Spinner mode="light" /> : <PlayCircleIcon size={ICON_LG} weight={"fill"} className="text-white" />}
          </button>
        )}
      </div>
    </div>
  );
};

export default CoverArt;
