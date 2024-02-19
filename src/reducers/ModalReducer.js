import {createSlice} from "@reduxjs/toolkit";
const initialState = {
  hasModal:[],
  id:0,
}

export const modal = createSlice({
  name: 'Modal',
  initialState: initialState,
  reducers: {
    modal(state,action){
      state.hasModal=action.payload.hasModal;
    },
    modalId(state,action){
      state.id=action.payload.id;
    },
  }
})

export const ModalAction = modal.actions
export default modal
