export enum SOCKET_EVENTS {
  SOCKET_CONNECTED = "socket/connected",
  SOCKET_DISCONNECTED = "socket/disconnected",
  SOCKET_EVENT = "socket/event",
}

export enum PLAYER_EVENTS {
  POSITION_UPDATED = "player/position",
  VOLUME_CHANGED = "player/volume",
}

export enum INTERNAL_EVENTS {
  // Playlist
  PLAYLIST_CREATED = "event/playlist/create",
  PLAYLIST_UPDATED = "event/playlist/update",
  PLAYLIST_REMOVED = "event/playlist/removed",
  PLAYLIST_TRACK_ADDED = "event/playlist/track/add",
  PLAYLIST_TRACK_REMOVED = "event/playlist/track/removed",

  // Queue
  ADD_TO_QUEUE = "event/queue/add",
  CLEAR_QUEUE = "event/queue/clear",
  TRACKLIST_TRACK_REMOVED = "event/tracklist/track/removed",

  // Library
  LIBRARY_SCAN_COMPLETED = "event/library/scan/completed",
  LIBRARY_PATH_ADD = "event/library/path/add",
  LIBRARY_PATH_EXISTS = "event/library/path/exists",
  SCAN_UPDATED = "event/local/scan/updated",
  SCAN_ARTIST_UPDATED = "event/local/artist/scan/updated",

  // Storage
  STORAGE_UPDATED = "event/storage/updated",
  STORAGE_MOUNTED = "event/storage/mounted",
  STORAGE_UNMOUNTED = "event/storage/unmounted",
  STORAGE_SHARED = "event/storage/shared",
  STORAGE_UNSHARED = "event/storage/unshared",

  // Bluetooth
  BLUETOOTH_SCAN_COMPLETED = "event/bluetooth/scan/completed",
  BLUETOOTH_LIST = "event/bluetooth/list",
  BLUETOOTH_STATE_UPDATED = "event/bluetooth/state/updated",

  // Wifi
  WLAN_SCAN_COMPLETED = "event/wlan/scan/completed",
  WLAN_LIST = "event/wlan/list",
  WLAN_STATE_UPDATED = "event/wlan/state/updated",

  // Snapcast
  SNAPCAST_SCAN_COMPLETED = "event/snapcast/scan/completed",
  SNAPCAST_LIST = "event/snapcast/list",
  SNAPCAST_VOLUME_DRAGGING = "event/snapcast/volume/dragging",

  //States
  CONFIG_STATE = "event/config/state",
  MIXER_STATE = "event/mixer/muted/state",
  SOURCE_STATE = "event/source/state"
}

export enum DIALOG_EVENTS {
  DIALOG_CLOSE = "dialog/close",
  DIALOG_ERROR = "dialog/error",
  DIALOG_PLAYLISTS = "dialog/playlists",
  DIALOG_PLAYLIST_RENAME = "dialog/playist/rename",
  DIALOG_PLAYLIST_DELETE = "dialog/playist/delete",
  DIALOG_CLEAR_LIBRARY = "dialog/local/clear",
  DIALOG_ADD_LIBRARY = "dialog/local/add",
  DIALOG_SCAN_LIBRARY = "dialog/local/scan",
  DIALOG_INFO_LIBRARY = "dialog/local/info",
  DIALOG_SCAN_LIBRARY_ARTIST = "dialog/local/scan/artist",
  DIALOG_BLUETOOTH_NOT_CONNECTED = "dialog/bluetooth/unavailable",
  DIALOG_ADD_SMB = "dialog/storage/smb",
  DIALOG_WIFI_AUTH = "dialog/wifi/auth",
  DIALOG_EDIT_NETWORK = "dialog/network/edit",
  DIALOG_REBOOT = "dialog/system/reboot",
  DIALOG_POWER_OPTIONS = "dialog/system/power",
  DIALOG_SNAPCAST_INFO = "dialog/snapcast/info",
}

export enum OVERLAY_EVENTS {
  OVERLAY_SEARCH = "overlay/search",
  OVERLAY_NOWPLAYING = "overlay/nowplaying",
  OVERLAY_LIBRARY = "overlay/local",
  OVERLAY_VOLUME = "overlay/volume",
  OVERLAY_STANDBY = "overlay/standby",
  OVERLAY_CLOSE = "overlay/close",
}
