import * as actionTypes from '../actions/types';

const allUsers = (state = [], action) => {
    switch(action.type) {
        case actionTypes.SET_ALL_USERS:
            return [...action.data]
        case actionTypes.REMOVE_ALL_USERS:
            return []
        case actionTypes.UPDATE_ALL_USERS:
            return [...action.data]
        default:
            return state;
    }
}

export default allUsers;