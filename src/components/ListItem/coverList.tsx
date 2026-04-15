import React, { useState } from "react";
import Directory from "./directory";
import TruncateText from "../TruncateText";
import Spinner from "../Spinner";
import ListImageWrapper from "../Wrapper/ListImageWrapper";

import { MusicNotesIcon, PlayCircleIcon } from "@phosphor-icons/react";
import { formatNo, getImage } from "@/util";
import { getDuration, getSubtitle } from ".";
import { Item } from "@/types";
import { REF } from "@/constants/refs";
import { SharedUnsharedIcon } from "../Icons";
import { ICON_SM } from "@/constants";

interface CoverList {
  no?: number;
  item: Item;
  view?: REF;
  loading?: boolean;
  image?: string;
  selected?: boolean;
  onClick?: () => void;
}
/**
 * CoverList component
 * Renders a list-style cover block that can represent different entity types
 * (e.g.,cover, track, album, artist) along with an image, title, and description.
 * @component
 * @param {Object} props - The component props.
 * @param {string} [props.type=REF.TRACK] - The type of cover (defaults to track).
 * @param {string} props.loading - Shows or hides loading.
 * @param {string} props.image - The URL or path of the image to display.
 * @param {string} props.title - The main heading text.
 * @param {string} props.subtitle - A short descriptive text below the title.
 * @param {string} props.selected - Highlighted
 * @returns {JSX.Element} The rendered cover list element.
 */
const CoverList = ({ no, item, view = REF.TRACK, loading = false, selected = false, onClick }: CoverList) => {
  const title = item.name;
  const type = item.type;
  const subtitle = getSubtitle(item, view);
  const duration = getDuration(item);
  const image = getImage(item.images?.[0]?.uri);

  const [imgError, setImgError] = useState(false);

  return (
    <div className="flex items-center w-full relative">
      {no && <div className="-ml-1 mr-4 text-sm text-secondary w-[10px] text-center">{formatNo(no)}</div>}

      <button onClick={onClick} className="cursor-pointer relative">
        <ListImageWrapper>
          <div
            className={`absolute w-full h-full rounded-sm flex items-center justify-center z-10 ${loading ? "opacity-100" : "opacity-0 hover:opacity-100"}  hover:bg-black/50 transition duration-150`}
          >
            {loading ? <Spinner /> : <PlayCircleIcon size={ICON_SM} weight={"fill"} />}
          </div>
          {image && !imgError ? (
            <img
              src={image}
              alt={title}
              className={`object-cover aspect-square w-full grayscale-25`}
              onError={() => setImgError(true)}
            />
          ) : (
            <Directory type={type} variant="primary" />
          )}

          
        </ListImageWrapper>
      </button>
      <SharedUnsharedIcon shared={item.shared} classname="absolute -top-1 left-8" />
      <div className="text-left flex-grow w-0 pr-5">
        <h2 className={`text-lg font-medium tracking-tight flex`}>
          <TruncateText>{title}</TruncateText>
          {selected && <MusicNotesIcon className="text-primary inline-block ml-1 mt-[6px]" weight={"fill"} size={15} />}
        </h2>
        {subtitle && (
          <div className={`${window.innerHeight < 400 ? "mt-0" : "-mt-1"} text-secondary font-medium`}>
            <TruncateText>{subtitle as string}</TruncateText>
          </div>
        )}
      </div>
      {duration && <div className="mr-2 text-secondary text-sm">{duration}</div>}
    </div>
  );
};

export default React.memo(CoverList);
