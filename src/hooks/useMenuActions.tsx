import {
  BluetoothConnectedIcon,
  BluetoothSlashIcon,
  EjectSimpleIcon,
  HardDriveIcon,
  InfoIcon,
  NetworkIcon,
  NetworkSlashIcon,
  PenIcon,
  PlayIcon,
  PlaylistIcon,
  QueueIcon,
  StackPlusIcon,
  StarIcon,
  TrashIcon,
  TrashSimpleIcon,
  UserIcon,
  VinylRecordIcon,
} from "@phosphor-icons/react";
import { useAddToQueue } from "./useAddToQueue";
import { usePlayNow } from "./usePlayNow";
import { useGoToArtist } from "./useGoToArtist";
import { useGoToAlbum } from "./useGoToAlbum";
import { useStorageActions } from "./useStorageActions";
import { usePlaylistActions } from "./usePlaylistActions";
import { useTracklistActions } from "./useTracklistActions";
import { AnyItem } from "@/types";
import { ICON_WEIGHT, ICON_XS } from "@/constants";
import { MODEL } from "@/constants/refs";
import { useLibraryInfo } from "./useLibraryInfo";
import { useBluetoothService } from "@/services/bluetooth";

export interface MenuItem {
  name: string;
  icon: React.ReactNode;
  action: (item: AnyItem) => void | Promise<void>;
  disabled?: boolean;
  hide?: boolean;
}

