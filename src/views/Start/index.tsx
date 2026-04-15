import { ReactElement, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useSourceService } from "@/services/source";
import {
  AirplayIcon,
  BluetoothIcon,
  FadersIcon,
  GearIcon,
  GlobeHemisphereWestIcon,
  PlaylistIcon,
  RadioButtonIcon,
  RadioIcon,
  SpeakerHifiIcon,
  SpotifyLogoIcon,
  UsbIcon,
  VinylRecordIcon,
} from "@phosphor-icons/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Keyboard, Mousewheel, Pagination, Scrollbar } from "swiper/modules";
import { ICON_LG, ICON_WEIGHT } from "@/constants";

import "../../../node_modules/swiper/swiper.css";
import "../../../node_modules/swiper/modules/free-mode.css";
import "../../../node_modules/swiper/modules/pagination.css";

import ButtonStandby from "@/components/Button/ButtonStandby";
import LayoutHeightWrapper from "@/components/Wrapper/LayoutHeightWrapper";
import Page from "@/components/Page";
import Spinner from "@/components/Spinner";

type SourceItem = {
  name: string;
  icon: ReactElement;
  alias: string;
  url?: string;
  disabled?: boolean;
  render?: boolean;
  type?: string;
};
const sources: SourceItem[] = [
  {
    name: "Playlists",
    icon: <PlaylistIcon weight={ICON_WEIGHT} size={ICON_LG} />,
    alias: "playlist",
  },
  {
    name: "DSP",
    icon: <FadersIcon weight={ICON_WEIGHT} size={ICON_LG} />,
    alias: "dsp",
  },
  {
    name: "Library",
    icon: <VinylRecordIcon weight={ICON_WEIGHT} size={ICON_LG} />,
    alias: "local",
  },
  {
    name: "FM Tuner",
    icon: <RadioIcon weight={ICON_WEIGHT} size={ICON_LG} />,
    alias: "tuner",
  },
  {
    name: "Line In",
    icon: <RadioButtonIcon weight={ICON_WEIGHT} size={ICON_LG} />,
    alias: "linein",
  },
  {
    name: "Storage",
    icon: <UsbIcon weight={ICON_WEIGHT} size={ICON_LG} />,
    alias: "storage",
  },
  {
    name: "Radio",
    icon: <GlobeHemisphereWestIcon weight={ICON_WEIGHT} size={ICON_LG} />,
    alias: "radio",
  },
  {
    name: "Bluetooth",
    icon: <BluetoothIcon weight={ICON_WEIGHT} size={ICON_LG} />,
    alias: "bluetooth",
  },
  {
    name: "Spotify",
    icon: <SpotifyLogoIcon weight={ICON_WEIGHT} size={ICON_LG} />,
    alias: "spotify",
  },
  {
    name: "Airplay",
    icon: <AirplayIcon weight={ICON_WEIGHT} size={ICON_LG} />,
    alias: "shairportsync",
  },
  {
    name: "Multiroom",
    icon: <SpeakerHifiIcon weight={ICON_WEIGHT} size={ICON_LG} />,
    alias: "multiroom",
  },
  {
    name: "Settings",
    icon: <GearIcon weight={ICON_WEIGHT} size={ICON_LG} />,
    alias: "settings",
  },
];

const Start = () => {
  const navigate = useNavigate();

  const { setSource } = useSourceService();
  const { source } = useSelector((state: any) => state.player);
  const [loadingItem, setLoadingItem] = useState<string | undefined>(undefined);

  const onClickHandler = async (item: SourceItem) => {
    setLoadingItem(item.alias);
    ["spotify", "shairportsync", "linein", "tuner"].includes(item.alias) && (await setSource(item.alias));
    navigate(`/${item.alias}`);
    setLoadingItem(undefined);
  };

  return (
    <Page
      title="Source"
      rightComponent={
        <div className="flex h-[50px] items-center mr-4">
          <ButtonStandby />
        </div>
      }
    >
      <LayoutHeightWrapper>
        <div className="px-4 flex items-center h-full">
          <div className="w-full">
            <Swiper
              modules={[FreeMode, Keyboard, Mousewheel, Pagination, Scrollbar]}
              spaceBetween={10}
              slidesPerView={4}
              freeMode={true}
              resistance={false}
              touchReleaseOnEdges={true}
              grabCursor={true}
              direction={"horizontal"}
              mousewheel={true}
              pagination={{
                el: ".custom-pagination",
                clickable: true,
              }}
              breakpoints={{
                640: {
                  slidesPerView: 5,
                },
                768: {
                  slidesPerView: 6,
                },
                1024: {
                  slidesPerView: 6,
                },
                1280: {
                  slidesPerView: 6,
                },
              }}
              keyboard={{
                enabled: true,
              }}
            >
              {sources.map((item) => (
                <SwiperSlide>
                  <button
                    key={item.alias}
                    disabled={item.disabled}
                    onClick={() => onClickHandler(item)}
                    className={`hover:bg-black/40 touch-pan-x rounded-lg flex items-center justify-center aspect-square overflow-hidden w-full transition-all duration-200
                cursor-pointer ${item.disabled ? "opacity-30" : source.uri === item.alias ? "text-primary bg-selected" : ""}`}
                  >
                    {loadingItem === item.alias && (
                      <div className="absolute bg-black/80 w-full h-full rounded-lg">
                        <Spinner />
                      </div>
                    )}

                    <div className="flex flex-col items-center">
                      <div className="mb-2">{item.icon}</div>
                      <div className="flex">{item.name}</div>
                    </div>
                  </button>
                </SwiperSlide>
              ))}
            </Swiper>

            <div className="custom-pagination flex gap-2 items-center justify-center mt-4"></div>
          </div>
        </div>
      </LayoutHeightWrapper>
    </Page>
  );
};

export default Start;
