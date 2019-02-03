import React, { Component } from 'react';
import './App.css';
import md5 from 'md5';

import Login from './Auth/Login'
import socket from "socket.io-client";
import { Switch, Route, withRouter } from 'react-router-dom';
import Registration from './Auth/Registration'
import Main from './Main/Main';
import uuidv4 from 'uuid'
// import { Modal, Input, Button, Icon } from 'semantic-ui-react';


window.socket = socket(window.location.origin, {
    path: "/chat/"
}, {transports: ['websocket']});

class App extends Component {
  
  state = {
    modal: true,
    user: '',
    email: '',
    password: '',
    passwordConfirm: '',
    error: '',
    online: 0,
    usersOnline: [],
    currentUser: '',
    allUsers: [],
    file: null,
    userId: '',
    channels: [],
    currentChannel: null,
  }

  changeCurrentChannel = (e) => {
    // console.log('aaaa')
    let id = e.target.id
    let channel = this.state.channels.find(el => el._id === id)
    this.setState({
      currentChannel: channel,
    })
  }

  directMessages=(e)=> {
    // let id= 
    let arr = this.state.channels.filter(el => el.channelName === `${this.state.currentUser.email}/${e.target.id}` || el.channelName === `${e.target.id}/${this.state.currentUser.email}`)
    // console.log(arr)
    if(arr.length === 0) {
        let obj ={
            channelName: `${this.state.currentUser.email}/${e.target.id}`,  
            author: this.state.currentUser.email, 
            type: 'privat',
        }
        // console.log(obj)
        window.socket.emit('create-channel', obj)

    } else {
      let id = e.target.id
      console.log(id)
      let channel = this.state.channels.find(el => el.channelName === `${this.state.currentUser.email}/${e.target.id}` || el.channelName === `${e.target.id}/${this.state.currentUser.email}`)
      // console.log(this.state.channels)
      console.log(channel)
      this.setState({
        currentChannel: channel,
      })
    }
}

  handlerChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  toggleModal = () => {
    this.setState({
      modal: false,
    })
    this.props.history.push('/')
  }

  onClick = () => {
    this.toggleModal()
    let obj = {
      userEmail: this.state.currentUser.email,
      userId: this.state.userId,
    }
    window.socket.emit('send-user-name-to-online-DB', obj)
  }

  resetFields = () => {
    this.setState({
      user: '',
      email: '',
      password: '',
      passwordConfirm: '',
      error: '',
    })
  }

  loginToChat = () => {
    let user = {
      // username: this.state.user,
      email: this.state.email,
      password: this.state.password,
    }
    window.socket.emit('login', user)
  }

// state - объект в умном компоненте, в котором хранятся данные для рендера

  registrationToChat = () => {
    if (this.state.password === this.state.passwordConfirm) {
       let user = {
        username: this.state.user,
        password: this.state.password,
        email: this.state.email,
        avatar: `http://gravatar.com/avatar/${md5(this.state.user)}?d=identicon`,
        links: [{
            linkName: 'Google search',
            url: 'https://www.google.com/webhp',
            iconName: 'FaGoogle',
            linkId: uuidv4()
        }]
        }
      window.socket.emit('registration', user)
    } else {
      this.setState({
        error: 'Different password!'
      })
    }
  }

  signOut = () => {
    this.setState({
      currentUser: '',
      modal: true,
      messages: [],
      currentChannel: null,
    })
    this.props.history.push('/login')
    window.socket.emit('user-sign-out', this.state.userId)
  }

