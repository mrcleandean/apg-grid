import React from "react";
import { TableRow } from "@mui/material";
import { ProductGridCell } from "@/ProductGrid/ProductGridCell";
import type {
  FocusedCell,
  ProductCardModeCell,
} from "@/ProductGrid/productGridTypes";

type ProductGridRowProps = {
  rowIndex: number;
  focusedCell: FocusedCell;
  isInProductCardMode: ProductCardModeCell;
  gridCellRefs: Array<Array<React.RefObject<HTMLDivElement>>>;
  columnCount: number;
};

export const ProductGridRow: React.FC<ProductGridRowProps> = ({
  rowIndex,
  focusedCell,
  isInProductCardMode,
  gridCellRefs,
  columnCount,
}) => {
  return (
    <TableRow
      key={rowIndex}
      role="row"
      aria-rowindex={rowIndex + 1} // Updated since no header
      sx={{
        "&:nth-of-type(odd)": {
          backgroundColor: "action.hover",
        },
        "&:hover": {
          backgroundColor: "action.selected",
        },
        transition: "background-color 0.2s ease-in-out",
      }}
    >
      {Array.from({ length: columnCount }, (_, colIdx) => {
        const isCellFocused =
          focusedCell.row === rowIndex && focusedCell.col === colIdx;
        const shouldCellBeFocusable = isCellFocused && !isInProductCardMode;

        return (
          <ProductGridCell
            key={colIdx}
            colIdx={colIdx}
            rowIndex={rowIndex}
            focusedCell={focusedCell}
            isInProductCardMode={isInProductCardMode}
            cellRef={gridCellRefs[rowIndex][colIdx]}
            tabIndex={shouldCellBeFocusable ? 0 : -1}
          />
        );
      })}
    </TableRow>
  );
};
