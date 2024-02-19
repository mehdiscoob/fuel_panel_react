import {createSlice} from "@reduxjs/toolkit";
const initialState = {
  isLoading: true,
  items:[],
  item:null,
  currentPage:1,
  lastPage:0,
  keyword:"",
  startDate:"",
  endDate:"",
  isDelete:false,
  isDetail:false,
  isUpdate:false,
  url: "",
  filterVal: "",
  filterColumn: "",

}

export const crud = createSlice({
  name: 'Crud',
  initialState: initialState,
  reducers: {
    getAllItems(state,action){
      state.isLoading=action.payload.isLoading;
      state.currentPage=action.payload.currentPage;
      state.items=action.payload.items;
      state.keyword=action.payload.keyword;
      state.startDate=action.payload.startDate;
      state.endDate=action.payload.endDate;
      state.lastPage=action.payload.lastPage;
      state.isDelete=action.payload.isDelete;
      state.isDetail=action.payload.isDetail;
      state.isUpdate=action.payload.isUpdate;
      state.url=action.payload.url;
      state.filterVal=action.payload.filterVal;
      state.filterColumn=action.payload.filterColumn;

    },
    updateItem(){},
    deleteItem(){},
    getItemById(state,action){
      state.isLoading=action.payload.isLoading;
      state.item=action.payload.item;
    },
    changeLoading(state,action){
      state.isLoading=action.payload.isLoading;
    },
  }
})

export const CrudAction = crud.actions
export default crud
