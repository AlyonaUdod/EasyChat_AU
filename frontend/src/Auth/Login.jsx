import React, { Component } from 'react'
import {Grid, Form, Segment, Button, Header, Message, Icon} from 'semantic-ui-react'

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
      <Form size='large' onSubmit={this.handlerSubmit}>
        <Segment>
          <Form.Input 
            fluid
            name='username'
            icon='user'
            iconPosition='left'
            placeholder="Enter Username"
            type='text'
            onChange={this.props.handlerChange}
            value={this.props.user}
            required
            autofocus
            />
          <Button color='orange' fluid size='large' onClick={this.props.closeModal}>
            Log In Chat
          </Button>
        </Segment>
      </Form>
      {/* {this.state.errors.length > 0 && (
        <Message error>
          <h3>Error</h3>
          {this.state.errors.map(el => <p key={el.message}>{el.message}</p>)}
        </Message>
      )} */}
        {this.props.error &&
          <Message>
          Enter user name, please!
          {/* <NavLink to='/registration'>&nbsp;Registration</NavLink>  */}
        </Message> }
      </Grid.Column>
     
    </Grid>
    )
  }
}
