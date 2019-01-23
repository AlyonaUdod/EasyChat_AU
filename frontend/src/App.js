import React, { Component } from 'react';
import './App.css';

import Login from './Auth/Login'
import socket from "socket.io-client";
import { Switch, Route, withRouter } from 'react-router-dom';
import Registration from './Auth/Registration'
import Main from './Main/Main';


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
    currentUser: '',
    allUsers: [],
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
      userName: this.state.currentUser.username,
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
      username: this.state.user,
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
        }
      window.socket.emit('registration', user)
    } else {
      this.setState({
        error: 'Different password!'
      })
    }
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

  // componentDidUpdate() {
  //   if(this.state.active) {
  //         // this.props.setUser(user);
  //         this.props.history.push('/')
  //       } else {
  //         this.props.history.push('/login')
  //         // this.props.clearUser()
  //       }
  // }


  componentDidMount() {

    if(!this.state.modal) {
      // this.props.setUser(user);
      console.log('Uraaa')
      this.props.history.push('/')
    } else {
      this.props.history.push('/login')
      // this.props.clearUser()
    }

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
     const {modal, email} = this.state
    return (
  
      <div className="App">
      
        <Switch>
          <Route path='/login' render={(props) => <Login {...props} closeModal={this.onClick} user={this.state.user} password={this.state.password} handlerChange={this.handlerChange} error={this.state.error} reset={this.resetFields} login={this.loginToChat} email={email}/>}/>

          <Route path='/registration' render={(props) => <Registration {...props} closeModal={this.onClick} user={this.state.user} password={this.state.password} handlerChange={this.handlerChange} error={this.state.error} registration={this.registrationToChat} reset={this.resetFields} email={email}/>}/>

          <Route exact path='/' render={(props) => <Main users={this.state.allUsers} user={this.state.currentUser.username} onlineUsers={this.state.usersOnline} online={this.state.online} messages={this.state.messages}/>}/>

        </Switch>
    

      </div>
    );
  }
}

export default withRouter(App);
