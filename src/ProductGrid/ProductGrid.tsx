import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import type { KeyboardEvent } from "react";
import {
  TableContainer,
  Table,
  TableBody,
  Paper,
  Box,
  Typography,
  Button,
} from "@mui/material";
import { useInView } from "react-intersection-observer";
import { ProductGridRow } from "@/ProductGrid/ProductGridRow";
import { initialRows } from "@/ProductGrid/productGridTypes";
import type {
  RowData,
  FocusedCell,
  ProductCardModeCell,
} from "@/ProductGrid/productGridTypes";

type ProductGridProps = {
  columnCount: number;
};

const ProductGrid: React.FC<ProductGridProps> = ({ columnCount }) => {
  const [rows, setRows] = useState<RowData[]>(initialRows);
  const [focusedCell, setFocusedCell] = useState<FocusedCell | null>(null);
  const [isInProductCardMode, setIsInProductCardMode] =
    useState<ProductCardModeCell>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Refs for infinite loading and back to top
  const { ref: lastRowRef, inView: isLastRowVisible } = useInView({
    threshold: 1.0,
    rootMargin: "0px",
  });

  const { ref: firstRowRef, inView: isFirstRowVisible } = useInView({
    threshold: 1.0,
    rootMargin: "0px",
  });

  // Ref to store grid cell references for focus management
  const gridCellRefs = useRef<Array<Array<React.RefObject<HTMLDivElement>>>>(
    []
  );

  // Initialize grid cell refs
  const initializeGridCellRefs = () => {
    if (gridCellRefs.current.length !== rows.length) {
      gridCellRefs.current = rows.map((_, rowIndex) =>
        Array.from(
          { length: columnCount },
          (_, colIdx) =>
            gridCellRefs.current[rowIndex]?.[colIdx] ||
            React.createRef<HTMLDivElement>()
        )
      );
    }
  };

  // Initialize refs on component mount and when rows change
  initializeGridCellRefs();

  // Memoized grid dimensions for better performance
  const gridDimensions = useMemo(
    () => ({
      totalRows: rows.length,
      totalCols: columnCount,
      lastRowIndex: rows.length - 1,
      lastColIndex: columnCount - 1,
    }),
    [rows.length, columnCount]
  );

  // Memoized boolean flags for cleaner logic
  const gridState = useMemo(
    () => ({
      hasFocusedCell: focusedCell !== null,
      isInProductCardMode: isInProductCardMode !== null,
      shouldShowGridFocus: focusedCell !== null && isInProductCardMode === null,
    }),
    [focusedCell, isInProductCardMode]
  );

  // Infinite loading effect
  useEffect(() => {
    if (isLastRowVisible && !isLoading) {
      setIsLoading(true);

      // Simulate loading delay
      setTimeout(() => {
        const newRows = Array.from({ length: 3 }, (_, index) => ({
          id: rows.length + index + 1,
          name: `Item ${rows.length + index + 1}`,
          value: (rows.length + index + 1) * 10,
          description: `Desc ${rows.length + index + 1}`,
        }));

        setRows((prev) => [...prev, ...newRows]);
        setIsLoading(false);
      }, 500);
    }
  }, [isLastRowVisible, isLoading, rows.length]);

  // Back to top functionality
  const handleBackToTop = useCallback(() => {
    // Scroll to top and focus first cell
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => {
      setFocusedCell({ row: 0, col: 0 });
    }, 300);
  }, []);

  // Check if back to top button should be shown
  const shouldShowBackToTop = !isFirstRowVisible;
  const isElementAfterGrid = useCallback(
    (element: HTMLElement, grid: EventTarget): boolean => {
      const gridRect = (grid as HTMLElement).getBoundingClientRect();
      const elementRect = element.getBoundingClientRect();
      return (
        elementRect.top > gridRect.bottom ||
        (elementRect.top === gridRect.bottom &&
          elementRect.left >= gridRect.left)
      );
    },
    []
  );

  // Memoized helper function to find focusable elements
  const findNextFocusableElement = useCallback(
    (gridTable: HTMLElement, shouldGoBackward: boolean): HTMLElement | null => {
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

      let targetElement: HTMLElement | null = null;
      const gridRect = gridTable.getBoundingClientRect();

      if (shouldGoBackward) {
        // Shift+Tab: find previous focusable element before grid
        for (let i = focusableElements.length - 1; i >= 0; i--) {
          const rect = focusableElements[i].getBoundingClientRect();
          if (
            rect.top < gridRect.top ||
            (rect.top === gridRect.top && rect.left < gridRect.left)
          ) {
            targetElement = focusableElements[i];
            break;
          }
        }
      } else {
        // Tab: check if back-to-top button exists and is visible
        if (shouldShowBackToTop) {
          const backToTopButton = document.querySelector(
            '[data-testid="back-to-top-btn"]'
          ) as HTMLElement;
          if (backToTopButton) {
            targetElement = backToTopButton;
          }
        }

        // If no back-to-top button, find next focusable element after grid
        if (!targetElement) {
          for (let i = 0; i < focusableElements.length; i++) {
            const rect = focusableElements[i].getBoundingClientRect();
            if (
              rect.top > gridRect.bottom ||
              (rect.top === gridRect.bottom && rect.left >= gridRect.left)
            ) {
              targetElement = focusableElements[i];
              break;
            }
          }
        }
      }

      return targetElement;
    },
    [shouldShowBackToTop]
  );

  // Focus management - focus grid cell when not in ProductCard mode
  useEffect(() => {
    if (gridState.shouldShowGridFocus && focusedCell) {
      const gridCellProxy =
        gridCellRefs.current[focusedCell.row]?.[focusedCell.col]?.current;
      if (gridCellProxy) {
        gridCellProxy.focus();
      }
    }
  }, [focusedCell, gridState.shouldShowGridFocus]);

  // ProductCard focus management - focus ProductCard when entering ProductCard mode
  useEffect(() => {
    if (gridState.isInProductCardMode && isInProductCardMode) {
      // Clear grid focus when entering ProductCard mode
      setFocusedCell(null);

      const gridCellProxy =
        gridCellRefs.current[isInProductCardMode.row]?.[isInProductCardMode.col]
          ?.current;
      if (gridCellProxy) {
        // Find the ProductCard (Card component) within the proxy
        const productCard = gridCellProxy.querySelector(
          '[role="button"]'
        ) as HTMLElement;
        if (productCard) {
          productCard.setAttribute("tabindex", "0");
          productCard.focus();
        }
      }
    }
  }, [isInProductCardMode, gridState.isInProductCardMode]);

  const handleGridKeyDown = useCallback(
    (event: KeyboardEvent<HTMLTableElement>) => {
      if (event.defaultPrevented) return;

      const { key, shiftKey, ctrlKey, metaKey } = event;
      const isInGridNavigationMode = !isInProductCardMode;
      const currentCell = isInGridNavigationMode
        ? focusedCell
        : isInProductCardMode;
      if (!currentCell) return;

      const { row: currentRow, col: currentCol } = currentCell;

      // Handle ProductCard mode navigation
      if (isInProductCardMode) {
        const gridCellProxy =
          gridCellRefs.current[currentRow][currentCol].current;
        if (!gridCellProxy) return;

        const productCard = gridCellProxy.querySelector(
          '[role="button"]'
        ) as HTMLElement;
        const buttons = Array.from(
          gridCellProxy.querySelectorAll("button")
        ) as HTMLButtonElement[];

        // Include the ProductCard container in focusable elements
        const focusableElements = productCard
          ? [productCard, ...buttons]
          : buttons;
        const activeElementIndex = focusableElements.indexOf(
          document.activeElement as HTMLElement
        );

        switch (key) {
          case "Escape": {
            event.preventDefault();
            // Return focus to the grid cell
            const cellPosition = { row: currentRow, col: currentCol };
            setIsInProductCardMode(null);
            setFocusedCell(cellPosition);
            break;
          }
          case "Tab":
            event.preventDefault();
            // Loop focus within ProductCard (container + buttons)
            if (focusableElements.length > 0) {
              const nextElementIndex = shiftKey
                ? (activeElementIndex - 1 + focusableElements.length) %
                  focusableElements.length
                : (activeElementIndex + 1) % focusableElements.length;
              focusableElements[nextElementIndex].focus();
            }
            break;
        }
        return;
      }

      // Handle grid navigation mode
      if (isInGridNavigationMode && focusedCell) {
        switch (key) {
          case "ArrowUp":
            event.preventDefault();
            if (currentRow > 0) {
              setFocusedCell({ row: currentRow - 1, col: currentCol });
            }
            break;
          case "ArrowDown":
            event.preventDefault();
            if (currentRow < gridDimensions.lastRowIndex) {
              setFocusedCell({ row: currentRow + 1, col: currentCol });
            }
            break;
          case "ArrowLeft":
            event.preventDefault();
            if (currentCol > 0) {
              setFocusedCell({ row: currentRow, col: currentCol - 1 });
            }
            break;
          case "ArrowRight":
            event.preventDefault();
            if (currentCol < gridDimensions.lastColIndex) {
              setFocusedCell({ row: currentRow, col: currentCol + 1 });
            }
            break;
          case "Home":
            event.preventDefault();
            if (ctrlKey || metaKey) {
              // Ctrl + Home: first cell in first row
              setFocusedCell({ row: 0, col: 0 });
            } else {
              // Home: first cell in current row
              setFocusedCell({ row: currentRow, col: 0 });
            }
            break;
          case "End":
            event.preventDefault();
            if (ctrlKey || metaKey) {
              // Ctrl + End: last cell in last row
              setFocusedCell({
                row: gridDimensions.lastRowIndex,
                col: gridDimensions.lastColIndex,
              });
            } else {
              // End: last cell in current row
              setFocusedCell({
                row: currentRow,
                col: gridDimensions.lastColIndex,
              });
            }
            break;
          case "Enter":
            event.preventDefault();
            // Enter: focus the ProductCard
            setIsInProductCardMode({ row: currentRow, col: currentCol });
            break;
          case "Tab": {
            event.preventDefault();
            setFocusedCell(null);

            const targetElement = findNextFocusableElement(
              event.currentTarget,
              shiftKey
            );
            if (targetElement) {
              setTimeout(() => targetElement.focus(), 0);
            }
            break;
          }
        }
      }
    },
    [isInProductCardMode, focusedCell, gridDimensions, findNextFocusableElement]
  );

  // Handle when grid container receives focus (Tab into grid)
  const handleGridFocus = useCallback(
    (event: React.FocusEvent) => {
      // Only set focus if we're not already in ProductCard mode and no cell is focused
      if (!gridState.hasFocusedCell && !gridState.isInProductCardMode) {
        // Check if this was a Shift+Tab (coming from after the grid)
        const relatedTarget = event.relatedTarget as HTMLElement;
        const shouldEnterAtLastCell =
          relatedTarget &&
          isElementAfterGrid(relatedTarget, event.currentTarget);

        if (shouldEnterAtLastCell) {
          // Enter at last cell for APG compliance
          setFocusedCell({
            row: gridDimensions.lastRowIndex,
            col: gridDimensions.lastColIndex,
          });
        } else {
          // Normal Tab entry - enter at first cell
          setFocusedCell({ row: 0, col: 0 });

          // Announce keyboard instructions when entering from before the grid
          const announcement = document.createElement("div");
          announcement.setAttribute("aria-live", "polite");
          announcement.setAttribute("aria-atomic", "true");
          announcement.className = "sr-only";
          announcement.textContent =
            "Entered product grid. Use arrow keys to navigate, Enter to access product actions, Escape to exit actions, Tab to exit grid.";
          document.body.appendChild(announcement);

          // Clean up announcement after it's read
          setTimeout(() => {
            document.body.removeChild(announcement);
          }, 3000);
        }
      }
    },
    [
      gridState.hasFocusedCell,
      gridState.isInProductCardMode,
      gridDimensions,
      isElementAfterGrid,
    ]
  );

  // Handle when grid container loses focus (Tab out of grid)
  const handleGridBlur = useCallback(
    (event: React.FocusEvent) => {
      // Only clear focus if the focus is going completely outside the grid
      if (
        !event.currentTarget.contains(event.relatedTarget) &&
        !gridState.isInProductCardMode
      ) {
        setFocusedCell(null);
      }
    },
    [gridState.isInProductCardMode]
  );

  return (
    <Box>
      <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
        Product Grid
      </Typography>

      {/* Announcements for screen readers */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {isLoading && "Loading more content..."}
      </div>

      <div aria-live="polite" aria-atomic="true" className="sr-only">
        Use arrow keys to navigate, Enter to access actions, Escape to exit
        actions, Tab to exit grid
      </div>

      <TableContainer component={Paper}>
        <Table
          role="grid"
          aria-label="Product Grid"
          aria-busy={isLoading}
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
          <TableBody role="rowgroup">
            {rows.map((rowData: RowData, rowIndex: number) => {
              const isLastRow = rowIndex === rows.length - 1;
              const isFirstRow = rowIndex === 0;

              return (
                <div key={rowData.id}>
                  {isFirstRow && (
                    <div
                      ref={firstRowRef}
                      style={{
                        position: "absolute",
                        top: 0,
                        visibility: "hidden",
                      }}
                    />
                  )}
                  <ProductGridRow
                    rowIndex={rowIndex}
                    focusedCell={focusedCell || { row: -1, col: -1 }}
                    isInProductCardMode={isInProductCardMode}
                    gridCellRefs={gridCellRefs.current}
                    columnCount={columnCount}
                  />
                  {isLastRow && (
                    <div
                      ref={lastRowRef}
                      style={{ height: "1px", visibility: "hidden" }}
                    />
                  )}
                </div>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Back to top button */}
      {shouldShowBackToTop && (
        <Button
          data-testid="back-to-top-btn"
          variant="contained"
          color="primary"
          onClick={handleBackToTop}
          sx={{
            position: "fixed",
            bottom: 16,
            right: 16,
            zIndex: 1000,
          }}
          aria-label="Back to top"
        >
          Back to Top
        </Button>
      )}
    </Box>
  );
};

export default ProductGrid;
