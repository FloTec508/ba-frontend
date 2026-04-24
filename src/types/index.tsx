import { EVENTS } from "@/constants/events";
import { MODEL, REF } from "@/constants/refs";
import { PLAYBACK_STATE, REPEAT_MODE, SHUFFLE_MODE } from "@/constants/states";
import { SelectProps } from "antd";

export interface Artist {
  __model__: MODEL.ARTIST;
  uri: string;
  name: string;
  sortname: string | null;
  musicbrainz_id: string | null;
}

export interface Album {
  __model__: MODEL.ALBUM;
  uri: string;
  name: string;
  artists: Artist[];
  num_tracks: number | null;
  num_discs: number | null;
  date: string | null;
  musicbrainz_id: string | null;
}

export interface Image {
  __model__: MODEL.IMAGE;
  uri: string;
  width: number | null;
  height: number | null;
}

export interface Track {
  __model__: MODEL.TRACK;
  uri: string;
  name: string;
  artists: Artist[];
  album: Album;
  albums?: Album[];
  composers: Artist[];
  performers: Artist[];
  genre: string | null;
  track_no: number | null;
  disc_no: number | null;
  date: string | null;
  length: number;
  bitrate: number;
  comment: string | null;
  musicbrainz_id: string | null;
  last_modified: number | null;
  images: Image[];
  audio_codec: string;
  sample_rate: number;
  channels: number;
  bit_depth: any;
}

export interface TlTrack {
  __model__: "TlTrack";
  tlid: number;
  track: Track;
}

export interface Playlist {
  __model__: "Playlist";
  uri: string;
  name: string;
  tracks: TlTrack[];
  last_modified: string;
}

export interface Item {
  __model__: MODEL.ITEM;
  uri: string;
  name: string;
  type: REF;
  artists: Artist[];
  albums: Album[];
  composers: Artist[];
  performers: Artist[];
  genre: string;
  track_no: number;
  country: string;
  disc_no: number;
  date: string;
  length: number;
  bitrate: number;
  comment: string;
  musicbrainz_id: string | null;
  last_modified: string;
  images: Image[];
  shared?: boolean;
  status?: string;
  usage?: StorageUsage;
}

export interface MediaPlayer {
  source: Source;
  playback_state: PLAYBACK_STATE;
  repeat_mode: REPEAT_MODE;
  shuffle_mode: SHUFFLE_MODE;
  volume: number | undefined;
  mute: boolean;
  elapsed_ms: number;
  current_track: TlTrack;
  current_track_cover: string | undefined;
  current_playlist: TlTrack[];
  current_playlist_loading: boolean;
  is_standby: boolean;
}

export interface Source {
  type?: string;
  name?: string;
  uri?: string;
  controls?: string[];
  state?: {
    connected?: boolean;
    user_name?: string;
    connection_id?: string;
    name?: string;
    icon?: string;
    address?: string;
  };
}

export interface BluetoothDevice {
  address: string;
  name: string;
  profile: string | null;
  alias: string;
  icon: string;
  paired: boolean;
  trusted: boolean;
  connected: boolean;
  soft_volume: boolean;
  volume: number[];
  channels: number | null;
  audio_codec: string | null;
  sample_rate: number | null;
  bit_depth: string | null;
  uuids: string[] | null;
}

export interface AdapterState {
  powered: boolean;
  discoverable: boolean;
  pairable: boolean;
  connected: boolean | BluetoothDevice;
}

export interface BluetoothState {
  adapter_state: AdapterState;
  devices: BluetoothDevice[];
}

export interface SnapcastServer {
  service_name: string;
  name: string;
  ip: string;
  port: number;
  connected: boolean;
  status: "playing" | "idle" | "unavailable";
}

export interface SnapcastState {
  status: {
    groups?: [];
    server?: {};
    streams?: [];
  };
  servers: SnapcastServer[];
  dragging: boolean;
}

export interface StorageState {
  last_shared_event: { event: EVENTS; uri: string } | {};
  storages: Storage[];
}

export interface StorageUsage {
  total: number;
  used: number;
  free: number;
}

export interface Storage {
  __model__: MODEL.STORAGE;
  type: "internal" | "removable" | "nas" | "directory";
  uri: string;
  size: number | null;
  name: string;
  dev: string;
  shared: boolean;
  fstype: string;
  status: "mounted" | "unmounted";
  usage: StorageUsage | null;
  read_only: boolean | null;
  guest_allowed: boolean | null;
  user: string | null;
  create_permissions: string | null;
  directory_permissions: string | null;
}

export interface Directory {
  __model__: MODEL.DIRECTORY;
  uri: string;
  name: string;
  shared: boolean;
}

export interface File {
  __model__: MODEL.FILE;
  uri: string;
  name: string;
  size: number;
  ext: string;
}

export interface NetworkState {
  networks: WifiNetwork[];
  devices: {};
}

export interface NetworkDevice {
  device: string;
  type: string;
  mac_address: string;
  mtu: string;
  state: string;
  connection: string;
  ipv4_address: string;
  ipv4_gateway: string;
  ipv4_dns: string;
  ipv4_routes: string[];
  ipv6_addresses: string[];
  ipv6_gateway: string;
  ipv6_dns: string;
  ipv6_routes: string[];
}

