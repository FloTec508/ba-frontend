import React, { useState, useRef, useEffect } from "react";
import { AnyAction, Dispatch } from "redux";
import { DotsThreeIcon } from "@phosphor-icons/react";
import { ICON_SM } from "@/constants";

import Spinner from "../Spinner";
import ButtonIcon from "../Button/ButtonIcon";
import { useAddToQueue } from "@/hooks/useAddToQueue";
import { usePlayNow } from "@/hooks/usePlayNow";
import { useGoToArtist } from "@/hooks/useGoToArtist";
import { useGoToAlbum } from "@/hooks/useGoToAlbum";
import { useAddToPlaylist } from "@/hooks/useAddToPlaylist";

import {
  MusicNotesMinusIcon,
  NetworkIcon,
  NetworkSlashIcon,
  PenIcon,
  PlayIcon,
  PlaylistIcon,
  QueueIcon,
  StackPlusIcon,
  StarIcon,
  TrashIcon,
  UserIcon,
  VinylRecordIcon,
} from "@phosphor-icons/react";
import { AnyItem, Storage } from "@/types";
import { ICON_WEIGHT, ICON_XS } from "@/constants";
import { ACTIONS } from "@/constants/actions";
import { MODEL, REF } from "@/constants/refs";

interface MenuItem {
  name: string;
  icon?: React.ReactNode;
  action: (() => void) | (() => Promise<void>) | ((dispatch: Dispatch<AnyAction>) => void | Promise<void>);
  disabled?: boolean;
  hide?: boolean;
}

