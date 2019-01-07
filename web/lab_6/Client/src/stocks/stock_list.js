import React, { Component } from 'react';
import { Dynamic } from './dynamic'
import '../style.css'

//props: stocks, onStockClick(name)
export class StockList extends Component {
  onStockClick(stock, index) {
    this.props.onStockClick(stock)
  }
  render() {
    return (
      <table className='w3-table w3-border w3-bordered w3-striped'>
        <thead>
          <tr className='w3-theme-d5'>
            <th>Name</th>
            <th>Type</th>
            <th>Price</th>
            <th>Dynamic</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody>
          {this.props.market.stocks.map((stock, index) => {
            let rowClass = index % 2 == 0 ? 'w3-theme-l3 w3-hover-deep-orange' : 'w3-theme w3-hover-deep-orange'
            return (
              <tr className={rowClass} key={stock.name} onClick={this.onStockClick.bind(this, stock, index)}>
                <th>{stock.name}</th>
                <td>{stock.type}</td>
                <td>{stock.price}</td>
                <td>
                  <Dynamic stock={stock} />
                </td>
                <td>{stock.quantity_bought || stock.quantity}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    )
  }
}