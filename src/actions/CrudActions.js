import {httpDelete, httpGet, httpPost, httpPut} from "../helper/httpMethods";
import {CrudAction} from "../reducers/CrudReducer";
import {useDispatch} from "react-redux";
import {toast} from "react-toastify";
import {setLocalStorage} from "../helper/localStorage";
import {setOrder} from "./SortingAction";


export const getAllItems = (url, data, isDelete, isDetail, isUpdate=null,startDate=null,endDate=null) => {
  let responseUrl="";
  return async (dispatch) => {
    dispatch(setOrder(data['orderByColumn'], data['orderBy']))
    const info = async () => {
      const axiosData = await httpGet(url, {params: data}).then((response) => {
        responseUrl=response.request.responseURL;
        setLocalStorage('tableUrl',response.request.responseURL.substr(21,(response.request.responseURL.length-1)))
        return response
      });
      return axiosData;
    }
    try {
      const informations = await info();
      dispatch(CrudAction.getAllItems({
        isLoading: false,
        items: informations.data.data!=undefined?informations.data.data:informations.data,
        lastPage: informations.data.last_page,
        currentPage: informations.data.current_page,
        keyword: data['keyword']??"",
        startDate: data['startDate']??"",
        endDate: data['endDate']??"",
        filterVal: data['filterVal']??"",
        filterColumn: data['filterColumn']??"",
        url: responseUrl??"",
        isDelete: isDelete,
        isDetail: isDetail,
        isUpdate: isUpdate,
      }))
    } catch (error) {
      console.log(error)
      dispatch(CrudAction.getAllItems({
        isLoading: false,
        items: [],
        lastPage: 1,
        currentPage: 1,
        keyword: "",
        startDate: "",
        url: responseUrl??"",
        endDate: "",
        isDelete: isDelete,
        isDetail: isDetail,
        isUpdate: isUpdate,
      }))
    }

  }

}


export const getItemById = (url, id) => {
  const urlId = url + '/' + id;

  return async (dispatch) => {
    const info = async () => {
      const axiosData = await httpGet(urlId).then((response) => {
        return response

      });

      return axiosData;
    }
    try {
      const informations = await info();
      dispatch(CrudAction.getItemById({
        isLoading: false,
        item: informations.data,

      }))
    } catch (error) {
      console.log(error)
    }

  }

}

export const updateItemById = (url, data) => {
  return async (dispatch) => {
    const info = async () => {
      const axiosData = await httpPost(url,data).then((response) => {
        toast.success('Updating is done.', {autoClose: 5000,})

      }).catch(()=>{
        toast.error('There is an Exception.', {autoClose: 5000,})
      });

      return axiosData;
    }
    try {
      const informations = await info();
      dispatch(CrudAction.updateItem({
      }))
    } catch (error) {
      console.log(error)
    }

  }

}

export const deleteItem = (url, id) => {
  return async (dispatch) => {
    const info = async () => {
      const urlId = url + '/' + id;
      const axiosData = await httpDelete(urlId).then((response) => {
        if (response.data=='exception'){
          return toast.error('There is an Exception.', {autoClose: 5000,})
        }
        toast.success('Removing id done.', {autoClose: 5000,})
      }).catch((error)=>{
        toast.error('There is an Exception.', {autoClose: 5000,})
      });
      return axiosData;
    }
    try {
      const informations = await info();
      dispatch(CrudAction.deleteItem())
    } catch (error) {
      console.log(error)
    }

  }

}

export const changeLoading = (loading) =>{
  return async (dispatch) =>{
    dispatch(CrudAction.changeLoading({
      isLoading: loading,
    }))
  }
}
