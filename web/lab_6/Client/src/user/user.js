import React, { Component } from 'react';
import { BrokerInfo } from '../brokers/broker_info'
import { HalfWidth, Card } from '../page/structural'
import { StockList } from '../stocks/stock_list'
import { UserStockInfo } from './user_stock_info'
import '../style.css'

export class UserPage extends Component {
  constructor() {
    super();
    this.onStockClick = this.onStockClick.bind(this);
    this.state = {
      stock: null,
      show_left: true
    }
    this.onStockClick = this.onStockClick.bind(this);
    this.onPortfolioStockClick = this.onPortfolioStockClick.bind(this);
    this.onCloseStockInfo = this.onCloseStockInfo.bind(this);
  }
  componentWillMount(){
    this.props.socket.json.emit('connected', {'name': this.props.broker.name});
  }
  onStockClick(stock, index) {
    this.setState({
      stock: stock,
      show_left: true
    })
  }
  onPortfolioStockClick(stock, index) {
    this.setState({
      stock: stock,
      show_left: false
    })
  }
  onCloseStockInfo() {
    this.setState({
      stock: null
    })
  }
  render() {
    function renderStockList() {
      return (
        <Card header='Stock list'>
          <StockList market={this.props.market} onStockClick={this.onStockClick} />
        </Card>
      )
    }
    function renderBrokerInfo() {
      return (
        <Card header={'Broker: ' + this.props.broker.name}>
          <BrokerInfo broker={this.props.broker} market={this.props.market} onStockClick={this.onPortfolioStockClick} />
        </Card>
      )
    }
    function renderStockInfo() {
      return (
        <Card header={'Stock: ' + this.state.stock.name} onClose={this.onCloseStockInfo}>
          <UserStockInfo stock={this.state.stock} broker={this.props.broker}
            socket={this.props.socket} onClose={this.onCloseStockInfo} />
        </Card>
      )
    }
    let left_side;
    let right_side;
    if (!this.state.stock) {
      left_side = (renderBrokerInfo.bind(this))();
      right_side = (renderStockList.bind(this))();
    }
    else {
      if (this.state.show_left) {
        left_side = (renderStockInfo.bind(this))();
        right_side = (renderStockList.bind(this))();
      }
      else {
        left_side = (renderBrokerInfo.bind(this))();
        right_side = (renderStockInfo.bind(this))();
      }
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