import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))

// Comment
const OrdersTable = React.lazy(() => import('./views/order/OrdersTable'))
const OrdersCreate = React.lazy(() => import('./views/order/OrdersCreate'))
const OrdersDetail = React.lazy(() => import('./views/order/OrdersDetail'))
const OrdersUpdate = React.lazy(() => import('./views/order/OrdersUpdate'))
const UsersTable = React.lazy(() => import('./views/user/UsersTable'))
const ClientsTable = React.lazy(() => import('./views/client/ClientsTable'))


const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/user', name: 'UsersTable', element: UsersTable, exact: true },
  { path: '/client', name: 'ClientsTable', element: UsersTable, exact: true },
  { path: '/order', name: 'OrdersTable', element: OrdersTable, exact: true },
  { path: '/order/create', name: 'OrdersCreate', element: OrdersCreate, exact: true },
  { path: '/order/update/:id', name: 'OrdersUpdate', element: OrdersUpdate, exact: true },
  { path: '/order/:id', name: 'OrdersDetail', element: OrdersDetail, exact: true },
]

export default routes
