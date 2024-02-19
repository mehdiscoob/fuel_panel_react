import {httpDelete, httpGet, httpPost, httpPut} from "../helper/httpMethods";
import {useDispatch} from "react-redux";
import {toast} from "react-toastify";
import {AuthAction} from "../reducers/AuthReducer";


export const sliderAction = () => {
  return async (dispatch) => {
    const info = async () => {
      let userStorage = localStorage.getItem('admin_user');

      if (userStorage!='undefined' && userStorage!=null){

        userStorage = JSON.parse(userStorage)

      }
      return userStorage;
    }
    try {
      const informations = await info();
      dispatch(AuthAction.login({
        isLogin: true,
        user: informations,
      }))
    } catch (error) {
      console.log(error)
    }

  }

}