  componentDidMount() { 
    if(!this.state.modal) {
      this.props.history.push('/')
    } else {
      this.props.history.push('/login')
    }

    window.socket.emit('new-user')
    
    window.socket.on('client-id', (id) => {
      this.setState({
        userId: id
      })
    })

    window.socket.on("all-users", (allUsers) => {
      let arr = allUsers.map(el => el.avatar ? ({...el, avatar:`data:image/jpeg;base64,${el.avatar}`}) : el)
        this.setState({
            allUsers: arr,
        })
    })

    window.socket.on("all-channels", (data) => {
        if (this.state.currentChannel === null) {
            this.setState({
              channels: data.channels,
              currentChannel: data.channels.find(el => el.channelName === 'General'),
              online: data.online,
              usersOnline: [...data.usersOnline],
              userId: data.clientId,
          })
        } else {
            this.setState(prev =>({
              channels: data,
              currentChannel: data.find(el => prev.currentChannel._id === el._id),
          }))
        }
    })

    window.socket.on("change-online", (online) => {
      this.setState({
          online: online,
        })
    })

    window.socket.on("get-user-name", (usersOnline) => {
      this.setState({
        usersOnline: usersOnline
      })
    })

    window.socket.on('registration-on-DB', (message) => {
      if(message.message === 'User created') {

        let obj = {}
        // let obj = {...message.currentUser, avatar:`data:image/jpeg;base64,${message.currentUser.avatar}`}
        if (message.currentUser.avatar) {
          // console.log('exist')
          obj = {...message.currentUser, avatar:`data:image/jpeg;base64,${message.currentUser.avatar}`}
        } else {
          // console.log('noooooo exist')
          obj = message.currentUser
        }

        // console.log(obj)
        let arrUsers = message.allUsers.map(el => el.avatar ? ({...el, avatar:`data:image/jpeg;base64,${el.avatar}`}) : el)

        this.setState({          
          currentUser: obj,
          // user: message.currentUser.username,
          error: '',
          email: '',
          password: '',
          allUsers: arrUsers, 
          channels: message.allChannels,
          online: message.online,
          // usersOnline: usersOnline,
          clientId: message.clientId,
          currentChannel: message.allChannels.find(el => el.channelName === 'General')
      }, this.onClick)
      } else {
        this.setState({
          error: message.message,
        })
      }
    })
    window.socket.on('login-on-DB', (message) => {
      
      if (message.message === 'User login success') {
        console.log(message.currentUser)

        let objUser = {}
          if (message.currentUser.avatar) {
            // console.log('exist')
            objUser = {...message.currentUser, avatar:`data:image/jpeg;base64,${message.currentUser.avatar}`}
          } else {
            // console.log('noooooo exist')
            objUser = message.currentUser
          }

        let arrUsers = message.allUsers.map(el => el.avatar ? ({...el, avatar:`data:image/jpeg;base64,${el.avatar}`}) : el)

        this.setState({          
          currentUser: objUser,
          // user: message.currentUser.username,
          error: '',
          email: '',
          password: '',
          allUsers: arrUsers, 
          channels: message.allChannels,
          online: message.online,
          // usersOnline: usersOnline,
          clientId: message.clientId,
          currentChannel: message.allChannels.find(el => el.channelName === 'General')
        }, this.onClick)
      } else{
        this.setState({
          error: message.message,
        })
      }
    })

    window.socket.on('user-avatar-was-edited', (obj) => {
      // console.log('Its obj!!', obj)
      let newObj = {...obj, avatar:`data:image/jpeg;base64,${obj.avatar}`}
      this.setState({
        currentUser: newObj,
      })
    })

    window.socket.on("channel-created", (obj) => {
      console.log(obj)
      this.setState({
        currentChannel: obj,
      })
    })

    window.socket.on('channel-message-save', () => {
      console.log('succses!!!')
    })
  }


  render() {
     const {email, channels} = this.state
    return (
  
      <div className="App">

      
        <Switch>
          <Route path='/login' render={(props) => <Login {...props} closeModal={this.onClick} user={this.state.user} password={this.state.password} handlerChange={this.handlerChange} error={this.state.error} reset={this.resetFields} login={this.loginToChat} email={email}/>}/>

          <Route path='/registration' render={(props) => <Registration {...props} closeModal={this.onClick} user={this.state.user} password={this.state.password} handlerChange={this.handlerChange} error={this.state.error} registration={this.registrationToChat} reset={this.resetFields} email={email}/>}/>

{channels.length === 0 && this.state.allUsers.length === 0 && !this.state.currentUser && !this.state.currentChannel ? <div> Loading</div> :

<Route exact path='/' render={(props) => <Main users={this.state.allUsers} user={this.state.currentUser.username} usersOnline={this.state.usersOnline} online={this.state.online} messages={this.state.messages} currentUser={this.state.currentUser} signOut={this.signOut} channels={channels} currentChannel={this.state.currentChannel} changeCurrentChannel={this.changeCurrentChannel} directMessages={this.directMessages}/>}/>}

        </Switch>

      </div>
    );
  }
}

export default withRouter(App);
