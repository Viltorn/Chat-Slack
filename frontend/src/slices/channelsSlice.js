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
    addChannel(state, { payload }) {
      state.channels.push(payload);
    },
    removeChannel(state, { payload }) {
      const { id } = payload;
      state.channels = state.channels.filter((channel) => channel.id !== id);
    },
    renameChannel(state, { payload }) {
      const { id, name } = payload;
      state.channels = state.channels.map((channel) => {
        if (channel.id === id) {
          channel.name = name;
        }
        return channel;
      });
    },
    changeCurrentChannel(state, { payload }) {
      state.currentChannelId = payload;
    },
  },
});

export const { actions } = channelSlice;
export default channelSlice.reducer;
