import React, { Component } from 'react';
import $ from 'jquery';

import { Card, HalfWidth } from '../page/structural'
import { StockList } from '../stocks/stock_list'
import { StockInfo } from '../stocks/stock_info'
import { BrokerList } from '../brokers/broker_list'
import { BrokerInfo } from '../brokers/broker_info'
import { AdminControls } from './admin_controls'
import '../style.css'

export class AdminPage extends Component {
  constructor() {
    super();
    this.state = {
      stock: null,
      broker: null,
    }
    this.handleStockClick = this.handleStockClick.bind(this);
    this.handleBrokerClick = this.handleBrokerClick.bind(this);
    this.handleCloseInfo = this.handleCloseInfo.bind(this);
  }
  componentWillMount() {
    if (this.props.socket) {
      this.props.socket.json.emit("connected", { "name": 'Admin' });
    }
  }
  handleStockClick(stock) {
    this.setState({
      stock: stock
    })
  }
  handleBrokerClick(broker) {
    this.setState({
      broker: broker
    })
  }
  handleCloseInfo() {
    this.setState({
      stock: null,
      broker: null
    })
  }

  render() {
    function renderBrokerList() {
      return (
        <Card header='Broker list'>
          <BrokerList market={this.props.market} onBrokerClick={this.handleBrokerClick} />
        </Card>
      )
    }
    function renderStockList() {
      return (
        <Card header='Stock list'>
          <StockList market={this.props.market} onStockClick={this.handleStockClick} />
        </Card>
      )
    }
    function renderControls() {
      return (
        <Card header='Controls'>
          <AdminControls socket={this.props.socket} />
        </Card>
      )
    }
    function renderBrokerInfo() {
      return (
        <Card header={'Broker: ' + this.state.broker.name} onClose={this.handleCloseInfo}>
          <BrokerInfo broker={this.state.broker} market={this.props.market} />
        </Card>
      )
    }
    function renderStockInfo() {
      return (
        <Card header={'Stock: ' + this.state.stock.name} onClose={this.handleCloseInfo}>
          <StockInfo stock={this.state.stock} />
        </Card>
      )
    }
    let left_side;
    let right_side;
    if (this.state.broker) {
      left_side = (renderBrokerList.bind(this))();
      right_side = (renderBrokerInfo.bind(this))();
    }
    else if (this.state.stock) {
      left_side = (renderStockList.bind(this))();
      right_side = (renderStockInfo.bind(this))();
    }
    else {
      left_side = (renderStockList.bind(this))();
      right_side = (
        <div>
          {(renderControls.bind(this))()}
          {(renderBrokerList.bind(this))()}
        </div>
      );
    }
    return (
      <div className='w3-row'>
        <HalfWidth>
          {left_side}
        </HalfWidth>
        <HalfWidth>
          {right_side}
        </HalfWidth>
      </div>
    )
  }
}