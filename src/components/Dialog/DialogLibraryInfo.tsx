import { useDispatch } from "react-redux";
import { DIALOG_EVENTS } from "@/store/constants";
import { Artist } from "@/types";

import Modal from "@/components/Modal";

const DialogLibraryInfo = ({ item }: { item: Artist }) => {
  const dispatch = useDispatch();

  return (
    <Modal title={item.name} onClose={() => dispatch({ type: DIALOG_EVENTS.DIALOG_CLOSE })} isOpen={true} buttonShow={false}>
      <span className="text-secondary">{item.bio ? item.bio : "No information available"}</span>
    </Modal>
  );
};

export default DialogLibraryInfo;
