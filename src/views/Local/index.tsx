import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useLocalService } from "@/services/local";
import { Item } from "@/types";
import { getArtists } from "@/util";
import { FolderSimpleIcon, GearIcon, MusicNotesIcon, UserIcon, VinylRecordIcon } from "@phosphor-icons/react";
import { ICON_SM, ICON_WEIGHT } from "@/constants";
import { REF } from "@/constants/refs";
import { ViewMode } from "@/types";
import { usePlayNow } from "@/hooks/usePlayNow";

import Page from "@/components/Page";
import ButtonLayoutToggle from "@/components/Button/ButtonLayoutToggle";
import Grid from "../../components/InfiniteScroll/Grid";
import List from "../../components/InfiniteScroll/List";
import ListMenu from "@/components/ListMenu";
import ButtonIcon from "@/components/Button/ButtonIcon";
import Cover from "@/components/ListItem/Cover";
import TruncateText from "@/components/TruncateText";
import ButtonPlayAll from "@/components/Button/ButtonPlayAll";
import ButtonAddToQueue from "@/components/Button/ButtonAddToQueue";
import FavouriteButton from "@/components/Player/FavouriteButton";
import ButtonAddToPlaylist from "@/components/Button/ButtonAddToPlaylist";
import ButtonInfo from "@/components/Button/ButtonInfo";
import LayoutHeightWrapper from "@/components/Wrapper/LayoutHeightWrapper";
import Spinner from "@/components/Spinner";
import ItemWrapper from "@/components/Wrapper/ItemWrapper";
import ListItem from "@/components/ListItem";

