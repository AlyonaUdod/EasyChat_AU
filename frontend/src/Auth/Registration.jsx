import React, { Component } from 'react'
import firebase from '../firebase';
import {NavLink} from 'react-router-dom'
import {Grid, Form, Segment, Button, Header, Message, Icon} from 'semantic-ui-react'
import md5 from 'md5'

export default class Registration extends Component {

  state = {
    username: '',
    email: '',
    password: '',
    passwordConfirm: '',
    errors: [],
    usersRef: firebase.database().ref('users')
  }

  handlerChange = (e) => {
    let value = e.target.value;
    let name = e.target.name;
    this.setState({
      [name]: value,
    })
  }

  handlerSubmit = (e) => {
    e.preventDefault()
    if (this.isFormValid()) {
      firebase
      .auth()
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then(createdUser => {
        console.log(createdUser)
        createdUser.user.updateProfile({
          displayName: this.state.username,
          photoURL:`http://gravatar.com/avatar/${md5(createdUser.user.email)}?d=identicon`
        })
        .then(() => {
          this.saveUser(createdUser)
          .then(() => console.log('user saved'))
          .catch(err => {
            console.error(err)
            this.setState({
              errors: this.state.errors.concat(err)
            })
          })
        })
      })
      .catch(err => {
        console.error(err)
        this.setState({
          errors: this.state.errors.concat(err)
        })
      })
    } 
  }

  saveUser = createdUser => {
    return this.state.usersRef.child(createdUser.user.uid).set({
      name: createdUser.user.displayName,
      avatar: createdUser.user.photoURL,
    })
  }

  isFormEmpty =({username, email, password, passwordConfirm}) => {
    return username && email && password && passwordConfirm
  }

  isPasswordValid =({password, passwordConfirm }) => {
    return password === passwordConfirm
  }

  isFormValid = () => {
    let errors = [];
    let error;
    if (!this.isFormEmpty(this.state)) {
      error = {
        message: 'Fill in all fields'
      };
      this.setState({
        errors: errors.concat(error)
      })
      console.log(false)
      return false
    } else if (!this.isPasswordValid(this.state)){
      error = {
        message: 'Password is invalid'
      };
      this.setState({
        errors: errors.concat(error)
      })
      console.log(false)
      return false
    } else {
      this.setState({
        errors: []
      })
      console.log(true)
      return true;
    }
  }

  handleInput = (errors, inputName) => {
    return errors.some(el => el.message.toLowerCase().includes(inputName)) ? 'error' : ''
  }

  render() {
    return (
        <Grid textAlign='center' verticalAlign='middle' className='app'>
          <Grid.Column style={{
            maxWidth: 450
          }}>
          <Header as='h2' icon color='purple' textAlign='center'>
            <Icon name='comment alternate' color='purple'/>
            Register for PsevdoSlack
          </Header>
          <Form size='large' onSubmit={this.handlerSubmit}>
            <Segment stacked>
              <Form.Input 
                fluid
                name='username'
                icon='user'
                iconPosition='left'
                placeholder="Username"
                type='text'
                onChange={this.handlerChange}
                value={this.state.name}
                className={this.handleInput(this.state.errors, 'username')}/>
              <Form.Input 
                fluid
                name='email'
                icon='mail'
                iconPosition='left'
                placeholder="Email"
                type='email'
                onChange={this.handlerChange}
                value={this.state.email}
                className={this.handleInput(this.state.errors, 'email')}/>
              <Form.Input 
                fluid
                name='password'
                icon='lock'
                iconPosition='left'
                placeholder="Password"
                type='password'
                onChange={this.handlerChange}
                value={this.state.password}
                className={this.handleInput(this.state.errors, 'password')}/>
              <Form.Input 
                fluid
                name='passwordConfirm'
                icon='repeat'
                iconPosition='left'
                placeholder="Password Confirm"
                type='password'
                onChange={this.handlerChange}
                value={this.state.passwordConfirm}
                className={this.handleInput(this.state.errors, 'password')}/> 
              <Button color='purple' fluid size='large'>
                Submit
              </Button>
            </Segment>
          </Form>
          {this.state.errors.length > 0 && (
            <Message error>
              <h3>Error</h3>
              {this.state.errors.map(el => <p key={el.message}>{el.message}</p>)}
            </Message>
          )}
            <Message>
              Already a user? 
              <NavLink to='/login'>&nbsp;Login</NavLink>
            </Message>
          </Grid.Column>
        </Grid>
    )
  }
}