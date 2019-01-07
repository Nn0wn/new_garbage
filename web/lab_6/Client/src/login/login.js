import React, { Component } from 'react';
import { Card } from '../page/structural';
import '../style.css';

export class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user_chosen: ''
    }
    this.onUserInput = this.onUserInput.bind(this)
    this.onUserLogin = this.onUserLogin.bind(this)
  }
  onUserInput(e) {
    this.setState({
      user_chosen: e.target.value
    })
  }
  onUserLogin(e) {
    this.props.onLogin(this.state.user_chosen)
  }
  render() {
    return (
      <Card header='Login' footer='DEV'>
        <div>
          <label>Name:</label>
          <select className='w3-select w3-margin-bottom' defaultValue=''
            onChange={this.onUserInput}>
            <option value='' disabled>Choose broker</option>
            {this.props.market.brokers.map(
              function (broker, index) {
                return <option value={broker.name} key={broker.name}>{broker.name}</option>
              }
            )}
          </select>
          {this.state.user_chosen &&
            <button className='w3-button w3-theme-d2' onClick={this.onUserLogin}>Login</button>
          }
        </div>
      </Card>
    )
  }
}