import * as actionTypes from './types';

export const setAllChannels = data => ({
    type: actionTypes.SET_ALL_CHANNELS,
    data
});

export const removeAllChannels = () => ({
    type: actionTypes.REMOVE_ALL_CHANNELS,
})

export const updateAllChannels = data => ({
    type: actionTypes.UPDATE_ALL_CHANNELS,
    data
});