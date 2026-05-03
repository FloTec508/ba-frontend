import { ICON_SM, ICON_WEIGHT, SERVER_URL } from "@/constants";
import { MODEL } from "@/constants/refs";
import { REPEAT_MODE, SHUFFLE_MODE } from "@/constants/states";
import { Album, AnyItem, Artist, TlTrack, Track, Tuner } from "@/types";
import { BluetoothIcon, DeviceMobileIcon, HeadphonesIcon, LaptopIcon, NetworkIcon, WifiHighIcon } from "@phosphor-icons/react";

/**
 * Checks if url contains http, https.
 */
export const isHttpUrl = (url: string): boolean => {
  return /^https?:\/\//i.test(url);
};

/**
 * Returns a comma-separated string of artist names.
 * @param artists - An array of Artist objects.
 * @returns A string listing all artist names, or an empty string if none exist.
 */
export const getArtists = (artists: Artist[]): string => {
  return `${artists?.map((artist: any) => (artist.name?.trim() ? artist.name : undefined)).join(",") || ""}`;
};

/**
 * Returns a comma-separated string of album names.
 * @param albums - An array of Artist objects.
 * @returns A string listing all artist names, or an empty string if none exist.
 */
export const getAlbums = (albums: Album[]): string => {
  return `${albums?.map((album: any) => (album.name?.trim() ? album.name : "Unknown")).join(",") || ""}`;
};

// Determine repeat mode string based on boolean values
export const getRepeatMode = (repeat: boolean, single: boolean): REPEAT_MODE => {
  if (!repeat && !single) return REPEAT_MODE.REPEAT_OFF;
  if (repeat && single) return REPEAT_MODE.REPEAT_SINGLE;
  if (repeat) return REPEAT_MODE.REPEAT_ALL;
  return REPEAT_MODE.REPEAT_OFF;
};

/**
 * Determines shuffle mode based on backend boolean.
 */
export const getShuffleMode = (random: boolean): SHUFFLE_MODE => (random ? SHUFFLE_MODE.SHUFFLE_ON : SHUFFLE_MODE.SHUFFLE_OFF);

/**
 * Converts a duration in ms to mm:ss or hh:mm:ss.
 */
export const convertMillisecondstoTime = (milliseconds: number): string => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const h = String(hours).padStart(2, "0");
  const m = String(minutes).padStart(2, "0");
  const s = String(seconds).padStart(2, "0");

  return hours ? `${h}:${m}:${s}` : `${m}:${s}`;
};

/**
 * Gets total duration of the track.
 */
export const getTotalDuration = (duration: number) => convertMillisecondstoTime(duration ?? 0);

/**
 * Gets current playback position in formatted time.
 */
export const getPosition = (position: number) => convertMillisecondstoTime(position);

/**
 * Returns the track's bitrate in kbps.
 */
export const getBitrate = (bitrate: number) => `${Math.floor((bitrate ?? 0) / 1000)}kbps`;

/**
 * Returns the channels in text.
 */
export const getChannels = (channels: number) => `${channels === 2 ? "Stereo" : "Mono"}`;

/**
 * Returns the track's sample rate in khz.
 */
export const getSampleRate = (samplerate: number) => `${Math.floor((samplerate ?? 0) / 1000)}kHz`;

/**
 * Returns the track'saudio codec shortname.
 */
export const getCodecName = (format: string) => {
  if (!format) return "";

  type CodecFormat =
    | "DSD (Direct Stream Digital), least significant bit first, planar"
    | "Uncompressed 24-bit PCM audio"
    | "Uncompressed 16-bit PCM audio"
    | "MPEG-1 Layer 3 (MP3)"
    | "MPEG-1 Layer 2 (MP2)"
    | "MPEG-4 AAC"
    | "MPEG-2 AAC"
    | "Free Lossless Audio Codec (FLAC)"
    | "Opus (low-latency lossy audio codec)"
    | "Ogg Opus (Opus audio in Ogg container)"
    | "Ogg Vorbis (lossy audio codec)";

  const mapping: Record<CodecFormat, string> = {
    "DSD (Direct Stream Digital), least significant bit first, planar": "DSD",
    "Uncompressed 24-bit PCM audio": "PCM",
    "Uncompressed 16-bit PCM audio": "PCM",
    "MPEG-1 Layer 3 (MP3)": "MP3",
    "MPEG-1 Layer 2 (MP2)": "MP2",
    "MPEG-4 AAC": "AAC",
    "MPEG-2 AAC": "AAC",
    "Free Lossless Audio Codec (FLAC)": "FLAC",
    "Opus (low-latency lossy audio codec)": "OPUS",
    "Ogg Opus (Opus audio in Ogg container)": "OPUS",
    "Ogg Vorbis (lossy audio codec)": "OGG",
  };

  return mapping[format as CodecFormat] || format;
};

