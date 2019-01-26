import React, { Component } from 'react';
import './App.css';
import md5 from 'md5';

import Login from './Auth/Login'
import socket from "socket.io-client";
import { Switch, Route, withRouter } from 'react-router-dom';
import Registration from './Auth/Registration'
import Main from './Main/Main';
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
    messages: [],
    usersOnline: [],
    currentUser: '',
    allUsers: [],
    file: null,
    userId: '',
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
      userId: '',
      modal: true,
    })
    this.props.history.push('/login')
  }

  // componentWillMount(){ 
  //   window.socket.on("all-messages", (obj) => {
  //     // console.log(obj)
  //       this.setState({
  //           messages: obj.docs,
  //           online: obj.online,
  //           usersOnline: [...obj.usersOnline],
  //           userId: obj.clientId,
  //           allUsers: obj.allUsers,
  //       })
  //   })
  //   // {...el, avatar:`data:image/jpeg;base64,${el.avatar}`})
  //   window.socket.on("all-users", (allUsers) => {
  //     let arr = allUsers.map(el => el.avatar ? ({...el, avatar:`data:image/jpeg;base64,${el.avatar}`}) : el)
  //     // console.log(a)
  //       this.setState({
  //           allUsers: arr,
  //       })
  //   })

  //   let user = {
  //     data: 'succsess',
  //   }
  //   window.socket.emit('new-user', user)
  // }




  componentDidMount() {
    if(!this.state.modal) {
      // this.props.setUser(user);
      // console.log('Uraaa')
      this.props.history.push('/')
    } else {
      this.props.history.push('/login')
      // this.props.clearUser()
    }


    window.socket.on("all-messages", (obj) => {
      // console.log(obj)
        this.setState({
            messages: obj.docs,
            online: obj.online,
            usersOnline: [...obj.usersOnline],
            userId: obj.clientId,
            allUsers: obj.allUsers,
        })
    })
    // {...el, avatar:`data:image/jpeg;base64,${el.avatar}`})
    window.socket.on("all-users", (allUsers) => {
      let arr = allUsers.map(el => el.avatar ? ({...el, avatar:`data:image/jpeg;base64,${el.avatar}`}) : el)
        this.setState({
            allUsers: arr,
        })
    })

    let user = {
      data: 'succsess',
    }
    window.socket.emit('new-user', user)

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
        // console.log(message)
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
        this.setState({
          currentUser: obj,
          // user: message.currentUser.username,
          error: '',
          email: '',
          password: '',
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
        // console.log(message.currentUser)
        let obj = {}
        if (message.currentUser.avatar) {
          // console.log('exist')
          obj = {...message.currentUser, avatar:`data:image/jpeg;base64,${message.currentUser.avatar}`}
        } else {
          // console.log('noooooo exist')
          obj = message.currentUser
        }

        this.setState({
          currentUser: obj,
          // user: message.currentUser.username,
          error: '',
          email: '',
          password: '',
        }, this.onClick)
        // console.log(message.message)
      } else{
        this.setState({
          error: message.message,
        })
      }
    })

    window.socket.on('user-avatar-was-edited', (obj) => {
      // console.log('Its obj!!', obj)
      let gg = {...obj, avatar:`data:image/jpeg;base64,${obj.avatar}`}
      // console.log(gg)
      this.setState({
        currentUser: gg,
      })
    })
  }

  componentDidUpdate(){
  }

  render() {
     const {email} = this.state
    return (
  
      <div className="App">
      
        <Switch>
          <Route path='/login' render={(props) => <Login {...props} closeModal={this.onClick} user={this.state.user} password={this.state.password} handlerChange={this.handlerChange} error={this.state.error} reset={this.resetFields} login={this.loginToChat} email={email}/>}/>

          <Route path='/registration' render={(props) => <Registration {...props} closeModal={this.onClick} user={this.state.user} password={this.state.password} handlerChange={this.handlerChange} error={this.state.error} registration={this.registrationToChat} reset={this.resetFields} email={email}/>}/>

          <Route exact path='/' render={(props) => <Main users={this.state.allUsers} user={this.state.currentUser.username} onlineUsers={this.state.usersOnline} online={this.state.online} messages={this.state.messages} currentUser={this.state.currentUser} signOut={this.signOut}/>}/>

        </Switch>

      </div>
    );
  }
}

export default withRouter(App);
