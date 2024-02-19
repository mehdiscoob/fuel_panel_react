import {createSlice} from "@reduxjs/toolkit";
const initialState = {
  order: null,
  orderColumn: null,
}

export const sotring = createSlice({
  name: 'Sorting',
  initialState: initialState,
  reducers: {
    orders(state,action){
      state.order=action.payload.order;
      state.orderColumn=action.payload.orderColumn;
    },

  }
})

export const SortingAction = sotring.actions
export default sotring
