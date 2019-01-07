import React, { Component } from 'react';
import { StockInfo } from '../stocks/stock_info'
import '../style.css'

export class UserStockInfo extends Component {

  constructor() {
    super();
    this.handleBuy = this.handleBuy.bind(this);
    this.handleSell = this.handleSell.bind(this);
    this.handleQuantityChange = this.handleQuantityChange.bind(this);
    this.state = {
      quantity: 0
    }
  }

  handleBuy() {
    this.props.socket.json.emit('buy_deal', {
      'broker_name': this.props.broker.name,
      'stock_name': this.props.stock.name,
      'quantity': this.state.quantity
    })
    this.props.onClose();
  }

  handleSell() {
    this.props.socket.json.emit('sell_deal', {
      'broker_name': this.props.broker.name,
      'stock_name': this.props.stock.name,
      'quantity': this.state.quantity
    })
    this.props.onClose();
  }

  handleQuantityChange(e) {
    this.setState({
      quantity: e.target.value
    })
  }

  render() {
    const input_class = 'w3-input w3-white w3-round';
    const button_class = 'w3-button w3-bar-item w3-theme-d2 w3-margin-right';
    return (
      <div>
        <StockInfo stock={this.props.stock} />
        <label>Bought</label>
        <input className={input_class} value={this.props.stock.quantity_bought || 0} />
        <label>Quantity to buy/sell</label>
        <input className={input_class} value={this.state.quantity || 0}
          onChange={this.handleQuantityChange} />
        <div className='w3-bar w3-margin-top'>
          <button className={button_class} onClick={this.handleBuy}>Buy</button>
          <button className={button_class} onClick={this.handleSell}>Sell</button>
        </div>
      </div>
    )
  }
}