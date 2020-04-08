export default {
  "/admin/dashboards": {
    breadcrumb: [
      { text: "Dashboards", active: true }
    ]
  },
  "/admin/dashboards/create": {
    breadcrumb: [
      { text: "Dashboards", to: "/admin/dashboards/" },
      { text: "New Dashboard", active: true },
    ]
  },
  "/admin/dashboard-components": {
    breadcrumb: [
      { text: "Components", active: true }
    ]
  },
  "/admin/dashboard-components/visualization-library": {
    breadcrumb: [
      { text: "Components", to: "/admin/dashboard-components/" },
      { text: "Visualization Library", active: true }
    ]
  },
  "/admin/dashboard-components/create-visualization": {
    breadcrumb: [
      { text: "Components", to: "/admin/dashboard-components/" },
      { text: "New Visualization", active: true }
    ]
  },
  "/admin/dashboard-components/visualization-editor/:id": {
    breadcrumb: [
      { text: "Components", to: "/admin/dashboard-components/" },
      { text: "Visualization Editor", active: true }
    ]
  },
  "/admin/publishing/data-sources": {
    breadcrumb: [
      { text: "Publishing" },
      { text: "Data Sources", active: true }
    ]
  },
  "/admin/publishing/data-sources/create": {
    breadcrumb: [
      { text: "Publishing" },
      { text: "New Data Source", active: true }
    ]
  }
}
