import { DashboardComponentType, DashboardComponentEntity } from './framework'
// import { EChartOption } from '@types/echarts'

export enum VisualizationType {
  Bar = "bar",
  Radar = "radar",
  Line = "line",
  Scatter = "scatter",
  Tree = "tree",
  ScatterplotTimeline = "scatterplot-timeline",
  ThreeDBar = "3d-bar",
  Pie = "pie",
}

export function isVisualization(component: DashboardComponentEntity, visualizationType: VisualizationType) {
  if (component && component.componentType === DashboardComponentType.Visualization) {
    return (component as VisualizationEntity).type === visualizationType
  }
  return false
}

export const visualizationTypeLabels = {
  [VisualizationType.Bar]: "Bar chart",
  [VisualizationType.Radar]: "Radar chart",
  [VisualizationType.Line]: "Line chart",
  [VisualizationType.Scatter]: "Scatter plot",
  [VisualizationType.Tree]: "Tree diagram",
  [VisualizationType.ScatterplotTimeline]: "Scatter plot timeline",
  [VisualizationType.Pie]: "Pie Chart",
  [VisualizationType.ThreeDBar]: "3D Bar chart"
}

export interface VisualizationEntity extends DashboardComponentEntity {
  type: VisualizationType
  config?: any
}

export interface VisualizationLibraryItem {
  title: string,
  previewImg: string
  previewImgAlt: string
  route: any
}

export enum VisualizationLayoutOption {
  Manual,
  Grid,
  Widget // UB
}

export type ToolboxItemState = {
  name: string
  active: boolean
}

export type EChartVisualizationConfig = {
  layout: VisualizationLayoutOption
}

export type Event = {
  id: string
  eventType: string
  data: any
}

export interface TitleConfig {
  text: string
  subtext?: string
  left?: string | number // 'left' | 'center' | 'right' | number
}

export interface AxisTickConfig {
  show: boolean
}

export interface AxisLineConfig {
  show: boolean
}

export interface AxisConfig {
  name: string
  dataLabelField?: string
  dataValueField?: string
  // Index of dimensions in vis. config dimensions list
  dimensionIndices?: Array<number>
  multidimensional?: boolean
  data?: Array<string>

  axisTick?: AxisTickConfig
  axisLine?: AxisTickConfig
}


export interface DataZoomConfig {
  type: string
}

export type DatasetDimensionType = echarts.EChartOption.Dataset.DimensionObject

export interface DimensionConfig {
  name: string
  type?: DatasetDimensionType
  displayName?: string
}


export interface BarChartConfig {
//  title?: TitleConfig
  xAxis: AxisConfig
  yAxis: AxisConfig
//  dataZoom: Array<DataZoomConfig>
}

export interface ScatterplotTimelineSeriesConfig {
  id: string
  name: string
  // dataFieldName: string
  // dataFieldValue: string
}

export interface ScatterplotTimelineConfig {
  series: Array<ScatterplotTimelineSeriesConfig>
}

export interface ThreeDBarVisualMapConfig {
  extendedColorRange: boolean
  dimension: string
}

export interface ThreeDBarChartConfig {
  //  title?: TitleConfig
  dimensions: Array<DimensionConfig>
  visualMap: ThreeDBarVisualMapConfig
  xAxis3D: AxisConfig
  yAxis3D: AxisConfig
  zAxis3D: AxisConfig
//  dataZoom: Array<DataZoomConfig>
}

// TODO aggregations ? ? ?
// export enum RadarSeriesAggregationType {
//   count = 'COUNT',
//   sum = 'SUM',
//   avg = 'AVG'
// }
export interface LineSeriesConfig {
  name: string
  data?: Array<number>
  dataFieldName: string
  dataFieldValue: string
}

export interface LineChartConfig {
  // indicators: Array<PolarIndicatorConfig>
  series: Array<LineSeriesConfig>
  xAxis: AxisConfig
  yAxis: AxisConfig
}
export interface ValueDimension {
  name: string
  // Will filter data rows with configured field
  dataFieldName: string
  dataFieldValue: string
}

export interface RadarSeriesConfig extends ValueDimension {
}

export interface PolarIndicatorConfig {
  name: string
  dataValueField: string
//  aggregation: RadarSeriesAggregationType
}

export interface RadarChartConfig {
  indicators: Array<PolarIndicatorConfig>
  series: Array<RadarSeriesConfig>
}

export interface LegendConfig {
  orient: string // 'horizontal', 'vertical'
  left?: string | number // 'left' | 'center' | 'right' | number
  data?: Array<string>
}

export interface PieSeriesDataConfig {
  name: string
  value: number
}

export interface PieTooltipConfig {
  trigger: string // 'item'
  formatter?: string // '{a} <br/>{b} : {c} ({d}%)'
}

export interface PieSeriesConfig{
  data: Array<PieSeriesDataConfig>
  radius: string | Array<string> // '50%' | ['25%', '75%']
  roseType?: string // 'radius'
}

export interface PieChartConfig {
  title: TitleConfig
  tooltip: PieTooltipConfig
  legend?: LegendConfig
  series: Array<PieSeriesConfig>
}
