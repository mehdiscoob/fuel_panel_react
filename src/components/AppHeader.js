import React, {useEffect} from 'react'
import {NavLink, useLocation} from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
  CContainer,
  CHeader,
  CHeaderBrand,
  CHeaderDivider,
  CHeaderNav,
  CHeaderToggler,
  CNavLink,
  CNavItem, CRow, CCol, CButton,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilBell, cilEnvelopeOpen, cilList, cilMenu } from '@coreui/icons'

import { AppBreadcrumb } from './index'
import { AppHeaderDropdown } from './header/index'
import { logo } from 'src/assets/brand/logo'
import {changeStateAction} from '../reducers/SidebarShowReducer'
import Button from "@coreui/coreui/js/src/button";
import {setLocalStorage} from "../helper/localStorage";
import {useNavigate} from "react-router";
import {authentication} from "../actions/AuthAction";
const AppHeader = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const thisLoc = useLocation().pathname;
  const sidebarShow = useSelector((state) => state.sidebarShow)
  const user = useSelector((state) => state.auth)
  const [auth,setAuth] = React.useState({});
    const toggleSidebar=() => {
    dispatch(changeStateAction.setSidebarShow())
  }
  const logout=() => {
    localStorage.removeItem('admin_user')
    dispatch(authentication())
    // console.log(thisLoc)
    // navigate(thisLoc)
  }
  useEffect(()=>{
    setAuth(user)
  },[user])
  return (
    <CHeader position="sticky" className="mb-4">
      <CContainer fluid>
        <CHeaderToggler
          className="ps-1"
          onClick={() => {toggleSidebar()}}
        >
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>
        <CCol style={{marginLeft:'5%'}}>
         User: {auth.user!=null&&auth.user.name}
          <br/>
          Username: {auth.user!=null&&auth.user.username}
        </CCol>
        {/*<CHeaderBrand className="mx-auto d-md-none" to="/">*/}
        {/*  <CIcon icon={logo} height={48} alt="Logo" />*/}
        {/*</CHeaderBrand>*/}
        {/*<CHeaderNav className="d-none d-md-flex me-auto">*/}
        {/*  /!*<CNavItem>*!/*/}
        {/*  /!*  <CNavLink to="/dashboard" component={NavLink}>*!/*/}
        {/*  /!*    Dashboard*!/*/}
        {/*  /!*  </CNavLink>*!/*/}
        {/*  /!*</CNavItem>*!/*/}
        {/*  /!*<CNavItem>*!/*/}
        {/*  /!*  <CNavLink href="#">Users</CNavLink>*!/*/}
        {/*  /!*</CNavItem>*!/*/}
        {/*  /!*<CNavItem>*!/*/}
        {/*  /!*  <CNavLink href="#">Settings</CNavLink>*!/*/}
        {/*  /!*</CNavItem>*!/*/}
        {/*</CHeaderNav>*/}
        {/*<CHeaderNav>*/}
        {/*  <CNavItem>*/}
        {/*    <CNavLink href="#">*/}
        {/*      <CIcon icon={cilBell} size="lg" />*/}
        {/*    </CNavLink>*/}
        {/*  </CNavItem>*/}
        {/*  <CNavItem>*/}
        {/*    <CNavLink href="#">*/}
        {/*      <CIcon icon={cilList} size="lg" />*/}
        {/*    </CNavLink>*/}
        {/*  </CNavItem>*/}
        {/*  <CNavItem>*/}
        {/*    <CNavLink href="#">*/}
        {/*      <CIcon icon={cilEnvelopeOpen} size="lg" />*/}
        {/*    </CNavLink>*/}
        {/*  </CNavItem>*/}
        {/*</CHeaderNav>*/}
        {/*<CHeaderNav className="ms-3">*/}
        {/*  <AppHeaderDropdown />*/}
        {/*</CHeaderNav>*/}
        <CRow>
          <CCol lg={12}>
            <CButton className='btn-danger text-white' onClick={(e)=>{logout()}}>Logout</CButton>
          </CCol>
        </CRow>
      </CContainer>
      <CHeaderDivider />
      <CContainer fluid>
        {/*<AppBreadcrumb />*/}

      </CContainer>
    </CHeader>
  )
}

export default AppHeader
