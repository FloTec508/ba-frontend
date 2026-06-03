import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useMenuActions } from "@/hooks/useMenuActions";
import { useLocalService } from "@/services/local";
import { Album, AnyItem, Artist, Track } from "@/types";
import { MODEL, REF } from "@/constants/refs";

import Page from "@/components/Page";
import TruncateText from "@/components/TruncateText";
import ButtonPlayAll from "@/components/Button/ButtonPlayAll";
import ButtonAddToQueue from "@/components/Button/ButtonAddToQueue";
import LayoutHeightWrapper from "@/components/Wrapper/LayoutHeightWrapper";
import Spinner from "@/components/Spinner";
import ItemWrapper from "@/components/Wrapper/ItemWrapper";
import ListItem from "@/components/Item/ListItem";
import CoverArt from "@/components/CoverArt";
import ActionMenu from "@/components/Actions";
import ScrollingText from "@/components/ScrollingText";

const LocalDetail = () => {
  const { view, id } = useParams<{ view: REF; id: string }>();

  if (!view && !id) return;

  const { getDirectory } = useLocalService();
  const { itemsMenu } = useMenuActions();

  const [item, setItem] = useState<AnyItem>();
  const [tracks, setTracks] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetch = async () => {
      const [tracks, detail] = await Promise.all([getDirectory(`${view}:${id}:tracks`), getDirectory(`${view}:${id}`)]);
      setTracks(tracks);
      setItem(detail[0]);
      setLoading(false);
    };

    fetch();
  }, [view, id]);

  return (
    <Page title="" backButton>
      {loading ? (
        <LayoutHeightWrapper>
          <Spinner />
        </LayoutHeightWrapper>
      ) : (
        <LayoutHeightWrapper>
          {item && (
            <div className="text-center">
              <div className="flex justify-center mb-3">
                <div className="w-60">
                  <CoverArt item={item} disable />
                </div>
              </div>

              <div className="px-3">
                <h2 className="lg:text-4xl text-3xl font-semibold">
                  <ScrollingText text={(item as Album | Artist).name} />
                </h2>

                {item.__model__ === MODEL.ARTIST && (item as Artist).country && <div className="mb-1">{(item as Artist).country}</div>}
                {(item as Album | Artist).genre && <div className="mb-1">{(item as Album | Artist).genre}</div>}
                {item.__model__ === MODEL.ALBUM && (item as Album).date && <div className="mb-1">Released {(item as Album).date}</div>}
                {item.__model__ === MODEL.ARTIST && (
                  <div className="text-sm text-secondary mt-1 mb-3">
                    <TruncateText limit={120}>{(item as Artist).bio ?? "No Information"}</TruncateText>
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

          <div className="w-full">
            {tracks.map((item: Track, index: number) => (
              <ItemWrapper key={item.uri ?? index}>
                <ListItem item={item} />
              </ItemWrapper>
            ))}
          </div>
        </LayoutHeightWrapper>
      )}
    </Page>
  );
};

export default LocalDetail;
