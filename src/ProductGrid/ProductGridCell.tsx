import React from "react";
import { TableCell, Box, styled } from "@mui/material";
import type {
  FocusedCell,
  InnerModeCell,
} from "@/ProductGrid/productGridTypes";
import { ProductCard } from "@/ProductGrid/ProductCard";

type ProductGridCellProps = {
  colIdx: number;
  rowIdx: number;
  focused: FocusedCell;
  innerMode: InnerModeCell;
  proxyRef: React.RefObject<HTMLDivElement>;
  tabIndex: number;
};

const FocusableBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== "isFocused",
})<{ isFocused: boolean }>(({ theme, isFocused }) => ({
  outline: "none",
  padding: theme.spacing(1),
  minHeight: "48px",
  display: "flex",
  alignItems: "center",
  border: isFocused
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
  rowIdx,
  focused,
  proxyRef,
  tabIndex,
}) => {
  const isFocused = focused.row === rowIdx && focused.col === colIdx;

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
        isFocused={isFocused}
        ref={proxyRef}
        aria-selected={isFocused}
        aria-colindex={colIdx + 1}
        aria-rowindex={rowIdx + 2} // +2 because row 1 is header
      >
        <ProductCard />
      </FocusableBox>
    </TableCell>
  );
};
