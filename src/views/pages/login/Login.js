import React, {useEffect, useRef} from 'react'
import {Link, useLocation} from 'react-router-dom'

import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow, CSpinner,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {useDispatch, useSelector} from "react-redux";
import {httpPost} from "../../../helper/httpMethods";
import {setLocalStorage} from "../../../helper/localStorage";
import {useNavigate} from "react-router";
import {authentication} from "../../../actions/AuthAction";
import axios from "axios";
const Login = () => {
  const thisLoc = useLocation().pathname;
  const usernameValRef = useRef();
  const passwordValRef = useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLogin, setIsLogin] = React.useState(true);
  const auth=useSelector(state=>state.auth.isLogin);
  let baseUrl = process.env.REACT_APP_API_URL;
  const login = async (username,password) => {
    await axios.post(`${baseUrl}api/login`,{email:username,password:password})
      .then((response)=>{
          localStorage.removeItem('admin_user')
        setLocalStorage('admin_user',response.data)
        dispatch(authentication()).then(()=>{
          setIsLogin(auth);
        })
       if(thisLoc!='/login'){
         navigate(thisLoc)
       }
    else {
         navigate('/dashboard')
       }
      }).catch((error)=>{
        console.log(error)
        if (error.status==422){
          var result = Object.keys(error.data.message).map((key) => [Number(key), error.data.message[key]]);

          for(let i=0;i<result[0].length;i++){
            if (typeof result[0][i]=="object"){
              toast.error(result[0][i][0],{autoClose: 5000,})
            }
          }
        }
        else if (error.status==403){
          toast.error("The password is incorrect",{autoClose: 5000,})
        }
        setDisabled(false)
      });

  }
  const saveCredential = (e)=>{
    e.preventDefault();

  }

  useEffect(() => {
    if (isLogin){
      navigate(thisLoc)
    }
  }, [isLogin]);
  const [disabled, setDisabled] = React.useState(false);
  return (

    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <ToastContainer/>
        <CRow className="justify-content-center">
          <CCol sm={12}>
            <CCard className="p-4 w-25 m-auto my-2">
              <h3>Sample Users</h3>
             <h4>Admin:</h4>
              <p>username: admin@gmail.com</p>
              <p>password: 123456789</p>
              <h4>Client:</h4>
              <p>username: client@gmail.com</p>
              <p>password: 123456789</p>
            </CCard>
          </CCol>
          <CCol md={4}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={(e)=>{saveCredential(e)}}>
                    <h1>Login</h1>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput ref={usernameValRef} placeholder="Username" autoComplete="username" />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        ref={passwordValRef}
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs={6}>
                        <CButton type='submit' color="primary" disabled={disabled} className="px-4 w-75" onClick={(e) => {login(usernameValRef.current.value, passwordValRef.current.value),setDisabled(true)}}>
                          {disabled?<CSpinner size='sm' color='light'/>:'Login' }
                        </CButton>
                      </CCol>
                      <CCol xs={6} style={{textAlign:'right'}}>
                        <CButton color="link" className="px-0">
                          Forget Password
                        </CButton>
                      </CCol>
                      {/*<CCol xs={12} className="text-right">*/}
                      {/*  <Link to="/register">*/}
                      {/*    <CButton color="link" className="mt-3" active tabIndex={-1}>*/}
                      {/*     ثبت نام*/}
                      {/*    </CButton>*/}
                      {/*  </Link>*/}
                      {/*</CCol>*/}
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard >

            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
