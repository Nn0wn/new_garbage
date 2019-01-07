import React, { Component } from 'react';
import '../style.css'

function getStockPercentDynamicText(stock) {
  if (stock.dynamic > 0) {
    return `+${Math.trunc(stock.dynamic / stock.price * 100)}%`;
  }
  return `${Math.trunc(stock.dynamic / stock.price * 100)}%`;
}

function getStockDynamicText(stock) {
  if (stock.dynamic > 0) {
    return `+${stock.dynamic}`;
  }
  return `${stock.dynamic}`;
}

export function Dynamic(props) {
  return (
    <div>
      {getStockDynamicText(props.stock)} {'\u00A0'}
      {getStockPercentDynamicText(props.stock)}
    </div>
  )
}

export function LargeDynamic(props) {
  return (
    <div className='price_container'>
      <span className='price_text'>
        {props.stock.price} {'\u00A0'}
      </span>
      <span className='price_dynamic_text'>
        {getStockDynamicText(props.stock)} {'\u00A0'}
        {getStockPercentDynamicText(props.stock)}
      </span>
    </div>
  )
}