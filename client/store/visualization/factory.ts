import { VisualizationType, VisualizationEntity } from '@/../types/visualization-framework'
import { DataSourceEntity, DashboardComponentType, DashboardComponentEntity } from '@/../types/framework'

const availableVisualizations = Array.from(Object.values(VisualizationType))

export default class VisualizationFactory {

  create(dashboardComponent: DashboardComponentEntity): VisualizationEntity {
    const { componentType } = dashboardComponent
    if (componentType !== DashboardComponentType.Visualization) {
      throw new TypeError(`dashboardComponent id ${dashboardComponent.id} of component type: ${componentType}`)
    }
    const visType = (dashboardComponent as VisualizationEntity).type
    if (!availableVisualizations.includes(visType)) {
      throw new TypeError(`dashboardComponent id ${dashboardComponent.id} of component type: ${componentType}`)
    }

    switch (visType) {
      case VisualizationType.Bar:
        return this.createBarChart(dashboardComponent)
      case VisualizationType.Radar:
        return this.createRadarChart(dashboardComponent)
      case VisualizationType.Line:
        return this.createLineChart(dashboardComponent)
      // case VisualizationType.Scatter:
      //   return this.createScatterPlot(dashboardComponent)
      // case VisualizationType.Tree:
        //   return this.createTreeDiagram(dashboardComponent)
      case VisualizationType.ScatterplotTimeline:
        return this.createScatterplotTimeline(dashboardComponent)
      case VisualizationType.ThreeDBar:
        return this.createThreeDBarChart(dashboardComponent)

      default:
        throw new TypeError(`Visualization of type ${visType} not supported yet`)
    }
  }

  newVisualizationEntity(type: VisualizationType, dashboardComponent: DashboardComponentEntity, config: any): VisualizationEntity {
    const dataSource = dashboardComponent.dataSource as DataSourceEntity

    const entity: VisualizationEntity = {
      ...dashboardComponent,
      type,
      dataSource: ({
        id: dataSource.id,
        type: dataSource.type
      } as DataSourceEntity), // We don't need anything else
      config
    }
    return entity
  }

  createBarChart(dashboardComponent: DashboardComponentEntity): VisualizationEntity {
    const entity: VisualizationEntity = this.newVisualizationEntity(
      VisualizationType.Bar,
      dashboardComponent,
      {
        xAxis: {
          name: '',
          dataLabelField: ''
        },
        yAxis: {
          name: '',
          dataValueField: ''
        }
      }
    )
    return entity
  }

  createLineChart(dashboardComponent: DashboardComponentEntity): VisualizationEntity {
    const entity: VisualizationEntity = this.newVisualizationEntity(
      VisualizationType.Line,
      dashboardComponent,
      {
        series: [
          {
            name: '',
            dataFilterFieldName: '',
            dataFilterFieldValue: ''
          }
        ]
      }
    )
    return entity
  }


  createRadarChart(dashboardComponent: DashboardComponentEntity): VisualizationEntity {
    const entity: VisualizationEntity = this.newVisualizationEntity(
      VisualizationType.Radar,
      dashboardComponent,
      {
        series: [
          {
            name: '',
            dataFilterFieldName: '',
            dataFilterFieldValue: ''
          },
          {
            name: '',
            dataFilterFieldName: '',
            dataFilterFieldValue: ''
          },
          {
            name: '',
            dataFilterFieldName: '',
            dataFilterFieldValue: ''
          }
        ],
        indicators: [
          {
            name: '',
            dataValueField: ''
          },
          {
            name: '',
            dataValueField: ''
          },
          {
            name: '',
            dataValueField: ''
          }
        ]
      }
    )
    return entity
  }
  // createLineChart(dashboardComponent: DashboardComponentEntity) {

  // }
  // createScatterPlot(dashboardComponent: DashboardComponentEntity) {

  // }
  // createTreeDiagram(dashboardComponent: DashboardComponentEntity) {

  // }

  createScatterplotTimeline(dashboardComponent: DashboardComponentEntity) {
    const entity: VisualizationEntity = this.newVisualizationEntity(
      VisualizationType.ScatterplotTimeline,
      dashboardComponent,
      {
        series: [{
          id: 'node-1',
          name: 'CPU',
        }, {
          id: 'node-2',
          name: 'Memory',
        }, {
          id: 'node-3',
          name: 'Disk',
        }]
      }
    )
    return entity
  }

  createThreeDBarChart(dashboardComponent: DashboardComponentEntity): VisualizationEntity {
    const entity: VisualizationEntity = this.newVisualizationEntity(
      VisualizationType.ThreeDBar,
      dashboardComponent,
      {
        xAxis3D: {
          name: '',
          type: 'category',
          data: [],
          dimensionIndices: []
        },
        yAxis3D: {
          name: '',
          type: 'category',
          data: [],
          dimensionIndices: []
        },
        zAxis3D: {
          name: '',
          type: 'value',
          data: [],
          dimensionIndices: []
        }
      }
    )
    return entity
  }
}
