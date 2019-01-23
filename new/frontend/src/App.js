import React, { Component } from 'react';
import './App.css';
import Chat from './Chat/Chat';
import Login from './Auth/Login'
import socket from "socket.io-client";
import UserPanel from './UserPanel/UserPanel';
import { Switch, Route } from 'react-router-dom';
import Registration from './Auth/Registration'
import ChannelPanel from './ChannelPanel/ChannelPanel'

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
    messages: [],
    usersOnline: [],
    currentUser: {},
    allUsers: [],
  }

  handlerChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  toggleModal = () => {
      this.setState(prev => ({
        modal: false,
      }))
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
      username: this.state.user,
      email: this.state.email,
      password: this.state.password,
    }
    window.socket.emit('login', user)
  }

// state - объект в умном компоненте, в котором хранятся данные для рендера

  registrationToChat = () => {
    // console.log('It\'s work!')
    if (this.state.password === this.state.passwordConfirm) {
       let user = {
        username: this.state.user,
        password: this.state.password,
        email: this.state.email,
        }
      window.socket.emit('registration', user)
    } else {
      this.setState({
        error: 'Different password!'
      })
    }
  }

  onClick = () => {
    // this.uniqueNames(this.state.messages)
    this.toggleModal()
    let obj = {
      userName: this.state.currentUser.username,
      userId: this.state.userId,
    }
    window.socket.emit('send-user-name-to-online-DB', obj)
  }

  componentWillMount(){ 
    // console.log()
    window.socket.on("all-messages", (obj) => {
      console.log(obj)
        this.setState({
            messages: obj.docs,
            online: obj.online,
            usersOnline: [...obj.usersOnline],
            userId: obj.clientId,
            allUsers: obj.allUsers,
        })
    })
    window.socket.on("all-users", (allUsers) => {
        this.setState({
            allUsers: allUsers,
        })
    })

    let user = {
      data: 'succsess',
    }
    // console.log('oooo')
    window.socket.emit('new-user', user)
  }

  componentDidMount() {
    window.socket.on("change-online", (online) => {
      this.setState({
          online: online,
        })
    })
    window.socket.on("get-user-name", (usersOnline) => {
      this.setState({
        usersOnline: [...usersOnline]
      })
    })

    window.socket.on('registration-on-DB', (message) => {
      if(message.message === 'User created') {
        console.log(message)
        this.setState({
          currentUser: message.currentUser,
          // user: message.currentUser.username,
          error: '',
      }, this.onClick)
      // console.log(message)
      } else {
        this.setState({
          error: message.message,
        })
      }
    })
    window.socket.on('login-on-DB', (message) => {
      if (message.message === 'User login success') {
        this.setState({
          currentUser: message.currentUser,
          // user: message.currentUser.username,
          error: '',
        }, this.onClick)
        console.log(message.message)
      } else{
        this.setState({
          error: message.message,
        })
      }
    })
  }

  componentWillUnmount(){
    let user = {
      data: 'succsess',
    }
    window.socket.emit('disconnect', (user))
  }

  // uniqueNames=(arr)=> {
  //   // let  obj = {};
  //   //   for (let i = 0; i < arr.length; i++) {
  //   //   let str = arr[i].author;
  //   //   obj[str] = true; // запомнить строку в виде свойства объекта
  //   // }
  //   // let result = [...Object.keys(obj)];
  //   // if (!result.includes(this.state.user)) {
  //   //   result.push(this.state.user)
  //   // }
  //   this.setState(prev =>({
  //     users: [...prev.users, this.state.user],
  //   }))
  // }
  
  render() {
     const {modal, usersOnline, email, allUsers} = this.state
    return (
  
      <div className="App">
        {modal ? 
        <Switch>
          <Route exact path='/' render={(props) => <Login {...props} closeModal={this.onClick} user={this.state.user} password={this.state.password} handlerChange={this.handlerChange} error={this.state.error} reset={this.resetFields} login={this.loginToChat} email={email}/>}/>

          <Route path='/registration' render={(props) => <Registration {...props} closeModal={this.onClick} user={this.state.user} password={this.state.password} handlerChange={this.handlerChange} error={this.state.error} registration={this.registrationToChat} reset={this.resetFields} email={email}/>}/>

        </Switch>

        :   <div className='chatWrapper'>
            <div className = 'userPanelContainer'>
              <UserPanel users={allUsers} user={this.state.currentUser.username} onlineUsers={usersOnline}/>
              <ChannelPanel/>
            </div>
              <Chat user={this.state.user} online={this.state.online} messages={this.state.messages}/> 
            </div>}

      </div>
    );
  }
}

export default App;
