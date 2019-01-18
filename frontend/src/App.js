import React, { Component } from 'react';
import './App.css';
import Chat from './Chat/Chat';
import Login from './Auth/Login'


class App extends Component {
  
  state = {
    modal: true,
    user: '',
  }

  handlerChange = (e) => {
    this.setState({
      user: e.target.value
    })
  }

  toggleModal = () => {
    this.setState(prev => ({
      modal: false
    }))
  }
  
  render() {
     const {modal} = this.state
    return (
  
      <div className="App">
        {modal ? <Login closeModal={this.toggleModal} user={this.state.user} handlerChange={this.handlerChange}/> : <Chat user={this.state.user}/> }
      </div>
    );
  }
}

export default App;
