import React, { Component } from 'react'
import Chat from '../Chat/Chat';
import UserPanel from '../UserPanel/UserPanel';
import ChannelPanel from '../ChannelPanel/ChannelPanel'

export default class Main extends Component {
  render() {
    return (
        <div className='chatWrapper'>
            <div className = 'userPanelContainer'>
            <UserPanel user={this.props.user} onlineUsers={this.props.onlineUsers}/>
            <ChannelPanel users={this.props.users}/>
            </div>
            <Chat user={this.props.user} online={this.props.online} messages={this.props.messages}/> 
        </div>
    )
  }
}
