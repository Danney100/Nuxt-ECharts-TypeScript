export interface AuthUser {
  jwtToken: string
}

/*******************************
* ENTITY
*******************************/

// Any Entity that is published
export interface PublishedEntity {
  _id?: string
  id: string
  publishId: string
}

export interface NamedEntity extends PublishedEntity {
  title?: string
  description?: string
}

export interface DashboardEntity extends NamedEntity {
  owner: string
  // indices: Array<string>
  // template: string
}

export interface DashboardSidebarMenuEntry {
  dashboardId: string
  href?: string
  title: string
  icon: string
  child?: Array<DashboardSidebarMenuEntry>
}

export enum DataSourceType {
  // For now just Elasticsearch
  Elasticsearch = "elasticsearch",
  // Humio = "humio",
  // SqlYugabyte = "sql-yugabyte",
  // Static files
  Json = "json",
  Csv = "csv"
}

export const dataSourceTypeLabels = {
  [DataSourceType.Elasticsearch]: "Elasticsearch index",
  [DataSourceType.Csv]: "CSV file",
  [DataSourceType.Json]: "JSON file"
}

export interface DataSourceEntity extends NamedEntity {
  name: string
  type: DataSourceType
  data?: any
}

export enum DashboardComponentType {
  Visualization = "visualization",
  Table = "table",
// this can just be a block:  Text = "text"
  Form = "form"
}

export interface DashboardComponentEntity extends PublishedEntity {
  componentType: DashboardComponentType
  dataSource?: DataSourceEntity
  owner: string
  title: string
  description?: string
}

export interface PageBlockGridItem {
  componentId: string
  x: number
  y: number
  w: number
  h: number
}

export interface PageBlockEntity extends PublishedEntity {
  components: Array<DashboardComponentEntity>
  layout: Array<PageBlockGridItem>
  isGrid: boolean
}

export interface PageEntity extends NamedEntity {
  dashboardId: string
  slug: string
  owner: string
  // template: string
  blocks: Array<PageBlockEntity>
}

export interface TableEntity extends DashboardComponentEntity {
  columns: Array<TableColumn>
}
