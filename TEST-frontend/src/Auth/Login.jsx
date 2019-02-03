import React, { Component } from 'react'
import {Grid, Form, Segment, Button, Header, Message, Icon} from 'semantic-ui-react'
import {NavLink} from 'react-router-dom'

export default class Login extends Component {

  render() {
    return (
      <Grid textAlign='center' verticalAlign='middle' className='app'>
      <Grid.Column style={{
        maxWidth: 450
      }}>
      <Header as='h2' icon color='orange' textAlign='center'>
        <Icon name='user circle' color='orange'/>
        Log in chat!
      </Header>
      <Form size='large' onSubmit={this.props.login}>
        <Segment>
          {/* <Form.Input 
            fluid
            name='user'
            icon='user'
            iconPosition='left'
            placeholder="Enter Username"
            type='text'
            onChange={this.props.handlerChange}
            value={this.props.user}
            required
            autoFocus
            /> */}
             <Form.Input 
            fluid
            name='email'
            icon='mail'
            iconPosition='left'
            placeholder="Enter Email"
            type='email'
            onChange={this.props.handlerChange}
            value={this.props.email}
            required
            autoFocus
            />
           <Form.Input 
            fluid
            name='password'
            icon='lock'
            iconPosition='left'
            placeholder="Password"
            type='password'
            onChange={this.props.handlerChange}
            value={this.props.password}
            required
            />
          <Button color='orange' fluid size='large'>
            Log In Easy Chat
          </Button>
        </Segment>
      </Form>
        {this.props.error &&
          <Message error>
            <h3>Error</h3>
          {this.props.error}
           </Message> }
        <Message>
          Don't have an account?
          <NavLink to='/registration' onClick={this.props.reset}>&nbsp;Registration</NavLink>
        </Message>
      </Grid.Column>
     
    </Grid>
    )
  }
}
