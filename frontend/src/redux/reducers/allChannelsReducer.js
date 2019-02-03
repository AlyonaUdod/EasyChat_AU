import * as actionTypes from '../actions/types';

const allChannels = (state = [], action) => {
    switch(action.type) {
        case actionTypes.SET_ALL_CHANNELS:
            return [...action.data]
        case actionTypes.REMOVE_ALL_CHANNELS:
            return []
        case actionTypes.UPDATE_ALL_CHANNELS:
            return [...action.data]
        default:
            return state;
    }
}

export default allChannels;