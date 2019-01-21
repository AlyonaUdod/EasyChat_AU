import React, { Component } from 'react';
import './App.css';
import Chat from './Chat/Chat';
import Login from './Auth/Login'
import socket from "socket.io-client";
import moment from 'moment'

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
  }

  handlerChange = (e) => {
    this.setState({
      user: e.target.value
    })
  }

  toggleModal = () => {
    if (this.state.messages.length !== 0) {
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

  componentWillMount(){ 
    
    window.socket.on("all-messages", (obj) => {
      console.log('aaaaaaaaaaaaaa2')
        this.setState({
            messages: obj.docs,
            online: obj.online,
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
          online: online
      })
   })
  }

  componentWillUnmount(){
    window.socket.emit('disconnect')
  }

  
  render() {
     const {modal, online, messages} = this.state
    return (
  
      <div className="App">
        {modal ? <Login closeModal={this.toggleModal} user={this.state.user} handlerChange={this.handlerChange}error={this.state.error}/> : messages.length === 0 && online === 0 ? <div> Waiting </div> : <Chat user={this.state.user} online={this.state.online} messages={this.state.messages}/> }
      </div>
    );
  }
}

export default App;
