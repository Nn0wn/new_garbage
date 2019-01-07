import React, { Component } from 'react';
import '../style.css'

export class BrokerList extends Component {
  onBrokerClick(broker, index){
    this.props.onBrokerClick(broker);
  }
  render() {
    return (
      <table className='w3-table w3-border w3-bordered w3-striped'>
        <thead>
          <tr className='w3-theme-d5'>
            <th>Name</th>
            <th>Money</th>
            <th>Money in stocks</th>
            <th>Total money</th>
          </tr>
        </thead>
        <tbody>
        {this.props.market.brokers.map((broker, index) => {
          let rowClass = index % 2 == 0 ? 'w3-theme-l3 w3-hover-deep-orange' : 'w3-theme w3-hover-deep-orange'
          let nameClass= broker.online ? 'underline' : '';
          return (
            <tr className={rowClass} key={broker.name} onClick={this.onBrokerClick.bind(this, broker, index)}>
              <th className={nameClass}>{broker.name}</th>
              <td>{broker.money}</td>
              <td>{broker.money_in_stocks}</td>
              <td>{broker.total_money}</td>
            </tr>
          )
        })}
        </tbody>
      </table>
    )
  }
}