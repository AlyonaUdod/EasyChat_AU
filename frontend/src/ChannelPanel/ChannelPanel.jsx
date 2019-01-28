import React, { Component } from 'react'
import { List, Image, Container,Segment, Divider, Menu, Icon, Modal, Form, Button } from 'semantic-ui-react';
import md5 from 'md5'

export default class ChannelPanel extends Component {

    state = {
        // channels: ['general'],
        modal: false,
        channel: '',
    }

    toggleModal = () => {
        this.setState( prev => ({
            modal: !prev.modal
        }))
    }

    handlerChange=(e)=> {
        this.setState({
            channel: e.target.value
        })
    }

    getOnline = (name) => { 
        if(this.props.usersOnline.length > 0){
            let a = this.props.usersOnline.filter(x => x.userName === name)
            if(a.length > 0){
               return <Icon name='circle' color='green'/>
            } else {
                return <Icon name='circle' color='grey'/>
            }
        }
    }

    createChannel = () => {
        let obj = {
            channelName: this.state.channel,  
            author: this.props.currentUser.email, 
            type: 'public',
        }
        this.setState({
            modal: false,
            channel: '',
        })
        window.socket.emit('create-channel', obj)
    }

  render() {

    const  {modal} = this.state
    return (
        <Container fluid className='all-users'>
             <Segment className='all-users'>
                <Menu.Item>
                    <span>
                        <Icon name='group'/> CHANNELS
                    </span> ({this.props.channels && this.props.channels.filter(el => el.type === 'public').length}) 
                    <Icon name='add' onClick={this.toggleModal}/>
                </Menu.Item>
                <List divided verticalAlign='middle'>
                     {this.props.channels && this.props.channels.map(el=> el.type==='public' ?

                     <List.Item key={el._id} id={el._id} onClick={this.props.changeCurrentChannel}>
                         <List.Content>
                             <List.Header as='a' id={el._id}># {el.channelName}</List.Header>
                         </List.Content>
                     </List.Item>
                     : null
                     )}
                 </List>

                 <Divider/>
                 <Menu.Item>
                    <span>
                        <Icon name='pencil alternate'/> DIRECT MESSAGES
                    </span> 
                </Menu.Item>
                 {/* <h4 style={{fontStyle: 'italic', textAlign:'center'}}>Direct Messages</h4> */}
                <List divided verticalAlign='middle'>
                    {this.props.users && this.props.users.map(el=>
                    <List.Item key={el._id}>             
                        <Image avatar src= {el.avatar ? el.avatar : `http://gravatar.com/avatar/${md5(el.username)}?d=identicon`}/>
                        <List.Content>
                            <List.Header as='a' id={el.email} onClick={this.props.directMessages}>{el.username}&nbsp;&nbsp;
                            {this.props.usersOnline.length > 0 && this.getOnline(el.username)}
                            </List.Header>
                        </List.Content>
                       
                    </List.Item>
                    )}
                </List>
            </Segment>


            <React.Fragment>
            <Modal open={modal} onClose={this.toggleModal}>
                <Modal.Header as='h2' style={{textAlign:'center'}}>
                        Add New Channel 
                </Modal.Header>

                <Modal.Content>
                <Form size='large' onSubmit={this.createChannel}>
                    <Segment>
                    <Form.Input 
                        fluid
                        name='channel'
                        icon='list'
                        iconPosition='left'
                        placeholder="Channel"
                        type='text'
                        onChange={this.handlerChange}
                        />
                    {/* <Form.Input 
                        fluid
                        name='about'
                        icon='pencil'
                        iconPosition='left'
                        placeholder="About"
                        type='text'
                        onChange={this.handlerChange}
                        value={this.state.password}
                        /> */}
                    </Segment>
                </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button positive size='large' onClick={this.createChannel}>Add channel</Button>
                    <Button negative color='purple' size='large' onClick={this.toggleModal}>Cansel</Button>
                </Modal.Actions>
            </Modal>
        </React.Fragment>
         </Container>
    )
  }
}
