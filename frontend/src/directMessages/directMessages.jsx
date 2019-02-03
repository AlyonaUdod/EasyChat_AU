import React, { Component } from 'react';
import style from './directMessages.module.css';
import { connect } from 'react-redux';
// import { setCurrentDirectUser } from '../redux/actions/allChannelsAction.js';
import { FaCircle } from 'react-icons/fa';
import md5 from 'md5'
import {setCurrentChannel} from '../redux/actions/currentChannelAction';

class DirectMessages extends Component {

  state = {
    usersOnline: [],
  }

  componentDidMount() {  
    window.socket.on("send-users-online", (usersOnline) => {
      this.setState({
        usersOnline: usersOnline
      })
    })
  }

  checkOnline = (email) => {
    let user = this.state.usersOnline.find(el => el.userEmail === email) 

    if(user !== undefined){
      return <FaCircle color='green' id={email}/>
    } else  {
      return <FaCircle color='white' id={email}/>
    }
  }

  directMessages=(e)=> {
 
    let arr = this.props.allChannels.filter(el => el.channelName === `${this.props.currentUser.email}/${e.target.id}` || el.channelName === `${e.target.id}/${this.props.currentUser.email}`)

    if(arr.length === 0) {
        let obj ={
            channelName: `${this.props.currentUser.email}/${e.target.id}`,  
            author: this.props.currentUser.email, 
            type: 'privat',
        }
        // console.log(obj)
        window.socket.emit('create-channel', obj)
    } else {

      let channel = this.props.allChannels.find(el => el.channelName === `${this.props.currentUser.email}/${e.target.id}` || el.channelName === `${e.target.id}/${this.props.currentUser.email}`)
      // console.log(channel)
      this.props.setCurrentChannel(channel)
    }
}

  render() {

    return (
      <div className={style.directMessagesWrapper}>
        <h4>Direct Messages</h4>
        <div className={style.line}></div>
        <ul className={style.directMessagesList}>
          {this.props.allUsers.sort((a, b) => a.username !== b.username ? a.username < b.username ? -1 : 1 : 0).map(el => <li
          className={style.directMessagesItem} key={el._id} id={el.email}>

          {this.state.usersOnline && this.checkOnline(el.email)}

          <p className={style.pName_plus_avatar} id={el.email} onClick={this.directMessages}>
            {el.username}
            <img className={style.avatar} id={el.email} src={el.avatar ? el.avatar : `http://gravatar.com/avatar/${md5(el.username)}?d=identicon`} alt="avatar"/>
          </p>
          </li>)}
        </ul>
        
      </div>
    )
  }
}

function MSTP (state) {
  return {
      allChannels: state.allChannels,
      allUsers: state.allUsers,
      currentChannel: state.currentChannel,
      currentUser : state.currentUser,
  }
}

function MDTP (dispatch) {
  return {
      setCurrentChannel: function (data){
          dispatch(setCurrentChannel(data))
      },
  }
}

export default connect(MSTP, MDTP)(DirectMessages);