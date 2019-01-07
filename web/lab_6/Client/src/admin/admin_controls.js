import React, { Component } from 'react';
import '../style.css'

export class AdminControls extends Component {
  constructor(props){
    super(props);
    if (props.socket == null){
      alert('Where is ur socket, dude?')
    }
    this.state = {
      interval: 10
    }
    this.handleStartMarket = this.handleStartMarket.bind(this);
    this.handleStopMarket = this.handleStopMarket.bind(this);
    this.handleResetMarket = this.handleResetMarket.bind(this);
    this.handleIntervalChange = this.handleIntervalChange.bind(this);
  }
  handleStartMarket() {
    this.props.socket.json.emit('start_market', {interval: this.state.interval});
  }
  handleStopMarket() {
    this.props.socket.json.emit('stop_market');
  }
  handleResetMarket() {
    this.props.socket.json.emit('reset_market');
  }
  handleIntervalChange(e) {
    this.setState({
      interval: parseInt(e.target.value)
    })
  }
  render() {
    const button_class = 'w3-button w3-bar-item w3-theme-d2 w3-margin-right w3-margin-bottom';
    return (
      <div>
        <label>Seconds for turn</label>
        <input type='number' className='w3-input' onChange={this.handleIntervalChange}
          value={this.state.interval} />
        <div className='w3-bar w3-margin-top'>
          <button className={button_class} onClick={this.handleStartMarket}>Start Market</button>
          <button className={button_class} onClick={this.handleStopMarket}>Stop Market</button>
          <button className={button_class} onClick={this.handleResetMarket}>Reset Market</button>
        </div>
      </div>
    )
  }
}