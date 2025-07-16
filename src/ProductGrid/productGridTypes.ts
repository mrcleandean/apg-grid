export type RowData = {
  id: number;
  name: string;
  value: number;
  description: string;
};

export type FocusedCell = { row: number; col: number };
export type EditingCell = {
  row: number;
  col: number;
  value: string | number;
} | null;
export type ProductCardModeCell = { row: number; col: number } | null;

export const initialRows: RowData[] = [
  { id: 1, name: "Item 1", value: 10, description: "Desc 1" },
  { id: 2, name: "Item 2", value: 20, description: "Desc 2" },
  { id: 3, name: "Item 3", value: 30, description: "Desc 3" },
];