const Local = () => {
  const navigate = useNavigate();
  const { handlePlayNow } = usePlayNow();

  const { view, id } = useParams<{ view: REF; id: string }>();
  const { getDirectory } = useLocalService();

  const listType = !view ? "directory" : id ? "detail" : "listing";

  const [layout, setLayout] = useState<ViewMode>("grid");
  const [item, setItem] = useState<Item>();
  const [itemsDetailList, setItemsDetailList] = useState<any[]>([]);
  const [isItemDetailLoading, setIsItemDetailLoading] = useState<boolean>(true);

  const title: Record<string, string> = {
    [REF.ALBUM]: "Albums",
    [REF.ARTIST]: "Artists",
    [REF.GENRE]: "Genre",
    [REF.TRACK]: "Tracks",
  };

  const directories = [
    {
      name: "Artists",
      icon: <UserIcon weight={ICON_WEIGHT} size={ICON_SM} />,
      type: "artist",
    },
    {
      name: "Albums",
      icon: <VinylRecordIcon weight={ICON_WEIGHT} size={ICON_SM} />,
      type: "album",
    },
    {
      name: "Tracks",
      icon: <MusicNotesIcon weight={ICON_WEIGHT} size={ICON_SM} />,
      type: "track",
    },
    {
      name: "Genre",
      icon: <FolderSimpleIcon weight={ICON_WEIGHT} size={ICON_SM} />,
      type: "genre",
    },
  ];

  const fetchDetail = async (query: string) => {
    const response = await getDirectory(query);
    setItem(response[0]);
  };

  const fetchDetailList = async (query: string) => {
    const responseDetaiList = await getDirectory(query);
    setItemsDetailList(responseDetaiList);
  };

  useEffect(() => {
    if (listType === "detail") {
      (async () => {
        await Promise.all([fetchDetailList(`${view}:${id}:tracks`), fetchDetail(`${view}:${id}`)]);
        setIsItemDetailLoading(false);
      })();
    }
  }, [listType, view, id]);

  const onClickItem = async (item: Item) => {
    if (item.type === REF.TRACK) return;
    const [view, id] = item.uri.split(":");
    setItem(undefined);
    setIsItemDetailLoading(true);
    navigate(`/local/${view}/${id}`);
  };

  const onClickDirectory = (view: string) => {
    navigate(`/local/${view}`);
  };

  return (
    <>
      <div className={`${listType === "detail" ? "show" : "hide"}`}>
        <Page title={item?.name} backButtonOnClick={() => navigate(`/local/${view}`)} backButton>
          {isItemDetailLoading ? (
            <LayoutHeightWrapper>
              <Spinner />
            </LayoutHeightWrapper>
          ) : (
            <LayoutHeightWrapper>
              <div className="w-full">
                <div className="bg-neutral-950 p-5 lg:rounded-lg">
                {item && (
                  <div className="flex">
                    <div className="justify-center flex w-2/5">
                      <div className="mr-4 w-full">
                        <Cover item={item} cover_only />
                      </div>
                    </div>

                    <div className="w-3/5 text-white">
                      {item?.performers.length ? (
                        <div className="mb-1">
                          <TruncateText>Performers : {getArtists(item.artists)}</TruncateText>
                        </div>
                      ) : null}

                      {item?.date && (
                        <div className="mb-1">
                          <TruncateText>Released on {item.date}</TruncateText>
                        </div>
                      )}

                      {item?.genre && (
                        <div className="mb-1">
                          <TruncateText><b>Genre</b> : {item.genre}</TruncateText>
                        </div>
                      )}

                      {item?.country && (
                        <div className="mb-1">
                          <TruncateText>Country : {item.country}</TruncateText>
                        </div>
                      )}
                        <div className="text-sm text-secondary mt-1 mb-3">
                          <TruncateText limit={120}>{item?.comment ? item.comment : 'No Information'}</TruncateText>
                        </div>

                      <div className="flex items-center mt-2">
                        <div className="mr-1 -ml-3">
                          <ButtonPlayAll item={item} />
                        </div>

                        <div className="mr-1">
                          <ButtonAddToQueue item={item} />
                        </div>

                        <div className="mr-1">
                          <FavouriteButton />
                        </div>

                        <div className="mr-1">
                          <ButtonAddToPlaylist item={item} />
                        </div>

                        {view === REF.ARTIST && (
                          <div className="mr-1">
                            <ButtonInfo item={item} />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div></div>
              <div className="w-full">
                {itemsDetailList.length > 0 &&
                  itemsDetailList.map((item: any, index: number) => (
                    <ItemWrapper key={index}>
                      <ListItem key={item.uri} item={item} index={index} onClickCallback={handlePlayNow}/>
                    </ItemWrapper>
                  ))}
              </div>
            </LayoutHeightWrapper>
          )}
        </Page>
      </div>
      <div className={`${listType === "listing" ? "show" : "hide"}`}>
        <Page
          wfull={layout === "grid"}
          title={title[view as REF]}
          rightComponent={
            <div className="mr-4">
              <ButtonLayoutToggle setLayoutype={setLayout} layoutType={layout} />
            </div>
          }
          backButtonOnClick={() => navigate(`/local/`)}
          backButton
        >
          {layout === "list" && <List uri={view as REF} getDirectory={getDirectory} onClickCallback={onClickItem} />}
          {layout === "grid" && <Grid uri={view as REF} getDirectory={getDirectory} onClickCallback={onClickItem} />}
        </Page>
      </div>
      <div className={`${listType === "directory" ? "show" : "hide"}`}>
        <Page
          title="Library"
          backButton
          backButtonOnClick={() => navigate("/")}
          rightComponent={
            <div className="mr-4">
              <ButtonIcon onClick={() => navigate("/settings/local")}>
                <GearIcon weight={ICON_WEIGHT} size={ICON_SM} />
              </ButtonIcon>
            </div>
          }
        >
          {directories.map((dir, index: number) => (
            <ListMenu key={index} name={dir.name} icon={dir.icon} onClick={() => onClickDirectory(dir.type)} />
          ))}
        </Page>
      </div>
    </>
  );
};

export default Local;
