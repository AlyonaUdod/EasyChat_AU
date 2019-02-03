import {combineReducers} from 'redux'; // объединяет все поля в один объект
import allUsers from './allUsersReducers';
import currentUser from './currentUserReducer';
import allChannels from './allChannelsReducer';
import currentChannel from './currentChannelReducer';
import clientId from './clientId.js'

const rootReducer = combineReducers({
    allUsers: allUsers,
    allChannels: allChannels,
    currentUser: currentUser,
    currentChannel: currentChannel,
    clientId: clientId,
})

export default rootReducer;
