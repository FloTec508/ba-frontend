import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { INTERNAL_EVENTS } from "@/store/constants";
import { useStorageService } from "@/services/storage";
import { useConfigService } from "@/services/config";
import { Item, StorageItem } from "@/types";

export function useStorageActions() {
  const dispatch = useDispatch();

  const { setConfig } = useConfigService();
  const { getDirectory, addShared, setMountShared } = useStorageService();
  const { config } = useSelector((state: any) => state.config);

  const [loading, setLoading] = useState<boolean>(false);

  const fetchStorages = async () => {
    setLoading(true);
    const response = await getDirectory();

    dispatch({
      type: INTERNAL_EVENTS.STORAGE_UPDATED,
      payload: response,
    });
    setLoading(false);
  };

  const connectStorage = async (ip: string, username: string = "", password: string = "") => {
    setLoading(true);
    const response = await addShared(ip, username, password);
    setLoading(false);
    return response;
  };

  const mountSharedStorage = async (devs: string[]) => {
    setLoading(true);
    const response = await setMountShared(devs);
    setLoading(false);
    return response;
  };

  const removeLibraryPath = (uri: string) => {
    const filtered_paths = config.local.library_path.filter((path: string) => path !== uri);
    setConfig({ local: { library_path: filtered_paths } });
    return true;
  };

  const addLibraryPath = (item: Item | StorageItem) => {
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

    return true;
  };

  return {
    fetchStorages,
    connectStorage,
    mountSharedStorage,
    addLibraryPath,
    removeLibraryPath,
    loading,
  };
}
