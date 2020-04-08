interface TableRow {
  title?: string
  height: string
  // TODO: Table Formatting
  format?: string
}

interface TableColumn {
  label: string
  field: string
  type: 'text' | 'decimal' | 'percentage' | 'boolean' | 'date'
  sortable?: boolean
  // TODO: Table Formatting
  // format?: string
  width?: string
}

interface TableFormat {
  // If this is true, rows are configured one-by-one
  manualRows: boolean
  rows: Array<TableRow>
  columns: Array<TableColumn>
}

interface TableDataRow {
  data: Array<any>
}
