import { createSlice } from '@reduxjs/toolkit'

const initialState = { name: null, username: null }

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      state.name = action.payload.name
      state.username = action.payload.username
    }
  }
})

export const { setUser } = userSlice.actions

export const configureUser = (user) => {
  return (dispatch) => {
    dispatch(setUser(user))
  }
}

export default userSlice.reducer