const ActionMenu = ({
  item,
  onClickActionCallback,
  isPlaylist = false,
}: {
  item: AnyItem;
  onClickActionCallback?: (action: ACTIONS, item: AnyItem) => void;
  isPlaylist?: boolean;
}) => {
  const { handleAddToQueue } = useAddToQueue();
  const { handlePlayNow } = usePlayNow();
  const { handleGoToArtist } = useGoToArtist();
  const { handleGoToAlbum } = useGoToAlbum();
  const { handleAddToPlaylist } = useAddToPlaylist();

  const [loading, setLoading] = useState<Set<number>>(new Set());
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const items = [
    {
      name: "Play Now",
      icon: <PlayIcon size={ICON_XS} weight={ICON_WEIGHT} />,
      hide: [MODEL.DIRECTORY].includes(item.__model__),
      action: () => handlePlayNow(item),
    },
    {
      name: "Add to Queue",
      icon: <QueueIcon size={ICON_XS} weight={ICON_WEIGHT} />,
      hide: [MODEL.DIRECTORY].includes(item.__model__),
      action: () => handleAddToQueue(item),
    },
    {
      name: "Rename",
      icon: <PenIcon size={ICON_XS} weight={ICON_WEIGHT} />,
      hide: ![MODEL.PLAYLIST].includes(item.__model__),
      action: () => onClickActionCallback?.(ACTIONS.RENAME, item),
    },
    {
      name: "Delete",
      icon: <TrashIcon size={ICON_XS} weight={ICON_WEIGHT} />,
      hide: ![MODEL.PLAYLIST].includes(item.__model__),
      action: () => onClickActionCallback?.(ACTIONS.DELETE, item),
    },
    {
      name: "Go to Artist",
      icon: <UserIcon size={ICON_XS} weight={ICON_WEIGHT} />,
      disabled: !item?.artists?.[0]?.uri,
      hide: item.__model__ !== MODEL.TRACK,
      action: () => handleGoToArtist(item),
    },
    {
      name: "Go to Album",
      icon: <VinylRecordIcon size={ICON_XS} weight={ICON_WEIGHT} />,
      disabled: !item?.albums?.[0]?.uri,
      hide: item.__model__ !== MODEL.TRACK,
      action: () => handleGoToAlbum(item),
    },
    {
      name: "Favourite",
      icon: <StarIcon size={ICON_XS} weight={ICON_WEIGHT} />,
      hide: [MODEL.DIRECTORY].includes(item.__model__),
      action: () => undefined,
      disabled: true,
    },

    {
      name: "Add to Playlist",
      icon: <PlaylistIcon size={ICON_XS} weight={ICON_WEIGHT} />,
      hide: [MODEL.PLAYLIST, REF.DIRECTORY].includes(item.__model__),
      action: () => handleAddToPlaylist(item),
    },
    {
      name: "Remove",
      icon: <MusicNotesMinusIcon size={ICON_XS} weight={ICON_WEIGHT} />,
      hide: !([MODEL.TRACK].includes(item.__model__) && isPlaylist),
      action: () => onClickActionCallback?.(ACTIONS.REMOVE, item),
    },
    {
      name: "Add to Library",
      icon: <StackPlusIcon size={ICON_XS} weight={ICON_WEIGHT} />,
      hide: ![MODEL.DIRECTORY].includes(item.__model__),
      action: () => onClickActionCallback?.(ACTIONS.ADD_LIBRARY, item),
    },
    {
      name: "Share",
      icon: <NetworkIcon size={ICON_XS} weight={ICON_WEIGHT} />,
      hide: ![MODEL.DIRECTORY].includes(item.__model__) || (item as Storage).shared == true,
      action: () => onClickActionCallback?.(ACTIONS.DIRECTORY_SHARE, item),
    },
    {
      name: "Unshare",
      icon: <NetworkSlashIcon size={ICON_XS} weight={ICON_WEIGHT} />,
      hide: ![MODEL.DIRECTORY].includes(item.__model__) || (item as Storage).shared == false,
      action: () => onClickActionCallback?.(ACTIONS.DIRECTORY_UNSHARE, item),
    },
  ];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAction = async (index: number, action: () => void | Promise<void>) => {
    setLoading((prev) => new Set(prev).add(index));
    try {
      await Promise.resolve(action());
    } finally {
      setLoading((prev) => {
        const next = new Set(prev);
        next.delete(index);
        return next;
      });
      setDropdownOpen(false);
      setDrawerOpen(false);
    }
  };

  const renderButton = (item: MenuItem, idx: number) =>
    !item.hide && (
      <button
        key={idx}
        onClick={() => handleAction(idx, item.action as any)}
        className={`flex w-full items-center gap-2 px-4 py-3 md:py-2 text-left cursor-pointer hover:bg-primary hover:text-primary-foreground bg-popover ${
          item.disabled ? "text-muted! hover:bg-popover disabled:opacity-50" : ""
        }`}
        disabled={item.disabled}
      >
        <div className="mr-2">{loading.has(idx) ? <Spinner /> : item.icon}</div>
        <div>{item.name}</div>
      </button>
    );

  return (
    <div>
      {/* Desktop */}
      <div className="hidden md:block relative" ref={dropdownRef}>
        <ButtonIcon onClick={() => setDropdownOpen((o) => !o)}>
          <DotsThreeIcon size={ICON_SM} />
        </ButtonIcon>

        {isDropdownOpen && (
          <div className="absolute overflow-auto max-h-60 right-0 mt-2 w-48 bg-popover shadow-lg rounded-md z-10">{items.map(renderButton)}</div>
        )}
      </div>

      {/* Mobile */}
      <div className="md:hidden">
        <ButtonIcon onClick={() => setDrawerOpen(true)}>
          <DotsThreeIcon size={24} />
        </ButtonIcon>

        {isDrawerOpen && <div className="fixed inset-0 z-10 -top-12" onClick={() => setDrawerOpen(false)} />}

        <div
          className={`fixed  z-100 overflow-auto max-h-60 -bottom-px left-0 right-0  rounded-t-sm shadow-lg transform transition-transform duration-200  ${
            isDrawerOpen ? "translate-y-0" : "translate-y-full"
          }`}
        >
          <div className="bg-popover">{items.map(renderButton)}</div>
        </div>
      </div>
    </div>
  );
};

export default ActionMenu;
