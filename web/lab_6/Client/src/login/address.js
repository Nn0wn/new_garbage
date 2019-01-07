import React, { Component } from 'react';
import { Card } from '../page/structural';
import '../style.css';

export class AddressInput extends Component {
  constructor(props) {
    super(props);
    this.onAddressInput = this.onAddressInput.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.onMockAddress = this.onMockAddress.bind(this);
    this.state = {
      address: 'http://localhost:3000'
    }
  }

  onAddressInput() {
    this.props.onAddress(this.state.address);
  }

  onMockAddress() {
    this.props.onAddress('%_MOCK_%');
  }

  handleChange(e) {
    this.setState({
      address: e.target.value
    })
    console.log(e.target.value)
  }

  render() {
    const button_class = 'w3-button w3-bar-item w3-theme-d2 w3-margin-right';
    return (
      <Card header='Connect' footer='DEV'>
        <div>
          <label>Enter server address:</label>
          <input className='w3-input w3-margin-bottom' onChange={this.handleChange} value={this.state.address} />
          <div className='w3-bar'>
            {this.state.address != '' &&
              <button className={button_class} onClick={this.onAddressInput}>Enter</button>
            }
          </div>
        </div>
      </Card>
    )
  }
}