import { AxisConfig } from "~/../types/visualization-framework";
import { DataSourceEntity } from "~/../types/framework";

export const getLabels = (axis: AxisConfig, dataSource: DataSourceEntity) => {
  if (axis.dataLabelField) {
    const i: string = axis.dataLabelField
    return dataSource.data.map((record: any) => record[i])
  }
  return dataSource.data.map((_: any, i: number) => i)
}
