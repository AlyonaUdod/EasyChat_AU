import * as actionTypes from './types';

export const setCurrentChannel = data => ({
    type: actionTypes.SET_CURRENT_CHANNEL,
    data
});

export const removeCurrentChannel = () => ({
    type: actionTypes.REMOVE_CURRENT_CHANNEL,
})

export const updateCurrentChannel = data => ({
    type: actionTypes.UPDATE_CURRENT_CHANNEL,
    data
});