/**
 * Returns the track's bit dept rate in bits.
 */
export const getBitDepth = (format: string) => {
  if (!format) return "";

  type AudioFormat = "S16_LE" | "S24_32LE" | "S16" | "S32" | "S24_LE" | "S32_LE" | "S16_BE" | "S24_BE" | "S32_BE" | "S16LE" | "S24LE" | "F32LE";

  const mapping: Record<AudioFormat, string> = {
    S16_LE: "16bit",
    S16: "16bit",
    S32: "32bit",
    S24_LE: "24bit",
    S24_32LE: "32bit",
    S32_LE: "32bit",
    S16_BE: "16bit",
    S24_BE: "24bit",
    S32_BE: "32bit",
    S16LE: "16bit",
    S24LE: "24bit",
    F32LE: "32bit",
  };

  return mapping[format as AudioFormat] || format;
};
/**
 * Returns array to comma seperated list
 */
export const arrayToText = (array: []) => {
  return array?.map((item: any) => item).join(", ");
};

/**
 * Returns MB or GB
 */
export function formatSize(mb: number): string {
  if (mb < 1024) {
    return `${mb.toFixed(2)} MB`;
  } else {
    const gb = mb / 1024;
    return `${gb.toFixed(2)} GB`;
  }
}

/**
 * Convert a size in bytes into a human-readable string
 * (B, KB, MB, GB, TB …) with two decimal places.
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";

  const units = ["B", "KB", "MB", "GB", "TB", "PB"];
  const k = 1024;
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  const value = bytes / Math.pow(k, i);
  return `${value.toFixed(2)} ${units[i]}`;
}

export const formatNo = (no: number) => {
  return String(no).padStart(2, "0");
};

/**
 * Split a "type:id" URI into name and numeric id.
 * @param {string} uri - The URI string (e.g. "playlist:42").
 * @returns {{ name: string, id: number }} The parsed name and id.
 */
export const splitUri = (uri: string) => {
  const [name, path] = uri.split(":");
  return { name, path };
};

export const formatDate = (dateString: string): string => {
  const isoString = dateString.replace(" ", "T");
  const date = new Date(isoString);
  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "short" });
  const year = date.getFullYear();
  return `${day} ${month}, ${year}`;
};

/**
 * Returns the track'saudio codec shortname.
 */
export const getPCMPlaybackName = (device_name: string) => {
  if (!device_name) return "";

  type PCMDevice = "Loopback" | "bcm2835 Headphones" | "RPi DAC+" | "vc4-hdmi-0" | "vc4-hdmi-1";

  const mapping: Record<PCMDevice, string> = {
    Loopback: "Loopback",
    "bcm2835 Headphones": "Headphones",
    "RPi DAC+": "DAC+",
    "vc4-hdmi-0": "HDMI-0",
    "vc4-hdmi-1": "HDMI-1",
  };

  return mapping[device_name as PCMDevice] || device_name;
};

/**
 * Returns the network name and icon
 */
export const getNetworkDeviceName = (device: string) => {
  return (
    <>
      {device === "wlan0" ? (
        <>
          <WifiHighIcon weight={ICON_WEIGHT} size={ICON_SM} className="mr-2" />
        </>
      ) : device === "eth0" ? (
        <>
          <LaptopIcon weight={ICON_WEIGHT} size={ICON_SM} className="mr-2" />
        </>
      ) : (
        <>
          <NetworkIcon weight={ICON_WEIGHT} size={ICON_SM} />
        </>
      )}
    </>
  );
};

/**
 * Converts a Unix timestamp (in seconds) into a human-readable relative time.
 * @param unixSeconds - Unix timestamp in seconds (e.g. Mulitroom timestamp)
 * @returns Human-readable relative time string
 */
