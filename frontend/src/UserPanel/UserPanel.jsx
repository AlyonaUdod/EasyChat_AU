

// как шифруется
// что шифруется
// чем шифруется


import React, { Component } from 'react'
import { List, Image, Container,Segment, Icon, Header, Dropdown } from 'semantic-ui-react';
import md5 from 'md5'

export default class UserPanel extends Component {

    state = {
        allUsers: this.props.users,
    }

    dropdownOptions = () => [
        // {
        //     key: 'user',
        //     text: <span> <Icon name='smile'/> Sign in as <strong>User</strong></span>,
        //     disabled: true,
        // },
        {
            key: 'avatar',
            text: <span onClick={this.props.toggleModal}><Icon name='picture'/> Change Avatar</span>
        },
        {
            key: 'out',
            text: <span onClick={this.props.signOut}><Icon name='sign-out alternate'/> Sign Out</span>,
        }
    ]

  render() {
    //   console.log(this.state.allUsers)
    const {user} = this.props
    return (
      <Container fluid>
            <Segment style={{backgroundColor: '#f2711c', marginBottom: '15px', border: '10px solid white' }}> 
                <Header inverted  floated='left' as='h3'>
                    <Icon name='user secret'/>
                    <Header.Content>Easy Chat</Header.Content>
                </Header>
                <Header style={{padding:'0.25rem'}} as='h4' inverted>
                        <Dropdown trigger={   
                            <span> 
                            {user && <Image src={user.avatar ? user.avatar : `http://gravatar.com/avatar/${md5(user.username)}?d=identicon`} spased='right' style={{boxSizing:'border-box', marginRight: '.7rem'}} avatar/>}
                            {user && user.username}</span>
                        } options={this.dropdownOptions()}/>
                </Header>
                
            </Segment>
        </Container>
    )
  }
}
