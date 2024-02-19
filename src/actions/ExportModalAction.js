import {toast} from "react-toastify";
import {ExportModalAction} from "../reducers/ExportModalReducer";

export const exportModalStatus = (hasModal) => {
  return async (dispatch) => {
    dispatch(ExportModalAction.modal({
      hasModal: hasModal,
    }))

  }
}