export const timeAgo = (unixSeconds: number): string => {
  const nowMs = Date.now();
  const thenMs = unixSeconds * 1000;

  const diffSeconds = Math.floor((nowMs - thenMs) / 1000);

  if (diffSeconds < 0) return "in the future";
  if (diffSeconds < 5) return "now";
  if (diffSeconds < 60) return "few seconds ago";

  const minutes = Math.floor(diffSeconds / 60);
  if (minutes < 60) {
    return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  }

  const days = Math.floor(hours / 24);
  return `${days} day${days !== 1 ? "s" : ""} ago`;
};

export const BluetoothDeviceIcon = ({ type, className }: { type: string; className?: string }) => {
  switch (type) {
    case "audio-headset":
    case "audio-headphones":
      return <HeadphonesIcon weight={ICON_WEIGHT} size={ICON_SM} className={className ?? ""} />;
    case "phone":
      return <DeviceMobileIcon weight={ICON_WEIGHT} size={ICON_SM} className={className ?? ""} />;
    case "computer":
      return <LaptopIcon weight={ICON_WEIGHT} size={ICON_SM} className={className ?? ""} />;
    default:
      return <BluetoothIcon weight={ICON_WEIGHT} size={ICON_SM} className={className ?? ""} />;
  }
};

export const build_image_url = (imageUri: string) => {
  const isRemote = isHttpUrl(imageUri);
  return imageUri ? (isRemote ? imageUri : `${SERVER_URL}/${imageUri}`) : undefined;
};

export const getImage = (item: AnyItem): string | undefined => {
  if (!item) return;
  switch (item.__model__) {
    case MODEL.ALBUM:
    case MODEL.TRACK:
    case MODEL.TUNER:
    case MODEL.FILE:
    case MODEL.ARTIST:
    case MODEL.PLAYLIST:
      return build_image_url((item as Track).images?.[0]?.uri);
    case MODEL.TLTRACK:
      return build_image_url(((item as TlTrack).track as Track).images?.[0]?.uri);
    default:
      return undefined;
  }
};

export const getTitle = (item: AnyItem): string | undefined => {
  if (!item) return;
  switch (item.__model__) {
    case MODEL.ALBUM:
    case MODEL.TRACK:
    case MODEL.TUNER:
    case MODEL.FILE:
    case MODEL.ARTIST:
    case MODEL.PLAYLIST:
    case MODEL.DIRECTORY:
    case MODEL.CATEGORY:
    case MODEL.BLUETOOTH:
    case MODEL.STORAGE:
      return item.name;
    case MODEL.TLTRACK:
      return item.track.name;
    default:
      return undefined;
  }
};

export const getSubtitle = (item: AnyItem): string | undefined => {
  if (!item) return;
  switch (item.__model__) {
    case MODEL.ALBUM:
    case MODEL.TRACK:
      return item.artists?.map((artist: Artist) => artist.name).join(",") || "";
    case MODEL.TLTRACK:
      if (item.track.__model__ === MODEL.TRACK) {
        return item.track?.artists?.map((artist: Artist) => artist.name).join(",") || "";
      }
      if (item.track.__model__ === MODEL.TUNER) {
        return `FM ${item.track.frequency / 10} MHz`;
      }
      return undefined;
    case MODEL.TUNER:
      return `FM ${(item as Tuner).frequency / 10} MHz`;
    case MODEL.FILE:
      return formatBytes(item.size);
    case MODEL.ARTIST:
      return item.albums?.map((album: Album) => album.name).join(",") || undefined;
    case MODEL.PLAYLIST:
      return item.length ? `${String(item.length)} Tracks` : "Empty playlist";
    case MODEL.BLUETOOTH:
      return [
        item.audio_codec,
        item.sample_rate ? getSampleRate(item.sample_rate as number) : null,
        item.bit_depth ? getBitDepth(item.bit_depth as string) : null,
      ]
        .filter(Boolean)
        .join(" · ");
    case MODEL.STORAGE:
      return item.usage
        ? item.status == "mounted"
          ? `${formatBytes(item.usage?.free as number)} available of ${formatBytes(item.usage?.total as number)}`
          : "Unmounted"
        : undefined;
    default:
      return undefined;
  }
};

export const getDuration = (item: AnyItem): string | undefined => {
  switch (item.__model__) {
    case MODEL.TRACK:
      return item.length ? convertMillisecondstoTime((item as Track).length) : undefined;
    case MODEL.PLAYLIST:
      return `${formatDate(item?.last_modified)}`;
    default:
      return undefined;
  }
};
