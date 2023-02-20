import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: '',
}

export const acirveTabSlice = createSlice({
  name: 'shop',
  initialState,
  reducers: {
    activeTab: (state, action) => {
      state.value = action.payload;
    },
  },
})

export const { activeTab } = acirveTabSlice.actions

export default acirveTabSlice.reducer