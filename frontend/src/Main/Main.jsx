import React, { Component } from 'react'
import Chat from '../Chat/Chat';
import UserPanel from '../UserPanel/UserPanel';
import ChannelPanel from '../ChannelPanel/ChannelPanel'
import { Modal, Input, Button, Icon } from 'semantic-ui-react';

export default class Main extends Component {

  state = {
    modal: false,
    file: null,
    correctType: ['image/jpg', 'image/png', 'image/jpeg'],
    currentUser: this.props.currentUser,
  }

  toggleModal = () => {
    this.setState(prev=> ({
      modal: !prev.modal
    }))
  }

addFile = e => {
    const file = e.target.files[0]
    console.log(file)
    if (file) {
        this.setState({
            file
        })
    }
}

uploadFile = (file, metadata) => {
    console.log(file, metadata)
}

// isFileTypeCorrect = fileName => this.state.correctType.includes(mime.lookup(fileName))

sendFile = () => {
    if (this.state.file !== null) {
      let obj = {
        id: this.state.currentUser._id,
        img: this.state.file,
      }
      window.socket.emit('change-user-avatar', obj)
      this.toggleModal()
    }
}



  render() {
    //   console.log(this.props.usersOnline)
    return (
        <div className='chatWrapper'>
            <div className = 'userPanelContainer'>
            <UserPanel user={this.props.currentUser} toggleModal={this.toggleModal} users={this.props.users} signOut={this.props.signOut}/>
            <ChannelPanel users={this.props.users} usersOnline={this.props.usersOnline} channels={this.props.channels} changeCurrentChannel={this.props.changeCurrentChannel} currentChannel={this.props.currentChannel} currentUser={this.props.currentUser} directMessages={this.props.directMessages}/>
            </div>
            <Chat user={this.props.user} online={this.props.online} messages={this.props.messages} currentUser={this.props.currentUser} allUsers={this.props.users} currentChannel={this.props.currentChannel}/> 
            
            <Modal open={this.state.modal} onClose={this.toggleModal}>
                <Modal.Header>Select An Image File</Modal.Header>
                <Modal.Content>
                    <Input fluid label='File types: jpg, png' name='file' type='file' onChange={this.addFile}/>
                </Modal.Content>
                <Modal.Actions>
                    <Button color='green' inverted onClick={this.sendFile}>
                        <Icon name='checkmark'/> Send
                    </Button>
                    <Button color='red' inverted onClick={this.toggleModal}>
                        <Icon name='remove'/> Cancel
                    </Button>
                </Modal.Actions>
            </Modal>
        </div>
    )
  }
}
