import { AnyItem, Track } from "@/types";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { OVERLAY_EVENTS } from "@/store/constants";

export function useGoToArtist() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleGoToArtist = (item: AnyItem) => {
    if (!(item as Track)?.artists?.length) return;
    const [view, id] = item?.artists[0].uri.split(":");
    dispatch({ type: OVERLAY_EVENTS.OVERLAY_CLOSE });
    navigate(`/local/${view}/${id}`);
  };

  return { handleGoToArtist };
}
