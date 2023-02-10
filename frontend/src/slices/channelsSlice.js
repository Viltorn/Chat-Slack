import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  channels: [],
  currentChannelId: '',
};

const channelSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    addChannels(state, { payload }) {
      state.channels = payload;
    },
    changeCurrentChannel(state, { payload }) {
      state.currentChannelId = payload;
    },
  },
});

export const { actions } = channelSlice;
export default channelSlice.reducer;
