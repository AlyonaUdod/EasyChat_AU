import * as actionTypes from './types';

export const setCurrentUser = data => ({
    type: actionTypes.SET_CURRENT_USER,
    data
});

export const removeCurrentUser = () => ({
    type: actionTypes.REMOVE_CURRENT_USER,
})

export const updateCurrentUser = data => ({
    type: actionTypes.UPDATE_CURRENT_USER,
    data
});