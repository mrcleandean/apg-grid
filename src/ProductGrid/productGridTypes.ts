export type RowData = {
  id: number;
  name: string;
  value: number;
  description: string;
};

export type Column = {
  field: keyof RowData | null;
  headerName: string;
  editable: boolean;
  hasInner: boolean;
};

export type FocusedCell = { row: number; col: number };
export type EditingCell = {
  row: number;
  col: number;
  value: string | number;
} | null;
export type InnerModeCell = { row: number; col: number } | null;

export const initialRows: RowData[] = [
  { id: 1, name: "Item 1", value: 10, description: "Desc 1" },
  { id: 2, name: "Item 2", value: 20, description: "Desc 2" },
  { id: 3, name: "Item 3", value: 30, description: "Desc 3" },
];

export const columns: Column[] = [
  { field: "id", headerName: "ID", editable: false, hasInner: false },
  { field: "name", headerName: "Name", editable: true, hasInner: false },
  { field: "value", headerName: "Value", editable: true, hasInner: false },
  { field: null, headerName: "Actions", editable: false, hasInner: true },
];
