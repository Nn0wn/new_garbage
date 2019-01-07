import React, { Component } from 'react';
import { StockList } from '../stocks/stock_list'
import '../style.css'

export class Portfolio extends Component {

  constructor() {
    super();
    this.getBrokerStocks = this.getBrokerStocks.bind(this);
    this.onStockClick = this.onStockClick.bind(this);
  }

  getBrokerStocks() {
    let res = []
    this.props.broker.stocks.forEach((stock) => {
      this.props.market.stocks.forEach((market_stock) => {
        if (stock.name === market_stock.name) {
          let stock_in_market = JSON.parse(JSON.stringify(market_stock))
          stock_in_market.quantity_bought = stock.quantity;
          res.push(stock_in_market);
        }
      })
    });
    return res;
  }

  onStockClick(stock, index){
    if (this.props.onStockClick){
      this.props.onStockClick(stock, index);
    }
  }

  render() {
    let portfolio = this.getBrokerStocks();
    let table; 
    if (portfolio.length > 0){
      table = <StockList market={{ stocks: portfolio }} onStockClick={this.onStockClick} />
    }
    else{
      table = 'No stocks'
    }
    return (
      <div>
        <label>Portfolio:</label>
        {table}
      </div>
    )
  }
}