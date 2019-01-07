import React, { Component } from 'react';
import '../style.css';

export class Header extends Component {
  constructor() {
    super()
  }
  render() {
    const button_class = 'w3-button w3-theme-d2 w3-margin-left'
    return (
      <div className='w3-top'>
        <div className='w3-bar w3-theme-d1'>
          </div>
          <h3 className='w3-bar-item header'>Stock market</h3>
          <div className='w3-bar-item w3-right'>
            {this.props.loggedIn && this.props.isConnected &&
              <button className={button_class}
                onClick={this.props.onLogout}>
                Logout
              </button>
            }
            {!this.props.loggedIn && this.props.isConnected &&
              <button className={button_class}
                onClick={this.props.onAdmin}>
                Admin page
              </button>
            }
            {this.props.isConnected &&
              <button className={button_class}
                onClick={this.props.onDisconnect}>
                Disconnect
              </button>
            }
          </div>
        </div>
    )
  }
}