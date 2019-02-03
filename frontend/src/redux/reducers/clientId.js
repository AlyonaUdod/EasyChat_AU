import * as actionTypes from '../actions/types';

const clientId = (state = '', action) => {
    switch(action.type) {
        case actionTypes.SET_CLIENT_ID:
            return action.data
        default:
            return state;
    }
}

export default clientId;

