import { createSlice } from "@reduxjs/toolkit"; 


const initialState={
    dark:false
};

export const darkReducer=createSlice({
    name:"darkReducer",
    initialState,
    reducers:{
        darkExist:(state)=>{
            state.dark=!(state.dark)
        }
    }
})

export const {darkExist}=darkReducer.actions