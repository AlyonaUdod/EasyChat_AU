import * as actionTypes from '../actions/types';

const currentUser = (state = {}, action) => {
    switch(action.type) {
        case actionTypes.SET_CURRENT_USER:
            return {...action.data}
        case actionTypes.REMOVE_CURRENT_USER:
            return {}
        case actionTypes.UPDATE_CURRENT_USER:
            return {...state,links:action.data}
        default:
            return state;
    }
}

export default currentUser;