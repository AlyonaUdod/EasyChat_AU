import * as actionTypes from '../actions/types';

const currentChannel = (state = {}, action) => {
    switch(action.type) {
        case actionTypes.SET_CURRENT_CHANNEL:
            return {...action.data}
        case actionTypes.REMOVE_CURRENT_CHANNEL:
            return {}
        case actionTypes.UPDATE_CURRENT_CHANNEL:
            return {...action.data}
        default:
            return state;
    }
}

export default currentChannel;

