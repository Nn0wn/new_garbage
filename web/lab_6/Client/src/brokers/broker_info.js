import React, { Component } from 'react';
import { Portfolio } from './portfolio';
import '../style.css';

export class BrokerInfo extends Component {
  constructor(){
    super();
    this.onStockClick = this.onStockClick.bind(this);
  }

  onStockClick(stock, index){
    if (this.props.onStockClick){
      this.props.onStockClick(stock, index);
    }
  }

  render() {
    const input_class = 'w3-input w3-white w3-round';
    return (
      <div>
        <label>Name</label>
        <input className={input_class} value={this.props.broker.name} disabled />
        <label>Money</label>
        <input className={input_class} value={this.props.broker.money} disabled />
        <label>Money in stocks</label>
        <input className={input_class} value={this.props.broker.money_in_stocks} disabled />
        <label>Total money</label>
        <input className={input_class} value={this.props.broker.total_money} disabled />
        <label>Start money</label>
        <input className={input_class} value={this.props.broker.start_money} disabled />
        <Portfolio broker={this.props.broker} market={this.props.market} onStockClick={this.onStockClick} />
      </div>
    )
  }
}