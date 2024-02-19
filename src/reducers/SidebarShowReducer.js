import {createSlice} from "@reduxjs/toolkit";
 const initialState = {
  sidebarShow: true,
}

export const changeState = createSlice({
  name: 'sidebarShow',
  initialState: initialState,
  reducers: {
    setSidebarShow(state){
      state.sidebarShow=!state.sidebarShow;
    }
  }
})

export const changeStateAction = changeState.actions
export default changeState
