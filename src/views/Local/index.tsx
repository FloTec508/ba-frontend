import Page from "@/components/Page";
import Grid from "../../components/InfiniteScroll/Grid";
import List from "../../components/InfiniteScroll/List";
import ListMenu from "@/components/ListMenu";
import ButtonIcon from "@/components/Button/ButtonIcon";
import TruncateText from "@/components/TruncateText";
import ButtonPlayAll from "@/components/Button/ButtonPlayAll";
import ButtonAddToQueue from "@/components/Button/ButtonAddToQueue";
import LayoutHeightWrapper from "@/components/Wrapper/LayoutHeightWrapper";
import ButtonLayoutToggle from "@/components/Button/ButtonLayoutToggle";
import Spinner from "@/components/Spinner";
import ItemWrapper from "@/components/Wrapper/ItemWrapper";
import ListItem from "@/components/Item/ListItem";
import CoverArt from "@/components/CoverArt";
import ActionMenu from "@/components/Actions";
import ScrollingText from "@/components/ScrollingText";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useLocalService } from "@/services/local";
import { Album, AnyItem, Artist, Track, ViewMode } from "@/types";
import { FolderSimpleIcon, GearIcon, MusicNotesIcon, UserIcon, VinylRecordIcon } from "@phosphor-icons/react";
import { ICON_SM, ICON_WEIGHT } from "@/constants";
import { MODEL, REF } from "@/constants/refs";
import { useMenuActions } from "@/hooks/useMenuActions";
import { getImage } from "@/util";

const Local = () => {
  const navigate = useNavigate();

  const { view, id } = useParams<{ view: REF; id: string }>();
  const { getDirectory } = useLocalService();
  const { itemsMenu } = useMenuActions();

  const listType = !view ? "directory" : id ? "detail" : "listing";

  const [layout, setLayout] = useState<ViewMode>("grid");
  const [item, setItem] = useState<AnyItem>();
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

  const onClickItem = async (item: AnyItem) => {
    if (item.__model__ === MODEL.TRACK) return;
    const [view, id] = (item as Artist | Album)?.uri.split(":");
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
        <Page title={""} backButtonOnClick={() => navigate(`/local/${view}`)} backButton>
          {isItemDetailLoading ? (
            <LayoutHeightWrapper>
              <Spinner />
            </LayoutHeightWrapper>
          ) : (
            <LayoutHeightWrapper>
              <div className="">
                <div>
                  {item && (
                    <div className="text-center">
                      <div className="justify-center flex mb-3">
                        <div className="w-60">
                          <CoverArt src={getImage(item)} item={item} disable/>
                        </div>
                      </div>

                      <div className="px-3">
                        <h2 className="lg:text-4xl text-3xl font-semibold">
                          {(item as Album | Artist)?.name && <ScrollingText text={(item as Album | Artist)?.name} />}
                        </h2>

                        {item.__model__ === MODEL.ARTIST && (item as Artist)?.country && <div className="mb-1">{(item as Artist).country}</div>}

                        {(item as Album | Artist) && <div className="mb-1">{(item as Album | Artist)?.genre}</div>}

                        {item.__model__ === MODEL.ALBUM && (item as Album)?.date && <div className="mb-1">Released {(item as Album).date}</div>}

                        {item.__model__ === MODEL.ARTIST && (
                          <div className="text-sm text-secondary mt-1 mb-3">
                            <TruncateText limit={120}>{(item as Artist).bio ? (item as Artist).bio : "No Information"}</TruncateText>
                          </div>
                        )}

                        <div className="flex items-center justify-center my-3">
                          <div className="mr-2 -ml-3">
                            <ButtonPlayAll item={item} />
                          </div>

                          <div className="mr-2">
                            <ButtonAddToQueue item={item} />
                          </div>

                          <div className="mr-1">
                            <ActionMenu items={itemsMenu(item)} />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="w-full">
                {itemsDetailList.length > 0 &&
                  itemsDetailList.map((item: Track, index: number) => (
                    <ItemWrapper key={index}>
                      <ListItem item={item} />
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
