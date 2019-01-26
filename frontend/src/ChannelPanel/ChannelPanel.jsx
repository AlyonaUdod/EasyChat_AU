import React, { Component } from 'react'
import { List, Image, Container,Segment, Divider, Menu, Icon, Modal, Form, Button } from 'semantic-ui-react';
import md5 from 'md5'

export default class ChannelPanel extends Component {

    state = {
        channels: ['general'],
        modal: false,
    }

    toggleModal = () => {
        this.setState( prev => ({
            modal: !prev.modal
        }))
    }

  render() {
    const  {channels, modal} = this.state
    return (
        <Container fluid className='all-users'>
             <Segment className='all-users'>
                <Menu.Item>
                    <span>
                        <Icon name='chat'/> CHANNELS
                    </span> ({channels.length}) 
                    {/* <Icon name='add' onClick={this.toggleModal}/> */}
                </Menu.Item>
                <List divided verticalAlign='middle'>
                     {this.state.channels.map(el=>
                     <List.Item key={el}>
                         <List.Content>
                             <List.Header as='a'>#{el}</List.Header>
                         </List.Content>
                     </List.Item>
                     )}
                 </List>

                 <Divider/>
                 <h4 style={{fontStyle: 'italic', textAlign:'center'}}>All Users</h4>
                <List divided verticalAlign='middle'>
                    {this.props.users && this.props.users.map(el=>
                    <List.Item key={el._id}>             
                        <Image avatar src= {el.avatar ? el.avatar : `http://gravatar.com/avatar/${md5(el.username)}?d=identicon`}/>
                        <List.Content>
                            <List.Header as='a'>{el.username}</List.Header>
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
                <Form size='large' onSubmit={this.handlerSubmit}>
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
                    <Form.Input 
                        fluid
                        name='about'
                        icon='pencil'
                        iconPosition='left'
                        placeholder="About"
                        type='text'
                        onChange={this.handlerChange}
                        value={this.state.password}
                        />
                    </Segment>
                </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button positive size='large' onClick={this.handlerSubmit}>Add channel</Button>
                    <Button negative color='purple' size='large' onClick={this.toggleModal}>Cansel</Button>
                </Modal.Actions>
            </Modal>
        </React.Fragment>
         </Container>
    )
  }
}
