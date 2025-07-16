import React from "react";
import { TableRow } from "@mui/material";
import { ProductGridCell } from "@/ProductGrid/ProductGridCell";
import { columns } from "@/ProductGrid/productGridTypes";
import type {
  FocusedCell,
  InnerModeCell,
} from "@/ProductGrid/productGridTypes";

type ProductGridRowProps = {
  rowIdx: number;
  focused: FocusedCell;
  innerMode: InnerModeCell;
  proxyRefs: Array<Array<React.RefObject<HTMLDivElement>>>;
};

export const ProductGridRow: React.FC<ProductGridRowProps> = ({
  rowIdx,
  focused,
  innerMode,
  proxyRefs,
}) => (
  <TableRow
    key={rowIdx}
    role="row"
    aria-rowindex={rowIdx + 2} // +2 because row 1 is header
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
    {columns.map((_, colIdx) => (
      <ProductGridCell
        key={colIdx}
        colIdx={colIdx}
        rowIdx={rowIdx}
        focused={focused}
        innerMode={innerMode}
        proxyRef={proxyRefs[rowIdx][colIdx]}
        tabIndex={
          focused.row === rowIdx && focused.col === colIdx && !innerMode
            ? 0
            : -1
        }
      />
    ))}
  </TableRow>
);
