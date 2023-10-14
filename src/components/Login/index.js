import {Component} from 'react'

import Cookies from 'js-cookie'

import {Redirect} from 'react-router-dom'

import './index.css'

class Login extends Component {
  state = {
    userId: '',
    pin: '',
    showErrorMsg: false,
    errorMsg: '',
  }

  onChangeUserId = event => {
    this.setState({userId: event.target.value})
  }

  onChangePin = event => {
    this.setState({pin: event.target.value})
  }

  success = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {
      expires: 600,
      path: '/',
    })
    history.replace('/')
  }

  fail = errorMsg => {
    this.setState({
      showErrorMsg: true,
      errorMsg,
    })
  }

  BankLogin = async event => {
    event.preventDefault()
    const {userId, pin} = this.state
    const userDetails = {user_id: userId, pin}
    const url = 'https://apis.ccbp.in/ebank/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }

    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      this.success(data.jwt_token)
    } else {
      this.fail(data.error_msg)
    }
  }

  render() {
    const {userId, pin, showErrorMsg, errorMsg} = this.state

    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="main-container">
        <div className="card-container">
          <div className="image-container">
            <img
              src="https://assets.ccbp.in/frontend/react-js/ebank-login-img.png"
              className="image"
              alt="website login"
            />
          </div>
          <form className="form-el" onSubmit={this.BankLogin}>
            <h1 className="header">Welcome Back!</h1>
            <div className="input-container">
              <label htmlFor="user" className="label">
                User ID
              </label>
              <input
                className="input"
                value={userId}
                onChange={this.onChangeUserId}
                placeholder="Enter User ID"
                type="text"
                id="user"
              />
            </div>
            <div className="input-container">
              <label htmlFor="pin" className="label">
                PIN
              </label>
              <input
                className="input"
                value={pin}
                onChange={this.onChangePin}
                placeholder="Enter Pin"
                type="password"
                id="pin"
              />
            </div>
            <button className="button" type="submit">
              Login
            </button>
            <div className="ct">
              {showErrorMsg === true && (
                <p className="error-msg"> {errorMsg} </p>
              )}
            </div>
          </form>
        </div>
      </div>
    )
  }
}
export default Login
