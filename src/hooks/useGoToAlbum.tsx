import { OVERLAY_EVENTS } from "@/store/constants";
import { AnyItem, Track } from "@/types";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

export function useGoToAlbum() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleGoToAlbum = (item: AnyItem) => {
    if (!(item as Track)?.albums?.length) return;
    const [view, id] = (item as Track)?.albums[0].uri.split(":");
    dispatch({ type: OVERLAY_EVENTS.OVERLAY_CLOSE });
    navigate(`/local/${view}/${id}`);
  };

  return { handleGoToAlbum };
}
