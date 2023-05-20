import { createSlice } from '@reduxjs/toolkit'

const initialState = { value: '', error: false }

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setMessage(state, action) {
      state.value = action.payload.value
      state.error = action.payload.error
    }
  }
})

export const { setMessage } = notificationSlice.actions

export const setNotification = (message, error, timeout) => {
  const msg = { value: message, error: error }
  return (dispatch) => {
    dispatch(setMessage(msg))
    setTimeout(() => {
      dispatch(setMessage({ ...msg, value: '' }))
    }, timeout * 1000)
  }
}

export default notificationSlice.reducer
