import {SortingAction} from "../reducers/SortingReducer";

export const setOrder = (orderColumn,order) => {
  return async (dispatch) => {
    try {
        dispatch(SortingAction.orders({
          order: order,
          orderColumn: orderColumn,
        }))
    } catch (error) {
      console.log(error)
    }

  }

}

