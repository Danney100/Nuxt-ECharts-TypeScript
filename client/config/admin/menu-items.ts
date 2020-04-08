export default [
  {
    header: true,
    title: 'Admin',
    hiddenOnCollapse: true
  },
  {
    icon: 'dripicons-experiment',
    href: '/admin/',
    title: 'Sandbox'
  },
  {
    title: 'Components',
    icon: 'typcn typcn-puzzle',
    child: [
      {
        icon: 'dripicons-pulse',
        href: '/admin/dashboard-components/visualization-library',
        title: 'Visualization Library'
      },
      {
        icon: '',
        href: '/admin/dashboard-components/form-builder',
        title: 'Form Builder'
      },
      {
        icon: 'fa fa-table',
        href: '/admin/dashboard-components/tables',
        title: 'Tables'
      },
      {
        icon: 'dripicons-gear',
        href: '/admin/dashboard-components/',
        title: 'Manage'
      }
    ]
  }
]
