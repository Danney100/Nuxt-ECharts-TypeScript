import { Store } from 'vuex'
import { getModule } from 'vuex-module-decorators'
//import { RootState } from '@/store/types'
import framework from '@/store/framework'
import dashboardComponent from '@/store/DashboardComponent'
import visualization from '@/store/visualization'
import table from '@/store/Table'
import dataSource from '@/store/DataSource'

let frameworkStore: framework

function initialiseStores(store: Store<any>): void {
  frameworkStore = getModule(framework, store)
  frameworkStore.dashboardComponent = getModule(dashboardComponent, store)
  frameworkStore.dashboardComponent.visualization = getModule(visualization, store)
  frameworkStore.dashboardComponent.table = getModule(table, store)
  frameworkStore.dataSource = getModule(dataSource, store)
}

export {
  initialiseStores,
  frameworkStore
}
