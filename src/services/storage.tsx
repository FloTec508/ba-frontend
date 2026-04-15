import { useSocketRequest } from "@/store/useSocketRequest";

export const useStorageService = () => {
  const { request } = useSocketRequest();

  return {
    getDirectory:  (uri?: string, limit?: number, offset?:number) => request("storage.directory", {uri, limit, offset}),
    setMount: (dev: string) => request("storage.mount", {dev}),
    setUnMount: (dev: string) => request("storage.unmount", {dev}),
    setShare: (uri: string) => request("storage.share", {uri}),
    setUnshare: (uri: string) => request("storage.unshare", {uri}),
    setMountShared: (devs: string[]) => request("storage.mount_shared", {devs}),
    setUnMountShared: (dev: string) => request("storage.unmount_shared", {dev}),
    addShared: (ip: string, username: string, password: string) => request("storage.add_shared", {ip, username, password}),
  }
};
