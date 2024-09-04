/* eslint-disable no-unused-vars */
import { createSlice } from '@reduxjs/toolkit'


export const userSlice = createSlice({
  name: 'user',
  initialState: {
    id:"",
    name: "",
    email:"",
    profile_pic:"",
    token:"",
    onlineUser: [],
    socketConection: null
  },
  reducers: {
    setUser:(state,action)=>{
        state.id = action.payload.id
        state.name = action.payload.name
        state.email = action.payload.email
        state.profile_pic = action.payload.profile_pic
    },
    setToken:(state,action)=>{
        state.token = action.payload
    },
    logout:(state,action)=>{
        state.id = ""
        state.name = ""
        state.email = ""
        state.profile_pic = ""
        state.token = ""
        state.socketConection = null
    },
    setOnlineUser: (state,action)=>{
        state.onlineUser = action.payload
    },
    setsocketConection:(state,action)=>{
      state.socketConection = action.payload
    }
  }
})

export const {setUser,setToken,logout,setOnlineUser,setsocketConection } = userSlice.actions

export default userSlice.reducer