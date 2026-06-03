import { ToastContent } from "@/components/Toast";
import { toast } from "sonner";
import { EVENTS } from "@/constants/events";
import { INTERNAL_EVENTS } from "./constants";

export const toastMiddleware = () => (next: any) => (action: any) => {
  const result = next(action);
  const { payload } = action;

  switch (action.type) {
    // Tracklist Notifications
    case EVENTS.TRACKLIST_TRACK_ADDED: {
      const count = payload.tl_tracks.length;
      if (!count) {
        toast.custom((id) => <ToastContent id={id} title="Empty Playlist" variant="warning" />);
        break;
      }
      const title = count === 1 ? `${payload.tl_tracks[0].track.name} Added to Queue` : `${count} Tracks Added to Queue`;
      toast.custom((id) => <ToastContent id={id} title={title} variant="success" />);
      break;
    }
    case EVENTS.TRACKLIST_TRACK_REMOVED:
      toast.custom((id) => <ToastContent id={id} title={`${payload.tl_track.track.name} Removed`} variant="warning" />);
      break;
    case EVENTS.TRACKLIST_CLEARED:
      toast.custom((id) => <ToastContent id={id} title="Queue Cleared" variant="info" />);
      break;

    // Playlist Notifications
    case EVENTS.PLAYLIST_CREATED:
      toast.custom((id) => <ToastContent id={id} title={`Playlist ${payload.playlist.name} Created`} variant="success" />);
      break;
    case EVENTS.PLAYLIST_RENAMED:
      toast.custom((id) => <ToastContent id={id} title={`Playlist ${payload.playlist.name} Renamed`} variant="success" />);
      break;
    case EVENTS.PLAYLIST_REMOVED:
      toast.custom((id) => <ToastContent id={id} title={`Playlist ${payload.playlist.name} Deleted`} variant="warning" />);
      break;
    case EVENTS.PLAYLIST_TRACK_ADDED:
      toast.custom((id) => (
        <ToastContent id={id} title={`${payload.tl_tracks.length} ${payload.tl_tracks.length > 1 ? "Tracks" : "Track"} Added`} variant="success" />
      ));
      break;
    case EVENTS.PLAYLIST_TRACK_REMOVED:
      toast.custom((id) => <ToastContent id={id} title={`${payload.tl_track.track.name} Removed`} variant="warning" />);
      break;

    // Library Notifications
    case EVENTS.SCAN_UPDATED:
      if (payload.progress.completed) {
        toast.custom((id) => (
          <ToastContent
            id={id}
            title="Library Scan Completed"
            description={`Processed ${payload.progress.processed} Inserted ${payload.progress.inserted} Updated ${payload.progress.updated}`}
            variant="success"
          />
        ));
      }
      break;
    case INTERNAL_EVENTS.LIBRARY_PATH_ADD:
      toast.custom((id) => <ToastContent id={id} title={`${payload.name} Added to Library`} variant="success" />);
      break;
    case INTERNAL_EVENTS.LIBRARY_PATH_EXISTS:
      toast.custom((id) => <ToastContent id={id} title={`Path already exists`} variant="warning" />);
      break;

    // Storage Notifications
    case INTERNAL_EVENTS.STORAGE_MOUNTED:
      toast.custom((id) => <ToastContent id={id} title={`Storage ${payload.name} Mounted`} variant="success" />);
      break;
    case INTERNAL_EVENTS.STORAGE_UNMOUNTED:
      toast.custom((id) => <ToastContent id={id} title={`Storage ${payload.name} Unmounted`} variant="warning" />);
      break;
    case INTERNAL_EVENTS.STORAGE_SHARED:
      toast.custom((id) => <ToastContent id={id} title={`Folder ${payload.name} Shared`} variant="success" />);
      break;
    case INTERNAL_EVENTS.STORAGE_UNSHARED:
      toast.custom((id) => <ToastContent id={id} title={`Folder ${payload.name} Unshared`} variant="warning" />);
      break;

    // Multiroom Notifications
    case INTERNAL_EVENTS.MULTIROOM_SCAN_COMPLETED:
      toast.custom((id) => <ToastContent id={id} title="Multiroom Scan Completed" variant="success" />);
      break;
    case EVENTS.MULTIROOM_CLIENT_CONNECTED:
      toast.custom((id) => <ToastContent id={id} title={`Room ${payload.name} joined`} variant="success" />);
      break;
    case EVENTS.MULTIROOM_CLIENT_DISCONNECTED:
      toast.custom((id) => <ToastContent id={id} title={`Room ${payload.name} left`} variant="warning" />);
      break;

    // Network Notifications
    case INTERNAL_EVENTS.WLAN_SCAN_COMPLETED:
      toast.custom((id) => <ToastContent id={id} title="Wifi Scan Completed" variant="success" />);
      break;

    // Bluetooth Notifications
    case INTERNAL_EVENTS.BLUETOOTH_SCAN_COMPLETED:
      toast.custom((id) => <ToastContent id={id} title="Bluetooth Scan Completed" variant="success" />);
      break;
    case EVENTS.BLUETOOTH_DISCOVERABLE:
      toast.custom((id) => (
        <ToastContent
          id={id}
          title={`Bluetooth ${payload.state ? "discoverable On" : "discoverable Off"}`}
          variant={`${payload.state ? "success" : "info"}`}
        />
      ));
      break;
    case EVENTS.BLUETOOTH_POWERED:
      toast.custom((id) => (
        <ToastContent id={id} title={`Bluetooth ${payload.state ? "power On" : "power Off"}`} variant={`${payload.state ? "success" : "info"}`} />
      ));
      break;
    case EVENTS.BLUETOOTH_CONNECTED:
      toast.custom((id) => <ToastContent id={id} title={`Bluetooth ${payload.device.name} connected`} variant="success" />);
      break;
    case EVENTS.BLUETOOTH_DISCONNECTED:
      toast.custom((id) => <ToastContent id={id} title={`Bluetooth ${payload.device.name} disconnected`} variant="warning" />);
      break;

    // Playback Notifications
    case EVENTS.PLAYBACK_BUFFERING:
      const title_buf = `Buffering ${payload.percent}%`;
      toast.custom((id) => <ToastContent id={id} title={title_buf} variant="info" hideIcon hideClose autoWidth />, {
        id: "playback-buffering",
        duration: payload.percent >= 100 ? 2000 : Infinity,
      });
      break;
    case EVENTS.MIXER_MUTE:
      toast.custom((id) => <ToastContent id={id} title={`Mixer ${payload.mute ? "Muted" : "Unmuted"}`} variant="info" />);
      break;
    case EVENTS.SOURCE_CHANGED:
      if (payload.source.name) toast.custom((id) => <ToastContent id={id} title={`Source changed to ${payload.source.name}`} variant="info" />);
      break;
    case EVENTS.CONFIG_UPDATED:
      toast.custom((id) => <ToastContent id={id} title="Settings Updated" variant="success" />);
      break;
    case EVENTS.ERROR:
      toast.custom((id) => <ToastContent id={id} title={`${payload.message}`} variant="error" />);
      break;

    // Spotify Notifications
    case EVENTS.SPOTIFY_CONNECTED:
      toast.custom((id) => <ToastContent id={id} title={`Spotify user ${payload.name} connected`} variant="success" />);
      break;
    case EVENTS.SPOTIFY_DISCONNECTED:
      toast.custom((id) => <ToastContent id={id} title={`Spotify user ${payload.name} disconnected`} variant="warning" />);
      break;

    // Airplay Notifications
    case EVENTS.SHAIRPORTSYNC_CONNECTED:
      toast.custom((id) => <ToastContent id={id} title={`Airplay device ${payload.name} connected`} variant="success" />);
      break;
    case EVENTS.SHAIRPORTSYNC_DISCONNECTED:
      toast.custom((id) => <ToastContent id={id} title={`Airplay device ${payload.name} disconnected`} variant="warning" />);
      break;
  }

  if (action.toast) {
    const { title, description, variant = "info" } = action.toast;
    toast.custom((id) => <ToastContent id={id} title={title} description={description} variant={variant} />);
  }

  return result;
};
