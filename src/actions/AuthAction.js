import {httpDelete, httpGet, httpPost, httpPut} from "../helper/httpMethods";
import {useDispatch} from "react-redux";
import {toast} from "react-toastify";
import {AuthAction} from "../reducers/AuthReducer";


export const authentication = () => {
  return async (dispatch) => {
    const info = async () => {
      let userStorage = localStorage.getItem('admin_user');

      if (userStorage!='undefined' && userStorage!=null){

        userStorage = JSON.parse(userStorage)

      }
      if (userStorage==null){
        userStorage='unAuth';
      }
      return userStorage;
    }
    try {
      const informations = await info();
      if (informations!='unAuth'){
        dispatch(AuthAction.login({
          isLogin: true,
          user: informations,
        }))
      }
      else {
        dispatch(AuthAction.login({
          isLogin: false,
          user: [],
        }))
      }

    } catch (error) {
      console.log(error)
    }

  }

}

