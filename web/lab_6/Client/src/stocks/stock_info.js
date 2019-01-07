import React, { Component } from 'react';
import { Dynamic, LargeDynamic } from './dynamic';
import '../style.css'

export class StockInfo extends Component {
  render() {
    const input_class = 'w3-input w3-white w3-round';
    return (
      <div>
        <LargeDynamic stock={this.props.stock} />
        <label>Name</label>
        <input className={input_class} disabled value={this.props.stock.name} />
        <label>Type</label>
        <input className={input_class} disabled value={this.props.stock.type} />
        <label>Quantity</label>
        <input className={input_class} disabled value={this.props.stock.quantity} />
      </div>
    )
  }
}