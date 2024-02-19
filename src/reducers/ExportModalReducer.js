import {createSlice} from "@reduxjs/toolkit";
const initialState = {
  hasModal:false,
}

export const exportModal = createSlice({
  name: 'ExportModal',
  initialState: initialState,
  reducers: {
    modal(state,action){
      state.hasModal=action.payload.hasModal;
    },
  }
})

export const ExportModalAction = exportModal.actions
export default exportModal
