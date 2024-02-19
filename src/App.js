import React, {Component, Suspense, useEffect, useState} from 'react'
import {BrowserRouter, HashRouter, Route, Routes, useLocation} from 'react-router-dom'
import './scss/style.scss'
import {useDispatch, useSelector} from "react-redux";
import {authentication} from "./actions/AuthAction";

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'))
const Register = React.lazy(() => import('./views/pages/register/Register'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))

const App = () => {
  const [isLogin, setIsLogin] = useState(false)
  const [authed, setAuthed] = useState(false)
  const authRedux = useSelector(state => state.auth)
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(authentication()).then(() => {

    })
  }, [dispatch]);
  useEffect(() => {
    setIsLogin(authRedux.isLogin)
  }, [authRedux])

  return (
    <HashRouter>
      <Suspense fallback={loading}>

        {isLogin ?
          <Routes>
            <Route exact path="/login" name="Login Page" element={<Login/>}/>
            <Route exact path="/register" name="Register Page" element={<Register/>}/>
            <Route exact path="/404" name="Page 404" element={<Page404/>}/>
            <Route exact path="/500" name="Page 500" element={<Page500/>}/>
            <Route path="*" name="Home" element={<DefaultLayout/>}/>
          </Routes>
          :
          <>
            <Routes>
              <Route exact path="*" name="Login Page" element={<Login/>}/>
            </Routes>
          </>
        }
      </Suspense>
    </HashRouter>

  )

}

export default App
