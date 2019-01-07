import React, { Component } from 'react';
import $ from 'jquery';
import { render } from 'react-dom';
import { Login } from './login/login'
import { LoadingPage } from './login/loading';
import { AddressInput } from './login/address'
import { ErrorPage } from './login/error';
import { Header } from './page/header'
import { getMockMarket } from './mock_market';
import { MainContent } from './page/structural'
import { UserPage } from './user/user'
import { AdminPage } from './admin/admin'
import { BrowserRouter } from 'react-router-dom';

import './style.css';
import * as io from 'socket.io-client'
import * as ReactDOM from "react-dom";

class App extends Component {
  constructor() {
    super();
    this.state = {
      market: null,
      isLoading: true,
      user_name: '',
      address: ''
    }
    this.socket = null;
    this.handleLogin = this.handleLogin.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.handleAdmin = this.handleAdmin.bind(this);
    this.getInfo = this.getInfo.bind(this);
    this.getMockInfo = this.getMockInfo.bind(this);
    this.findBrokerByName = this.findBrokerByName.bind(this);
    this.handleAddress = this.handleAddress.bind(this);
    this.handleDisconnect = this.handleDisconnect.bind(this);
    this.setUpSocket = this.setUpSocket.bind(this);
    this.updateInfo = this.updateInfo.bind(this);
  }

  componentWillMount() {
    this.setState({ isLoading: false });
    document.body.className = 'w3-theme-d5'
  }

  getInfo(address) {
    $.ajax({
      url: address + '/market/',
      method: 'GET',
      crossDomain: true,
    }).then(function (market) {
      let _market = JSON.parse(market);
      this.setState({
        market: _market,
        isLoading: false
      });
      this.setUpSocket(address);
    }.bind(this)
    ).catch((err) => {
      if (typeof (err) == 'string')
        alert(err);
      else
        alert(JSON.stringify(err));
      this.setState({
        isLoading: false
      })
    })
  }

  updateInfo() {
    $.ajax({
      url: this.state.address + '/market/',
      method: 'GET',
      crossDomain: true,
    }).then(function(market) {
      let _market = JSON.parse(market);
      this.setState({
        market: _market,
      });
    }.bind(this)
    ).catch((err)=>{
      if (typeof (err) == 'string')
        alert(err);
      else
        alert(JSON.stringify(err));
    })
  }

  getMockInfo() {
    setTimeout(function () {
      this.setState({
        market: getMockMarket(),
        isLoading: false
      })
    }.bind(this), 1000)
  }

  setUpSocket(address) {
    this.socket = io.connect(address);
    
    this.socket.on('market_update', ()=>{
      this.updateInfo();
    })
  }

  findBrokerByName(name) {
    let _broker;
    this.state.market.brokers.forEach((broker) => {
      if (broker.name === name)
        _broker = broker;
    });
    return _broker;
  }

  handleLogin(new_login) {
    this.setState({
      user_name: new_login
    })
  }

  handleLogout() {
    this.setState({
      user_name: ''
    })
  }

  handleAdmin() {
    this.setState({
      user_name: '%_ADMIN_%'
    })
  }

  handleAddress(address) {
    this.setState({
      address: address,
      isLoading: true
    })
    if (address == '%_MOCK_%') {
      this.getMockInfo();
    }
    else {
      this.getInfo(address);
    }
  }

  handleDisconnect() {
    this.setState({
      market: null,
      isLoading: false,
      user_name: '',
      address: ''
    })
    this.socket.disconnect();
  }

  render() {
    let content;
    if (this.state.address === '') {
      content = <AddressInput onAddress={this.handleAddress} />
    }
    else if (this.state.isLoading) {
      content = <LoadingPage />
    }
    else if (!this.state.market) {
      content = <ErrorPage />
    }
    else if (this.state.user_name) {
      if (this.state.user_name != '%_ADMIN_%')
        content = <UserPage market={this.state.market} broker={this.findBrokerByName(this.state.user_name)} socket={this.socket} />
      else
        content = <AdminPage market={this.state.market} socket={this.socket} />
    }
    else {
      content = <Login market={this.state.market} onLogin={this.handleLogin} />
    }
    return (
      <div>
        <Header loggedIn={this.state.user_name != ''} isConnected={this.state.market != null}
          onLogout={this.handleLogout} onAdmin={this.handleAdmin} onDisconnect={this.handleDisconnect} />
        <MainContent>
          {content}
        </MainContent>
      </div>
    );
  }
}

render(<App />, document.getElementById('root'));
