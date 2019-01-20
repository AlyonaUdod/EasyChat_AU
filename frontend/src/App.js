import React, { Component } from 'react';
import './App.css';
import Chat from './Chat/Chat';
import Login from './Auth/Login'
import socket from "socket.io-client";
// import axios from 'axios'
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

    componentDidMount(){
      console.log('aaaaaaaaaaaaaa1')

      window.socket.on("change-online", (online) => {
        this.setState({
            online: online
        })
     })

      window.socket.once("all-messages", (docs) => {
          console.log('aaaaaaaaaaaaaa2')
          this.setState(prev => ({
              messages: [...docs],
          }))
      })

    //  setTimeout(() => {
    //    if (this.state.messages.length === 0) {
    //       window.socket.once("all-messages", (docs) => {
    //         console.log('aa333')
    //         this.setState(prev => ({
    //             messages: [...docs],
    //         }))
    //     })
    //    }
    //  }, 2000);

    }
  
  render() {
     const {modal, online, messages} = this.state
    return (
  
      <div className="App">
        {modal ? <Login closeModal={this.toggleModal} user={this.state.user} handlerChange={this.handlerChange}error={this.state.error}/> : messages.length === 0 && online === 0 ? <div> Waiting</div> : <Chat user={this.state.user} online={this.state.online} messages={this.state.messages}/> }
      </div>
    );
  }
}

export default App;
