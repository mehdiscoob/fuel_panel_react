import React from 'react'
import { useLocation } from 'react-router-dom'

import routes from '../routes'

import { CBreadcrumb, CBreadcrumbItem } from '@coreui/react'

const AppBreadcrumb = () => {
  const currentLocation = useLocation().pathname
  const getRouteName = (pathname, routes) => {
    const currentRoute = routes.find((route) => route.path === pathname)
    return currentRoute ? currentRoute.name : false
  }

  const getBreadcrumbs = () => {
    const breadcrumbs = []
    let dataBread=localStorage.getItem('breadcrumbs');
    if (dataBread!=null){
      // setDataBread(localStorage.getItem('breadcrumbs'))
      let dataBreadReplace = dataBread.replace('}','|@');
      let dataBreadSplit = dataBreadReplace.split('@,');
      if (dataBreadSplit.length==1){
        dataBreadSplit = dataBreadSplit[0].replace('@','');
        let endBread = dataBreadSplit.replace('|','}');
        breadcrumbs.push(JSON.parse(endBread))
      }
      else {
        dataBreadSplit.forEach(function (item){
          let endBread = item.replace('|','}');
          breadcrumbs.push(JSON.parse(endBread))
        })
      }

    }



    return breadcrumbs
  }

  const breadcrumbs = getBreadcrumbs()

  return (
    <CBreadcrumb className="m-0 ms-2">
      <CBreadcrumbItem href="/">Home</CBreadcrumbItem>
      {breadcrumbs.map((breadcrumb, index) => {
        return (
          <CBreadcrumbItem
            {...(breadcrumb.active ? { active: true } : { href: breadcrumb.pathname })}
            key={index}
          >
            {breadcrumb.name}
          </CBreadcrumbItem>
        )
      })}
    </CBreadcrumb>
  )
}

export default React.memo(AppBreadcrumb)
