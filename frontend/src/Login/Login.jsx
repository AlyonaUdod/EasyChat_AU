import React, { Component } from 'react';
import style from './Login.module.css';
import { FaEnvelope, FaUnlockAlt } from "react-icons/fa";
import { NavLink } from 'react-router-dom';

class Login extends Component {

  state = {
    email: '',
    password: '',
    // errors: [{message: 'Server error!!!'}],
  }

  handelChange = (e) => {
    let change = e.target.name;
    let value = e.target.value;
    this.setState({
      [change]: value
    })
  }

  loginToChat = (e) => {
    e.preventDefault()
    let user = {
      email: this.state.email,
      password: this.state.password,
    }
    window.socket.emit('login', user)
  }

  render() {

    {this.props.clearInput && this.setState({email: '', password: ''})}

    return (
      <div className={style.registration_page}>

          <div className={style.form_place}>
              <h2 className={style.emblema}>B8 chat</h2>

              <form className={style.form} onSubmit={this.loginToChat}>

                <div className={style.div_input}>
                  <FaEnvelope className={style.icon_input}/>
                  <input className={style.input} type="email" name="email" id="" value={this.props.email} onChange={this.handelChange} placeholder='Enter  email' required/>
                </div>

                <div className={style.div_input}>
                  <FaUnlockAlt className={style.icon_input}/>
                  <input className={style.input} type="password" name="password" value={this.props.password} onChange={this.handelChange} placeholder='Enter password' required/>
                </div>
                                   
                <input className={style.submit_btn} type="submit" value="Log in" />

              </form>

              <p className={style.subtitle}>Don't have an account ?        
                <NavLink className={style.subtitle_navlink} to='/registration' onClick={this.props.clearError}>Registration</NavLink>
              </p>

                <p className={style.error}>
                  {this.props.error && this.props.error}
                </p>

        </div>
      </div>
    )
  }
}

export default Login;