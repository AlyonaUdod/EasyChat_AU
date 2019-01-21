import React, { Component } from 'react';
import './App.css';
import Chat from './Chat/Chat';
import Login from './Auth/Login'
import socket from "socket.io-client";
import moment from 'moment'
import UserPanel from './UserPanel/UserPanel';

window.socket = socket(window.location.origin, {
    path: "/chat/"
}, {transports: ['websocket']});

class App extends Component {
  
  state = {
    modal: true,
    user: '',
    error: false,
    online: 0,
    messages: [],
    usersOnline: [],
  }

  handlerChange = (e) => {
    this.setState({
      user: e.target.value
    })
  }

  toggleModal = () => {
    if (this.state.user) {
        this.setState(prev => ({
          modal: false
        }))
    } else {
        this.setState(prev => ({
          messages: [...prev.messages, {time: moment().format('LTS'), user: 'Admin', content: 'Sorry, can\'t load previos messages'}],
          modal: false,
        }))
    }
  }

  onClick = () => {
    // this.uniqueNames(this.state.messages)
    this.toggleModal()
    let obj = {
      userName: this.state.user,
      userId: this.state.userId,
    }
    window.socket.emit('send-user-name-to-online-DB', obj)
  }

  componentWillMount(){ 
    
    window.socket.on("all-messages", (obj) => {
      console.log('aaaaaaaaaaaaaa2')
        this.setState({
            messages: obj.docs,
            online: obj.online,
            usersOnline: [...obj.usersOnline],
            userId: obj.clientId,
        })
    })

    let user = {
      data: 'succsess',
    }
    window.socket.emit('new-user', user)
    console.log('aaaaaaaaaaaaaa1')
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
     const {modal, online, messages, usersOnline} = this.state
    return (
  
      <div className="App">
        {modal ? <Login closeModal={this.onClick} user={this.state.user} handlerChange={this.handlerChange}error={this.state.error}/> : messages.length === 0 && online === 0 ? <div> Waiting </div> : <div className='chatWrapper'>
          <UserPanel users={usersOnline} user={this.state.user}/><Chat user={this.state.user} online={this.state.online} messages={this.state.messages}/> </div>}
      </div>
    );
  }
}

export default App;
