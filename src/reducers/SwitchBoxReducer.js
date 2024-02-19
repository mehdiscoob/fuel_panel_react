import {createSlice} from "@reduxjs/toolkit";
const initialState = {
  isActive:false,
  items:{index:0,id: 1, position: null},
  switchUrl:null,
  switchboxList:[],
}

export const switchBoxAction = createSlice({
  name: 'SwitchBox',
  initialState: initialState,
  reducers: {
    switchBoxActivity(state,action){
      state.isActive=action.payload.isActive;
    },
    switchBoxItem(state,action){
      state.items=action.payload.items;
      state.switchUrl=action.payload.switchUrl;
    },
    switchBoxList(state,action){
      state.switchboxList=action.payload.switchboxList;
    },
  }
})

export const SwitchBoxAction = switchBoxAction.actions
export default switchBoxAction
