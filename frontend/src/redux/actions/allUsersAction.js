import * as actionTypes from './types';

export const setAllUsers = data => ({
    type: actionTypes.SET_ALL_USERS,
    data
});

export const removeAllUsers = () => ({
    type: actionTypes.REMOVE_ALL_USERS,
})

export const updateAllUsers = data => ({
    type: actionTypes.UPDATE_ALL_USERS,
    data
});