import {httpPost} from "../helper/httpMethods";
import {setLocalStorage} from "../helper/localStorage";
import {toast} from "react-toastify";





export const login = async (username,password) => {
  const clicked = await httpPost('api/admin/admin-user/login',{username:username,password:password})
    .then((response)=>{
      let adminResponse = response.data.admin;
      let access_token = response.data.access_token;
      let store = {name:adminResponse.name,username:adminResponse.username,admin_token:access_token,}
      setLocalStorage('admin_user',store)
      window.location='/'
    }).catch((error)=>{
      if (error.status==422){
        toast.error('لطفا از کاراکتر های مجاز استفاده کنید.',{autoClose: 5000,})
      }
    });
  return (<div>hi</div>)
}
