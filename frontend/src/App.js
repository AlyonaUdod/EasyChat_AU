import React, { Component } from 'react';
import './App.css';
import Chat from './Chat/Chat';
import Login from './Auth/Login'
import socket from "socket.io-client";

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
    if (this.state.user) {
      this.setState(prev => ({
        modal: false
      }))
    } else {
      this.setState(prev => ({
        error: true
      }))
    }
  }

    componentDidMount(){
      // console.log('aaaaaaaaaaaaaa1')
      // window.socket.once("all-messages", (docs) => {
      //     console.log('aaaaaaaaaaaaaa2')
      //     this.setState(prev => ({
      //         messages: [...docs],
      //     }))
      // })
    //   window.socket.on("change-online", (online) => {
    //     this.setState({
    //         online: online
    //     })
    //  })
    }
  
  render() {
     const {modal} = this.state
    return (
  
      <div className="App">
        {modal ? <Login closeModal={this.toggleModal} user={this.state.user} handlerChange={this.handlerChange}error={this.state.error}/> : <Chat user={this.state.user} online={this.state.online} messages={this.state.messages}/> }
      </div>
    );
  }
}

export default App;
