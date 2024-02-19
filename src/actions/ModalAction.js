import {toast} from "react-toastify";
import {ModalAction} from "../reducers/ModalReducer";


export const modalStatus = (hasModal) => {
  return async (dispatch) => {
    dispatch(ModalAction.modal({
      hasModal: hasModal,
    }))

  }
}
export const setIdForModal = (id) => {
  return async (dispatch) => {
    dispatch(ModalAction.modalId({
      id: id,
    }))
  }
}

