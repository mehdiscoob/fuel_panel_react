import {SelectAction} from "../reducers/SelectReducer";

export const statusSelectAll = (status) => {
  return async (dispatch) => {
    dispatch(SelectAction.selectAll({
      selectAll: status
    }))
  }
}

export const fetchSelectData = (data,status) => {
  return async (dispatch) => {
    dispatch(SelectAction.select({
      selectAll: status,
      dataSelect: data,
    }))
  }
}
