import { Edit, Visibility } from "@mui/icons-material";
import { Sheet, Typography } from "@mui/joy";
import IconButton from "@mui/joy/IconButton";
import React from "react";
import { useNavigate } from "react-router-dom";

const FeedItem = ({ name, formId }: { name?: string; formId: string }) => {
  const navigate = useNavigate();
  const handleEdit = () => {
    navigate(`${formId}`);
  };

  const handleView = () => {
    navigate(`${formId}/view`);
  };
  return (
    <Sheet
      sx={{
        padding: "1em 1.5em",
        borderRadius: 15,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
      variant="outlined"
    >
      <div>{name ?? "Name"}</div>
      <div>
        <IconButton title="View form" onClick={handleView} variant="soft">
          <Visibility />
        </IconButton>
        <IconButton
          sx={{
            marginLeft: "1rem",
          }}
          variant="soft"
          onClick={handleEdit}
        >
          <Edit />
        </IconButton>
      </div>
    </Sheet>
  );
};

export default FeedItem;
