import React from "react";
import { TableHead, TableRow, TableCell, Typography } from "@mui/material";
import type { Column } from "@/ProductGrid/productGridTypes";

export const ProductGridHeader: React.FC<{ columns: Column[] }> = ({
  columns,
}) => (
  <TableHead>
    <TableRow
      role="row"
      sx={{
        "& th": {
          backgroundColor: "grey.50",
          borderBottom: "2px solid",
          borderColor: "divider",
          fontWeight: "bold",
        },
      }}
    >
      {columns.map((col, colIdx) => (
        <TableCell
          key={colIdx}
          role="columnheader"
          component="th"
          scope="col"
          aria-colindex={colIdx + 1}
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 1,
            minWidth:
              col.field === "id" ? 80 : col.field === "value" ? 100 : 120,
          }}
        >
          <Typography
            variant="subtitle2"
            component="span"
            sx={{
              fontWeight: "bold",
              color: "text.primary",
            }}
          >
            {col.headerName}
          </Typography>
        </TableCell>
      ))}
    </TableRow>
  </TableHead>
);