export const useMenuActions = () => {
  const { handleAddToQueue } = useAddToQueue();
  const { handlePlayNow } = usePlayNow();
  const { handleGoToArtist } = useGoToArtist();
  const { handleGoToAlbum } = useGoToAlbum();
  const { handleArtistInfo } = useLibraryInfo();
  const { libraryPathAdd, directoryShare, directoryUnshare, storageMount, storageUnMount, storageUnMountShared } = useStorageActions();
  const { playlistAddDialog, playlistRemoveTrack, playlistRenameDialog, playlistDeleteDialog } = usePlaylistActions();
  const { removeDevice, disconnectDevice, connectDevice } = useBluetoothService();
  const { tracklistRemove } = useTracklistActions();

  const itemsMenu = (item: AnyItem): MenuItem[] => {
    switch (item.__model__) {
      case MODEL.STORAGE:
        return [
          {
            name: "Mount",
            icon: <HardDriveIcon size={ICON_XS} weight={ICON_WEIGHT} />,
            action: () => storageMount(item),
            hide: item.status == "mounted",
          },
          {
            name: "Eject",
            icon: <EjectSimpleIcon size={ICON_XS} weight={ICON_WEIGHT} />,
            action: () => storageUnMount(item),
            hide: item.status == "unmounted" || item.type === "nas",
          },
          {
            name: "Unmount",
            icon: <EjectSimpleIcon size={ICON_XS} weight={ICON_WEIGHT} />,
            action: () => storageUnMountShared(item),
            hide: item.status == "unmounted" || item.type === "removable",
          },
        ];
      case MODEL.DIRECTORY:
        return [
          {
            name: "Add to Library",
            icon: <StackPlusIcon size={ICON_XS} weight={ICON_WEIGHT} />,
            action: () => libraryPathAdd(item),
          },
          {
            name: "Share",
            icon: <NetworkIcon size={ICON_XS} weight={ICON_WEIGHT} />,
            hide: item.shared == true,
            action: () => directoryShare(item),
          },
          {
            name: "Unshare",
            icon: <NetworkSlashIcon size={ICON_XS} weight={ICON_WEIGHT} />,
            hide: item.shared == false,
            action: () => directoryUnshare(item),
          },
        ];
      case MODEL.ALBUM:
        return [
          {
            name: "Play Now",
            icon: <PlayIcon size={ICON_XS} weight={ICON_WEIGHT} />,
            action: () => handlePlayNow(item),
          },
          {
            name: "Add to Queue",
            icon: <QueueIcon size={ICON_XS} weight={ICON_WEIGHT} />,
            action: () => handleAddToQueue(item),
          },
          {
            name: "Go to Artist",
            icon: <UserIcon size={ICON_XS} weight={ICON_WEIGHT} />,
            disabled: !item?.artists?.[0]?.uri,
            action: () => handleGoToArtist(item),
          },
          {
            name: "Favourite",
            icon: <StarIcon size={ICON_XS} weight={ICON_WEIGHT} />,
            action: () => undefined,
            disabled: true,
          },

          {
            name: "Add to Playlist",
            icon: <PlaylistIcon size={ICON_XS} weight={ICON_WEIGHT} />,
            action: () => playlistAddDialog(item),
          },
        ];
      case MODEL.CATEGORY:
       return [
          {
            name: "Play Now",
            icon: <PlayIcon size={ICON_XS} weight={ICON_WEIGHT} />,
            action: () => handlePlayNow(item),
          },
          {
            name: "Add to Queue",
            icon: <QueueIcon size={ICON_XS} weight={ICON_WEIGHT} />,
            action: () => handleAddToQueue(item),
          },
          {
            name: "Add to Playlist",
            icon: <PlaylistIcon size={ICON_XS} weight={ICON_WEIGHT} />,
            action: () => playlistAddDialog(item),
          },
        ];
      case MODEL.ARTIST:
        return [
          {
            name: "Play Now",
            icon: <PlayIcon size={ICON_XS} weight={ICON_WEIGHT} />,
            action: () => handlePlayNow(item),
          },
          {
            name: "Add to Queue",
            icon: <QueueIcon size={ICON_XS} weight={ICON_WEIGHT} />,
            action: () => handleAddToQueue(item),
          },
          {
            name: "Artist Info",
            icon: <InfoIcon size={ICON_XS} weight={ICON_WEIGHT} />,
            disabled: false,
            action: () => handleArtistInfo(item),
          },
          {
            name: "Go to Album",
            icon: <VinylRecordIcon size={ICON_XS} weight={ICON_WEIGHT} />,
            disabled: !item?.albums?.[0]?.uri,
            action: () => handleGoToAlbum(item),
          },
          {
            name: "Favourite",
            icon: <StarIcon size={ICON_XS} weight={ICON_WEIGHT} />,
            action: () => undefined,
            disabled: true,
          },

          {
            name: "Add to Playlist",
            icon: <PlaylistIcon size={ICON_XS} weight={ICON_WEIGHT} />,
            action: () => playlistAddDialog(item),
          },
        ];

      case MODEL.FILE:
      case MODEL.TRACK:
      case MODEL.TUNER:
        return [
          {
            name: "Play Now",
            icon: <PlayIcon size={ICON_XS} weight={ICON_WEIGHT} />,
            action: () => handlePlayNow(item),
          },
          {
            name: "Add to Queue",
            icon: <QueueIcon size={ICON_XS} weight={ICON_WEIGHT} />,
            action: () => handleAddToQueue(item),
          },
          ...(item.__model__ === MODEL.TRACK
            ? [
                {
                  name: "Go to Artist",
                  icon: <UserIcon size={ICON_XS} weight={ICON_WEIGHT} />,
                  disabled: !item?.artists?.[0]?.uri,
                  action: () => handleGoToArtist(item),
                },
                {
                  name: "Go to Album",
                  icon: <VinylRecordIcon size={ICON_XS} weight={ICON_WEIGHT} />,
                  disabled: !item?.albums?.[0]?.uri,
                  action: () => handleGoToAlbum(item),
                },
              ]
            : []),

          {
            name: "Favourite",
            icon: <StarIcon size={ICON_XS} weight={ICON_WEIGHT} />,
            action: () => undefined,
            disabled: true,
          },

          {
            name: "Add to Playlist",
            icon: <PlaylistIcon size={ICON_XS} weight={ICON_WEIGHT} />,
            action: () => playlistAddDialog(item),
          },
        ];
      case MODEL.TLTRACK:
        return [
          {
            name: "Play Now",
            icon: <PlayIcon size={ICON_XS} weight={ICON_WEIGHT} />,
            action: () => handlePlayNow(item),
          },
          {
            name: "Add to Queue",
            icon: <QueueIcon size={ICON_XS} weight={ICON_WEIGHT} />,
            action: () => handleAddToQueue(item),
          },
          ...(item.track.__model__ === MODEL.TRACK
            ? [
                {
                  name: "Go to Artist",
                  icon: <UserIcon size={ICON_XS} weight={ICON_WEIGHT} />,
                  disabled: !item.track?.artists?.[0]?.uri,
                  action: () => handleGoToArtist(item.track),
                },
                {
                  name: "Go to Album",
                  icon: <VinylRecordIcon size={ICON_XS} weight={ICON_WEIGHT} />,
                  disabled: !item.track?.albums?.[0]?.uri,
                  action: () => handleGoToAlbum(item.track),
                },
              ]
            : []),
          {
            name: "Favourite",
            icon: <StarIcon size={ICON_XS} weight={ICON_WEIGHT} />,
            action: () => undefined,
            disabled: true,
          },
          {
            name: "Add to Playlist",
            icon: <PlaylistIcon size={ICON_XS} weight={ICON_WEIGHT} />,
            action: () => playlistAddDialog(item.track),
          },
          ...(item.uri
            ? [
                {
                  name: "Remove",
                  icon: <TrashIcon size={ICON_XS} weight={ICON_WEIGHT} />,
                  action: () => playlistRemoveTrack(item),
                },
              ]
            : [
                {
                  name: "Remove",
                  icon: <TrashIcon size={ICON_XS} weight={ICON_WEIGHT} />,
                  action: () => tracklistRemove(item),
                },
              ]),
        ];

      case MODEL.PLAYLIST:
        return [
          {
            name: "Play Now",
            icon: <PlayIcon size={ICON_XS} weight={ICON_WEIGHT} />,
            action: () => handlePlayNow(item),
          },
          {
            name: "Add to Queue",
            icon: <QueueIcon size={ICON_XS} weight={ICON_WEIGHT} />,
            action: () => handleAddToQueue(item),
          },
          {
            name: "Rename",
            icon: <PenIcon size={ICON_XS} weight={ICON_WEIGHT} />,
            action: () => playlistRenameDialog(item),
          },
          {
            name: "Delete",
            icon: <TrashIcon size={ICON_XS} weight={ICON_WEIGHT} />,
            action: () => playlistDeleteDialog(item),
          },
        ];

      case MODEL.BLUETOOTH:
        return [
          {
            name: "Connect",
            icon: <BluetoothConnectedIcon size={ICON_XS} weight={ICON_WEIGHT} />,
            action: () => connectDevice(item.address),
            hide: item.connected,
          },
          {
            name: "Disconnect",
            icon: <BluetoothSlashIcon size={ICON_XS} weight={ICON_WEIGHT} />,
            action: async () => disconnectDevice(item.address),
            hide: !item.connected,
          },
          {
            name: "Forget",
            icon: <TrashSimpleIcon size={ICON_XS} weight={ICON_WEIGHT} />,
            action: async () => removeDevice(item.address),
          },
        ];
      default:
        return [];
    }
  };

  return { itemsMenu };
};
