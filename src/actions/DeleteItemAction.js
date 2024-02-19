import {toast} from "react-toastify";
import {DeleteItemAction} from "../reducers/DeleteItemReducer";

export const deleteStatus = (isDelete) => {
  return async (dispatch) => {
    dispatch(DeleteItemAction.deleteItem({
      isDelete: isDelete,
    }))

  }
}

export const deleteDetail = (id) => {
  return async (dispatch) => {
    dispatch(DeleteItemAction.deleteDetail({
      id: id,
    }))

  }
}