export interface NetworkConnectionInfo {
  name: string;
  uuid: string | null;
  device: string;
  ip_iface: string | null;
  state: string | null;
  is_default: string | null;
  is_default6: string | null;
  vpn: string | null;
  dbus_path: string | null;
  con_path: string | null;
  zone: string | null;
  master_path: string | null;
  connection_id: string | null;
  connection_uuid: string | null;
  connection_type: string | null;
  connection_interface: string | null;
  connection_autoconnect: string | null;
  connection_autoconnect_priority: string | null;
  connection_read_only: string | null;
  connection_timestamp: string | null;
  connection_metered: string | null;
  ethernet_port: string | null;
  ethernet_speed: string | null;
  ethernet_duplex: string | null;
  ethernet_auto_negotiate: string | null;
  ethernet_mac: string | null;
  ethernet_mtu: string | null;
  ipv4_method: string;
  ipv4_dns: string | null;
  ipv4_dns_search: string | null;
  ipv4_dns_options: string | null;
  ipv4_dns_priority: string | null;
  ipv4_addresses: string | null;
  ipv4_gateway: string | null;
  ipv4_route_metric: string | null;
  ipv4_route_table: string | null;
  ipv4_may_fail: string | null;
  ipv4_address: string | null;
  ipv4_gateway_runtime: string | null;
  ipv4_dns_runtime: string | null;
  ipv4_routes: (string | null)[];
  ipv6_method: string | null;
  ipv6_dns: string | null;
  ipv6_dns_priority: string | null;
  ipv6_gateway: string | null;
  ipv6_route_metric: string | null;
  ipv6_route_table: string | null;
  ipv6_addresses: (string | null)[];
  ipv6_gateway_runtime: string | null;
  ipv6_dns_runtime: string | null;
  ipv6_routes: (string | null)[];
}

export interface WifiNetwork {
  ssid: string;
  bssid: string;
  mode: string;
  channel: number;
  frequency: number;
  rate: number;
  signal: number;
  security: string;
  connected: boolean;
}

export type ViewMode = "list" | "grid";

export interface PcmDevice {
  device: string;
  name: string;
  channel_count: number;
  supported_formats?: string[];
  supported_sample_rates?: string[];
  card_name: string;
  card_index: number;
  mixer_controls: string[];
  description: string;
  dtoverlay: string;
  volume_control_mixer: string;
}

export interface AlsaDevice {
  name: string;
  card: string;
  dtoverlay: string | null;
  device: string | null;
  description: string | null;
}

export interface AlsaVolumeDevice {
  name: string;
  card: string;
  device: string | null;
  description: string | null;
  type: "playback" | "capture";
  channels: number;
  range: {
    min: number;
    max: number;
    unit: "dB";
  };
  muted: boolean;
}

export interface SelectOption {
  label: string;
  value: string;
}

export interface CustomSelect<T = any> extends SelectProps<T> {}

export type Nullable<T> = T | null;

export interface SystemConfig {
  hostname: string;
  timezone: string;
}

export interface SpotifyConfig {
  bitrate: number;
  bit_depth: string;
  volume_default: number;
  volume_normalization: boolean;
}

export interface SmbClient {
  username: string;
  password: string;
}

export interface StorageConfig {
  username: Nullable<string>;
  password: Nullable<string>;
  smb_clients: Record<string, SmbClient>;
}

export interface NetworkConfig {
  apmode_password: string;
}

export interface DisplayConfig {
  output_display: Nullable<string>;
  visualizer_layout: number;
}

export interface LineInConfig {
  input_device: string;
  sample_rate: number;
  bit_depth: string;
  gain: number;
}

export interface TunerConfig {
  input_device: string;
  sample_rate: number;
  bit_depth: string;
  gain: number;
}

export interface DspConfig {
  default_capture_device: string;
  default_gain: number;
  resample_rate: number | null;
}

export interface MultiroomConfig {
  capture_device: string;
  playback_device: string;
  server: boolean;
  codec: string;
  chunk: number;
  buffer: number;
}

export interface MixerConfig {
  output_device: string;
  hw_device: string;
  dtoverlay: string;
  volume_default: number;
  volume_device: string;
}

export interface PlaybackConfig {
  background_albumart: boolean;
}

export interface Config {
  system: SystemConfig;
  spotify: SpotifyConfig;
  storage: StorageConfig;
  network: NetworkConfig;
  display: DisplayConfig;
  linein: LineInConfig;
  tuner: TunerConfig;
  dsp: DspConfig;
  multiroom: MultiroomConfig;
  mixer: MixerConfig;
  playback: PlaybackConfig;
  web: Record<string, never>;
  radio: Record<string, never>;
  source: Record<string, never>;
  shairportsync: Record<string, never>;
  bluetooth: Record<string, never>;
  local: { library_path: string[] };
  search: Record<string, never>;
  playlist: Record<string, never>;
  infrared: Record<string, never>;
  command: Record<string, never>;
}

export type AnyItem = Item | Track | Album | Artist | File | Directory | Storage;