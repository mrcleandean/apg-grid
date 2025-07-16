import React from "react";
import { Card, CardContent, Avatar, Button, Stack, Box } from "@mui/material";
import { Edit, Delete, Share } from "@mui/icons-material";

export const ProductCard: React.FC = () => {
  const handleContainerAction = () => {
    console.log("Container action triggered");
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("Edit button clicked");
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("Delete button clicked");
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("Share button clicked");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleContainerAction();
    }
  };

  return (
    <Card
      component="div"
      role="button"
      aria-label="Product actions card"
      onClick={handleContainerAction}
      onKeyDown={handleKeyDown}
      sx={{
        cursor: "pointer",
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          boxShadow: 2,
          transform: "translateY(-1px)",
        },
        "&:focus": {
          outline: "2px solid",
          outlineColor: "primary.main",
          outlineOffset: "2px",
        },
      }}
    >
      <CardContent sx={{ p: 1.5, "&:last-child": { pb: 1.5 } }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Avatar
            src="https://placehold.co/32x32"
            alt="User avatar"
            sx={{ width: 32, height: 32 }}
          />
          <Stack direction="row" spacing={1}>
            <Button
              variant="contained"
              size="small"
              startIcon={<Edit />}
              onClick={handleEdit}
              sx={{ minWidth: "auto", px: 1 }}
              aria-label="Edit item"
            >
              Edit
            </Button>
            <Button
              variant="contained"
              color="error"
              size="small"
              startIcon={<Delete />}
              onClick={handleDelete}
              sx={{ minWidth: "auto", px: 1 }}
              aria-label="Delete item"
            >
              Delete
            </Button>
            <Button
              variant="contained"
              color="success"
              size="small"
              startIcon={<Share />}
              onClick={handleShare}
              sx={{ minWidth: "auto", px: 1 }}
              aria-label="Share item"
            >
              Share
            </Button>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
};
