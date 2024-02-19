import {createSlice} from "@reduxjs/toolkit";
const initialState = {
  isDelete:false,
  id:null,
}

export const deleteItem = createSlice({
  name: 'DeleteItem',
  initialState: initialState,
  reducers: {
    deleteItem(state,action){
      state.isDelete=action.payload.isDelete;
    },
    deleteDetail(state,action){
      state.id=action.payload.id;
    },
  }
})

export const DeleteItemAction = deleteItem.actions
export default deleteItem
