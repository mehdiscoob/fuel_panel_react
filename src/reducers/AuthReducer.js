import {createSlice} from "@reduxjs/toolkit";
const initialState = {
  isLogin: false,
  user: null,
}

export const auth = createSlice({
  name: 'Auth',
  initialState: initialState,
  reducers: {
    login(state,action){
      state.isLogin=action.payload.isLogin;
      state.user=action.payload.user;
    },

  }
})

export const AuthAction = auth.actions
export default auth
