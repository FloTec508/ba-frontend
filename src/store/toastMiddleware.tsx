import { ToastContent } from "@/components/Toast";
import { toast } from "sonner";
import { EVENTS } from "@/constants/events";
import { INTERNAL_EVENTS } from "./constants";

export const toastMiddleware = () => (next: any) => (action: any) => {
  const result = next(action);
  const { payload } = action;

  switch (action.type) {
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
    case INTERNAL_EVENTS.ADD_TO_QUEUE:
      const isArray = Array.isArray(payload);
      const isEmpty = isArray && payload.length === 0;
      const title = isArray
        ? payload.length === 1
          ? `${payload[0].name} Added to Queue`
          : `${payload.length} Tracks Added to Queue`
        : `${payload.name} Added to Queue`;

      if (isEmpty) {
        toast.custom((id) => <ToastContent id={id} title="No Tracks to Add" variant="info" />);
      } else {
        toast.custom((id) => <ToastContent id={id} title={title} variant="success" />);
      }
      break;
    case INTERNAL_EVENTS.CLEAR_QUEUE:
      toast.custom((id) => <ToastContent id={id} title="Queue Cleared" variant="info" />);
      break;
    case INTERNAL_EVENTS.PLAYLIST_CREATED:
      toast.custom((id) => <ToastContent id={id} title={`Playlist ${payload.name} Created`} variant="success" />);
      break;
    case INTERNAL_EVENTS.PLAYLIST_UPDATED:
      toast.custom((id) => <ToastContent id={id} title={`Playlist ${payload.name} Updated`} variant="success" />);
      break;
    case INTERNAL_EVENTS.PLAYLIST_REMOVED:
      toast.custom((id) => <ToastContent id={id} title={`Playlist ${payload.name} Deleted`} variant="warning" />);
      break;
    case INTERNAL_EVENTS.PLAYLIST_TRACK_ADDED:
      toast.custom((id) => (
        <ToastContent
          id={id}
          title={`${payload.tracks.length} ${payload.tracks.length > 1 ? "Tracks" : "Track"} Added to ${payload.name}`}
          variant="success"
        />
      ));
      break;
    case INTERNAL_EVENTS.PLAYLIST_TRACK_REMOVED:
      toast.custom((id) => <ToastContent id={id} title={`${payload.track.name} Removed`} variant="warning" />);
      break;
    case INTERNAL_EVENTS.LIBRARY_PATH_ADD:
      toast.custom((id) => <ToastContent id={id} title={`${payload.name} Added to Library`} variant="success" />);
      break;
    case INTERNAL_EVENTS.LIBRARY_PATH_EXISTS:
      toast.custom((id) => <ToastContent id={id} title={`Path already exists`} variant="warning" />);
      break;  
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
    case INTERNAL_EVENTS.SNAPCAST_SCAN_COMPLETED:
      toast.custom((id) => <ToastContent id={id} title="Multiroom Scan Completed" variant="success" />);
      break;
    case INTERNAL_EVENTS.WLAN_SCAN_COMPLETED:
      toast.custom((id) => <ToastContent id={id} title="Wifi Scan Completed" variant="success" />);
      break;
    case INTERNAL_EVENTS.BLUETOOTH_SCAN_COMPLETED:
      toast.custom((id) => <ToastContent id={id} title="Bluetooth Scan Completed" variant="success" />);
      break;
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
    case EVENTS.SPOTIFY_CONNECTED:
      toast.custom((id) => <ToastContent id={id} title={`Spotify user ${payload.name} connected`} variant="success" />);
      break;
    case EVENTS.SPOTIFY_DISCONNECTED:
      toast.custom((id) => <ToastContent id={id} title={`Spotify user ${payload.name} disconnected`} variant="warning" />);
      break;
    case EVENTS.SHAIRPORTSYNC_CONNECTED:
      toast.custom((id) => <ToastContent id={id} title={`Airplay device ${payload.name} connected`} variant="success" />);
      break;
    case EVENTS.SHAIRPORTSYNC_DISCONNECTED:
      toast.custom((id) => <ToastContent id={id} title={`Airplay device ${payload.name} disconnected`} variant="warning" />);
      break; 
       case EVENTS.SNAPCAST_CLIENT_CONNECTED:
      toast.custom((id) => <ToastContent id={id} title={`Room ${payload.name} joined`} variant="success" />);
      break;
    case EVENTS.SNAPCAST_CLIENT_DISCONNECTED:
      toast.custom((id) => <ToastContent id={id} title={`Room ${payload.name} left`} variant="warning" />);
      break;   
  }

  if (action.toast) {
    const { title, description, variant = "info" } = action.toast;
    toast.custom((id) => <ToastContent id={id} title={title} description={description} variant={variant} />);
  }

  return result;
};
