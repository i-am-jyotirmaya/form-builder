import { Add } from "@mui/icons-material";
import { Button, Sheet } from "@mui/joy";
import { useEffect, useState } from "react";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import BuildFormInput from "../../components/BuildFormInput";
import FeedItem from "../../components/FeedItem";
import Modal from "../../components/Modal";
import { loadFormsAsync, selectForms } from "./feedSlice";

const Feed: React.FC = () => {
  const dispatch = useAppDispatch();

  const [modalVisible, setModalVisible] = useState(false);
  const handleModalClose = () => setModalVisible(false);

  const handleBuildForm = () => {
    setModalVisible(true);
  };

  useEffect(() => {
    dispatch(loadFormsAsync());
  }, []);

  const forms = useAppSelector(selectForms);

  return (
    <Sheet
      sx={{
        paddingX: 3,
      }}
    >
      <div>
        {forms.map((e) => (
          <FeedItem name={e.name} key={e.id} formId={e.id} />
        ))}
      </div>
      <Button
        sx={{
          marginTop: "1rem",
        }}
        startIcon={<Add />}
        onClick={handleBuildForm}
      >
        Build a form
      </Button>
      {modalVisible && (
        <Modal onClose={handleModalClose}>
          <BuildFormInput />
        </Modal>
      )}
    </Sheet>
  );
};

export default Feed;
