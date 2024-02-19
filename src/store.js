import {createStore} from 'redux'
import {configureStore, createSlice} from "@reduxjs/toolkit";
import changeState from './reducers/SidebarShowReducer'
import crud from "./reducers/CrudReducer";
import auth from "./reducers/AuthReducer";
import pagination from "./reducers/PaginationReducer";
import modal from "./reducers/ModalReducer";
import exportModal from "./reducers/ExportModalReducer";
import deleteItem from "./reducers/DeleteItemReducer";
import switchBox from "./reducers/SwitchBoxReducer";
import sotring from "./reducers/SortingReducer";
import select from "./reducers/SelectReducer";

const initialStateAuth = {
  isAuthentication: false,
}
export const isAuth = createSlice({
  name: 'isAuthed',
  initialState: initialStateAuth,
  reducers: {
    authed: (state => {

    })
  }
}).reducer


const store = configureStore({
  reducer: {
    crud: crud.reducer,
    sidebarShow:changeState.reducer,
    auth:auth.reducer,
    pagination:pagination.reducer,
    modal:modal.reducer,
    exportModal:exportModal.reducer,
    deleteItem:deleteItem.reducer,
    switchBox:switchBox.reducer,
    sorting:sotring.reducer,
    select:select.reducer,
  }
})
export default store
