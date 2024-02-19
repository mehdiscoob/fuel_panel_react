import {createSlice} from "@reduxjs/toolkit";
const initialState = {
  currentPage:1,
  lastPage:1,
  countPage:[],
}

export const pagination = createSlice({
  name: 'Pagination',
  initialState: initialState,
  reducers: {
    pagination(state,action){
      state.currentPage=action.payload.currentPage;
      state.lastPage=action.payload.lastPage;
      state.countPage=action.payload.countPage;

    },
  }
})

export const PaginationAction = pagination.actions
export default pagination
