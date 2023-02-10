import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  messages: [],
};

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    addMessages(state, { payload }) {
      state.messages = payload;
    },
  },
});

export const { actions } = messagesSlice;
export default messagesSlice.reducer;
