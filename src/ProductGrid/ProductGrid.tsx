import React, { useState, useEffect, useRef, useCallback } from "react";
import type { KeyboardEvent } from "react";
import {
  TableContainer,
  Table,
  TableBody,
  Paper,
  Box,
  Typography,
} from "@mui/material";
import { ProductGridHeader } from "@/ProductGrid/ProductGridHeader";
import { ProductGridRow } from "@/ProductGrid/ProductGridRow";
import { columns, initialRows } from "@/ProductGrid/productGridTypes";
import type {
  RowData,
  FocusedCell,
  InnerModeCell,
} from "@/ProductGrid/productGridTypes";

const ProductGrid: React.FC = () => {
  const [rows] = useState<RowData[]>(initialRows);
  const [focused, setFocused] = useState<FocusedCell | null>(null); // Start with no focused cell
  const [innerMode, setInnerMode] = useState<InnerModeCell>(null);

  // Memoized proxy refs creation
  const proxyRefs = useRef<Array<Array<React.RefObject<HTMLDivElement>>>>([]);

  // Initialize proxyRefs immediately
  if (proxyRefs.current.length !== rows.length) {
    proxyRefs.current = rows.map((_, rowIdx) =>
      columns.map(
        (_, colIdx) =>
          proxyRefs.current[rowIdx]?.[colIdx] ||
          React.createRef<HTMLDivElement>()
      )
    );
  }

  // Focus management
  useEffect(() => {
    if (focused && !innerMode) {
      // Only focus grid cell when not in inner mode
      const proxy = proxyRefs.current[focused.row]?.[focused.col]?.current;
      if (proxy) {
        proxy.focus();
      }
    }
  }, [focused, innerMode]);

  useEffect(() => {
    if (innerMode) {
      // Clear grid focus when entering inner mode
      setFocused(null);

      const proxy = proxyRefs.current[innerMode.row]?.[innerMode.col]?.current;
      if (proxy) {
        // Find the ProductCard (Card component) within the proxy
        const productCard = proxy.querySelector(
          '[role="button"]'
        ) as HTMLElement;
        if (productCard) {
          productCard.setAttribute("tabindex", "0");
          productCard.focus();
        }
      }
    }
  }, [innerMode]);

  const handleGridKeyDown = useCallback(
    (event: KeyboardEvent<HTMLTableElement>) => {
      if (event.defaultPrevented) return;

      const { key, shiftKey, ctrlKey, metaKey } = event;
      const isGridNavigationMode = !innerMode;
      const current = isGridNavigationMode ? focused : innerMode;
      if (!current) return;

      const { row: currentRow, col: currentCol } = current;

      // Handle inner mode (ProductCard)
      if (innerMode) {
        const proxy = proxyRefs.current[currentRow][currentCol].current;
        if (!proxy) return;

        const productCard = proxy.querySelector(
          '[role="button"]'
        ) as HTMLElement;
        const buttons = Array.from(
          proxy.querySelectorAll("button")
        ) as HTMLButtonElement[];

        // Include the ProductCard container in focusable elements
        const focusables = productCard ? [productCard, ...buttons] : buttons;
        const activeIdx = focusables.indexOf(
          document.activeElement as HTMLElement
        );

        switch (key) {
          case "Escape": {
            event.preventDefault();
            // Return focus to the grid cell
            const cellPosition = { row: currentRow, col: currentCol };
            setInnerMode(null);
            setFocused(cellPosition);
            break;
          }
          case "Tab":
            event.preventDefault();
            // Loop focus within ProductCard (container + buttons)
            if (focusables.length > 0) {
              const nextIdx = shiftKey
                ? (activeIdx - 1 + focusables.length) % focusables.length
                : (activeIdx + 1) % focusables.length;
              focusables[nextIdx].focus();
            }
            break;
        }
        return;
      }

      // Handle grid navigation mode
      if (isGridNavigationMode && focused) {
        switch (key) {
          case "ArrowUp":
            event.preventDefault();
            if (currentRow > 0) {
              setFocused({ row: currentRow - 1, col: currentCol });
            }
            break;
          case "ArrowDown":
            event.preventDefault();
            if (currentRow < rows.length - 1) {
              setFocused({ row: currentRow + 1, col: currentCol });
            }
            break;
          case "ArrowLeft":
            event.preventDefault();
            if (currentCol > 0) {
              setFocused({ row: currentRow, col: currentCol - 1 });
            }
            break;
          case "ArrowRight":
            event.preventDefault();
            if (currentCol < columns.length - 1) {
              setFocused({ row: currentRow, col: currentCol + 1 });
            }
            break;
          case "Home":
            event.preventDefault();
            if (ctrlKey || metaKey) {
              // Ctrl + Home: first cell in first row
              setFocused({ row: 0, col: 0 });
            } else {
              // Home: first cell in current row
              setFocused({ row: currentRow, col: 0 });
            }
            break;
          case "End":
            event.preventDefault();
            if (ctrlKey || metaKey) {
              // Ctrl + End: last cell in last row
              setFocused({ row: rows.length - 1, col: columns.length - 1 });
            } else {
              // End: last cell in current row
              setFocused({ row: currentRow, col: columns.length - 1 });
            }
            break;
          case "Enter":
            event.preventDefault();
            // Enter: focus the inner ProductCard
            setInnerMode({ row: currentRow, col: currentCol });
            break;
          case "Tab": {
            event.preventDefault();
            setFocused(null);

            // Simple approach: find focusable elements and move focus
            const focusableElements = Array.from(
              document.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
              )
            ).filter((el) => {
              const computedStyle = getComputedStyle(el as Element);
              return (
                computedStyle.display !== "none" &&
                computedStyle.visibility !== "hidden" &&
                (el as HTMLElement).offsetParent !== null
              );
            }) as HTMLElement[];

            // Find current grid table
            const gridTable = event.currentTarget;
            let targetElement: HTMLElement | null = null;

            if (shiftKey) {
              // Shift+Tab: find previous focusable element before grid
              for (let i = focusableElements.length - 1; i >= 0; i--) {
                const rect = focusableElements[i].getBoundingClientRect();
                const gridRect = gridTable.getBoundingClientRect();
                if (
                  rect.top < gridRect.top ||
                  (rect.top === gridRect.top && rect.left < gridRect.left)
                ) {
                  targetElement = focusableElements[i];
                  break;
                }
              }
            } else {
              // Tab: find next focusable element after grid
              for (let i = 0; i < focusableElements.length; i++) {
                const rect = focusableElements[i].getBoundingClientRect();
                const gridRect = gridTable.getBoundingClientRect();
                if (
                  rect.top > gridRect.bottom ||
                  (rect.top === gridRect.bottom && rect.left >= gridRect.left)
                ) {
                  targetElement = focusableElements[i];
                  break;
                }
              }
            }

            if (targetElement) {
              setTimeout(() => targetElement!.focus(), 0);
            }
            break;
          }
        }
      }
    },
    [innerMode, focused, rows.length]
  );

  // Handle when grid container receives focus (Tab into grid)
  const handleGridFocus = useCallback(
    (event: React.FocusEvent) => {
      // Only set focus if we're not already in inner mode and no cell is focused
      if (!focused && !innerMode) {
        // Check if this was a Shift+Tab (coming from after the grid)
        // We can detect this by checking if the related target comes after the grid
        const relatedTarget = event.relatedTarget as HTMLElement;
        if (relatedTarget) {
          const gridRect = event.currentTarget.getBoundingClientRect();
          const targetRect = relatedTarget.getBoundingClientRect();

          // If the related target is positioned after the grid (Shift+Tab scenario)
          if (
            targetRect.top > gridRect.bottom ||
            (targetRect.top === gridRect.bottom &&
              targetRect.left >= gridRect.left)
          ) {
            // Enter at last cell for APG compliance
            setFocused({ row: rows.length - 1, col: columns.length - 1 });
          } else {
            // Normal Tab entry - enter at first cell
            setFocused({ row: 0, col: 0 });
          }
        } else {
          // No related target, default to first cell
          setFocused({ row: 0, col: 0 });
        }
      }
    },
    [focused, innerMode, rows.length]
  );

  // Handle when grid container loses focus (Tab out of grid)
  const handleGridBlur = useCallback(
    (event: React.FocusEvent) => {
      // Only clear focus if the focus is going completely outside the grid
      if (!event.currentTarget.contains(event.relatedTarget) && !innerMode) {
        setFocused(null);
      }
    },
    [innerMode]
  );

  return (
    <Box>
      <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
        Product Grid
      </Typography>
      <TableContainer component={Paper}>
        <Table
          role="grid"
          aria-label="Product Grid"
          onKeyDown={handleGridKeyDown}
          onFocus={handleGridFocus}
          onBlur={handleGridBlur}
          tabIndex={0}
          sx={{
            minWidth: 650,
            "& .MuiTableCell-root": {
              padding: 1,
            },
          }}
        >
          <ProductGridHeader columns={columns} />
          <TableBody role="rowgroup">
            {rows.map((rowData: RowData, rowIdx: number) => (
              <ProductGridRow
                key={rowData.id}
                rowIdx={rowIdx}
                focused={focused || { row: -1, col: -1 }} // Provide fallback for null
                innerMode={innerMode}
                proxyRefs={proxyRefs.current}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ProductGrid;
