import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    materials:[]
}

const material = createSlice({
  name: 'materials',
  initialState,
  reducers: {
       // GET MATERIALS
    getMaterialsSuccess(state, action) {
        state.isLoading = false;
        state.materials = action.payload;
      },
  
  }
});

export const {} = material.actions

export default material.reducer