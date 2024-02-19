import {createSlice} from "@reduxjs/toolkit";
 const initialState = {
   selectAll: false,
   dataSelect: [],
}

export const select = createSlice({
  name: 'Select',
  initialState: initialState,
  reducers: {
    select(state,action){
      state.selectAll=action.payload.selectAll;
      state.dataSelect=action.payload.dataSelect;
    },
    selectAll(state,action){
      state.selectAll=action.payload.selectAll;
    },
  }
})

export const SelectAction = select.actions
export default select
