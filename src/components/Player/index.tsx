import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { usePlaybackService } from "@/services/playback";
import { usePlayerActions } from "@/hooks/usePlayerActions";
import { getSubtitle, getTitle } from "@/util";
import { PLAYBACK_STATE } from "@/constants/states";
import { PLAYER_EVENTS } from "@/store/constants";

import VolumeSlider from "./VolumeSlider";
import PositionSlider from "./PositionSlider";
import RepeatButton from "./RepeatButton";
import ScrollingText from "../ScrollingText";
import ShuffleButton from "./ShuffleButton";
import NextButton from "./NextButton";
import PreviousButton from "./PreviousButton";
import PlayPauseButton from "./PlayPauseButton";
import ButtonQueue from "../Button/ButtonQueue";
import SourceDevice from "../Source/SourceDevice";
import CoverArt from "../CoverArt";

const Player = () => {
  const dispatch = useDispatch();

  const { getCurrentTrackPos } = usePlaybackService();
  const { openNowPlayingOverlay } = usePlayerActions();

  const { source } = useSelector((state: any) => state.player);
  const { current_track, playback_state } = useSelector((state: any) => state.player);

  const title = getTitle(current_track?.track);
  const subtitle = getSubtitle(current_track?.track);

  const fetch_pos = async () => {
    const elapsed_ms = await getCurrentTrackPos();
    dispatch({
      type: PLAYER_EVENTS.POSITION_UPDATED,
      payload: elapsed_ms,
    });
  };

  useEffect(() => {
    let sync_pos: ReturnType<typeof setInterval> | null = null;
    if (playback_state === PLAYBACK_STATE.PLAYING) {
      fetch_pos();
      sync_pos = setInterval(() => fetch_pos(), 10000);
    }
    return () => {
      if (sync_pos) clearInterval(sync_pos);
    };
  }, [playback_state]);

  return (
    <>
      <div className="seek-slider seek-slider-mini relative z-10 bg-neutral-950">
        <PositionSlider className="h-1" />
      </div>
      <div className="bg-neutral-200 dark:bg-neutral-900 relative z-0">
        <div className="lg:flex hidden px-4 py-2 items-center ">
          <div className="w-3/8">
            {current_track && (
              <button onClick={openNowPlayingOverlay} className="flex items-center cursor-pointer w-full  text-left">
                <div className="flex items-center grow">
                  <div className="overflow-hidden flex-none rounded-sm mr-3 w-12.5  min-w-12.5">
                    <CoverArt item={current_track?.track} loading={current_track ? false : true} disable />
                  </div>
                  {source.uri && (
                    <div className="overflow-hidden max-w-80">
                      <h2 className="text-xl tracking-tight ">
                        {title ? <ScrollingText text={title} /> : source.name}
                      </h2>
                      <div className="text-secondary overflow-hidden">
                        {subtitle ? <ScrollingText text={subtitle} /> : <SourceDevice />}
                      </div>
                    </div>
                  )}
                </div>
              </button>
            )}
          </div>

          <div className="w-2/8 flex items-center justify-center">
            <ShuffleButton />
            <PreviousButton />
            <PlayPauseButton />
            <NextButton />
            <RepeatButton />
          </div>

          <div className="w-3/8 text-right">
            <div className="flex justify-end text-right items-center">
              <div className="flex items-center gap-3 w-50 max-w-xs mr-5">
                <VolumeSlider classname="volume-slider " />
              </div>
              <div className="flex items-center">
                <div className="mr-2"></div>
                <ButtonQueue />
              </div>
            </div>
          </div>
        </div>

        {/* Mini Player  */}
        <div className="lg:hidden flex items-center justify-between relative bg-neutral-950 text-white">
          <div className="flex items-center p-2 w-4/6 z-20 relative">
            {current_track && (
              <button onClick={openNowPlayingOverlay} className="w-full cursor-pointer text-left">
                <div className="flex items-center">
                  <div className={`overflow-hidden rounded-sm mr-3 min-w-10 w-10`}>
                    <CoverArt item={current_track?.track} loading={current_track ? false : true} disable />
                  </div>
                  {source.uri && (
                    <div className="text-left overflow-hidden">
                      <h2 className={`text-lg font-medium tracking-tight text-white`}>
                        {title ? <ScrollingText text={title} /> : source.name}
                      </h2>
                      <div className=" text-secondary -mt-0.5 lg:-mt-1 text-sm">
                        {subtitle ? <ScrollingText text={subtitle} /> : <SourceDevice />}
                      </div>
                    </div>
                  )}
                </div>
              </button>
            )}
          </div>

          <div className="flex items-center w-2/6 justify-end z-20 relative text-white">
            <div className="mr-2"></div>
            <PlayPauseButton />
          </div>
        </div>
      </div>
    </>
  );
};

export default React.memo(Player);
