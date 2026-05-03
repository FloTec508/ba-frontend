import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { INTERNAL_EVENTS } from "@/store/constants";
import { useStorageService } from "@/services/storage";
import { useConfigService } from "@/services/config";
import { Directory, Storage } from "@/types";

export function useStorageActions() {
  const dispatch = useDispatch();

  const { setConfig } = useConfigService();
  const { getDirectory, addShared, setMountShared, setShare, setUnshare, setMount, setUnMount, setUnMountShared } = useStorageService();
  const { config } = useSelector((state: any) => state.config);

  const [loading, setLoading] = useState<boolean>(false);

  const storageFetch = async (uri?: string, limit?: number, offset?: number) => {
    setLoading(true);
    try {
      const response = await getDirectory(uri, limit, offset);
      setLoading(false);
      return response;
    } finally {
      setLoading(false);
    }
  };

  const storageConnect = async (ip: string, username: string = "", password: string = "") => {
    setLoading(true);
    try {
      return await addShared(ip, username, password);
    } finally {
      setLoading(false);
    }
  };

  const storageMountShared = async (storages: Storage[]) => {
    setLoading(true);
    try {
      const devs = storages.map((storage) => storage.dev);
      return await setMountShared(devs);
    } finally {
      setLoading(false);
    }
  };

  const libraryPathRemove = (uri: string) => {
    const filtered_paths = config.local.library_path.filter((path: string) => path !== uri);
    setConfig({ local: { library_path: filtered_paths } });
  };

  const libraryPathAdd = (item: Directory) => {
    const library_paths = config.local.library_path;
    const already_exists = library_paths.some((path: string) => path === item.uri);
    if (already_exists) {
      dispatch({
        type: INTERNAL_EVENTS.LIBRARY_PATH_EXISTS,
        payload: null,
      });
    } else {
      setConfig({ local: { library_path: [...library_paths, item.uri] } });
      dispatch({
        type: INTERNAL_EVENTS.LIBRARY_PATH_ADD,
        payload: item,
      });
    }
  };

  const directoryShare = async (item: Directory) => {
    if (await setShare(item.uri)) {
      dispatch({
        type: INTERNAL_EVENTS.STORAGE_SHARED,
        payload: item,
      });
    }
  };

  const directoryUnshare = async (item: Directory) => {
    if (await setUnshare(item.uri)) {
      dispatch({
        type: INTERNAL_EVENTS.STORAGE_UNSHARED,
        payload: item,
      });
    }
  };

  const storageMount = async (item: Storage) => {
    if (await setMount(item.dev)) {
      dispatch({
        type: INTERNAL_EVENTS.STORAGE_MOUNTED,
        payload: item,
      });
    }
  };

  const storageUnMount = async (item: Storage) => {
    if (await setUnMount(item.dev)) {
      dispatch({
        type: INTERNAL_EVENTS.STORAGE_UNMOUNTED,
        payload: item,
      });
    }
  };

  const storageUnMountShared = async (item: Storage) => {
    await setUnMountShared(item.dev);
  };

  return {
    libraryPathAdd,
    libraryPathRemove,
    directoryShare,
    directoryUnshare,
    storageFetch,
    storageConnect,
    storageMount,
    storageUnMount,
    storageMountShared,
    storageUnMountShared,
    loading,
  };
}
