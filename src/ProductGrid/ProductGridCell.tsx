import React from "react";
import { TableCell, Box, styled } from "@mui/material";
import type {
  FocusedCell,
  ProductCardModeCell,
} from "@/ProductGrid/productGridTypes";
import { ProductCard } from "@/ProductGrid/ProductCard";

type ProductGridCellProps = {
  colIdx: number;
  rowIndex: number;
  focusedCell: FocusedCell;
  isInProductCardMode: ProductCardModeCell;
  cellRef: React.RefObject<HTMLDivElement>;
  tabIndex: number;
};

const FocusableBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== "isCellFocused",
})<{ isCellFocused: boolean }>(({ theme, isCellFocused }) => ({
  outline: "none",
  padding: theme.spacing(1),
  minHeight: "48px",
  display: "flex",
  alignItems: "center",
  border: isCellFocused
    ? `2px solid ${theme.palette.primary.main}`
    : "2px solid transparent",
  borderRadius: theme.shape.borderRadius,
  transition: "border-color 0.2s ease-in-out",
  "&:focus-visible": {
    border: `2px solid ${theme.palette.primary.main}`,
    boxShadow: `0 0 0 2px ${theme.palette.primary.main}25`,
  },
}));

export const ProductGridCell: React.FC<ProductGridCellProps> = ({
  colIdx,
  rowIndex,
  focusedCell,
  cellRef,
  tabIndex,
}) => {
  const isCellFocused =
    focusedCell.row === rowIndex && focusedCell.col === colIdx;

  return (
    <TableCell
      role="gridcell"
      sx={{
        padding: 0.5,
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      <FocusableBox
        tabIndex={tabIndex}
        isCellFocused={isCellFocused}
        ref={cellRef}
        aria-selected={isCellFocused}
        aria-colindex={colIdx + 1}
        aria-rowindex={rowIndex + 2} // +2 because row 1 is header
      >
        <ProductCard />
      </FocusableBox>
    </TableCell>
  );
};
