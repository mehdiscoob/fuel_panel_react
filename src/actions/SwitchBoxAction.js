import {toast} from "react-toastify";
import {SwitchBoxAction} from "../reducers/SwitchBoxReducer";

export const switchBoxStatus = (isActive) => {
  return async (dispatch) => {
    dispatch(SwitchBoxAction.switchBoxActivity({
      isActive: isActive,
    }))

  }
}

export const getSwitchBoxItem = (switchUrl,items) => {
  return async (dispatch) => {
    dispatch(SwitchBoxAction.switchBoxItem({
      items: items,
      switchUrl: switchUrl,
    }))

  }
}

export const switchBoxArray = (items) => {
  return async (dispatch) => {
    dispatch(SwitchBoxAction.switchBoxList({
      switchboxList: items,
    }))

  }
}

