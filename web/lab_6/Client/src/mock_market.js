export function getMockMarket() {
  return {
    "stocks": [
      {
        "name": "LOL",
        "type": "Static",
        "start_price": 4235,
        "dynamic": 0,
        "price": 4235,
        "available_quantity": 1000,
        "quantity": 1000,
        "params": [
          {
            "name": "value",
            "text": "Value",
            "value": 4235
          }
        ]
      },
      {
        "name": "QWE",
        "type": "Binomial",
        "start_price": 1591,
        "dynamic": 0,
        "price": 1591,
        "available_quantity": 1000,
        "quantity": 1000,
        "params": [
          {
            "name": "variation",
            "text": "Variation",
            "value": 30
          }
        ]
      },
      {
        "name": "LRG",
        "type": "Binomial",
        "start_price": 33124,
        "dynamic": 0,
        "price": 33124,
        "available_quantity": 1000,
        "quantity": 1000,
        "params": [
          {
            "name": "variation",
            "text": "Variation",
            "value": 1000
          }
        ]
      },
      {
        "name": "CRZY",
        "type": "Uniform",
        "start_price": 500,
        "dynamic": 0,
        "price": 500,
        "available_quantity": 1000,
        "quantity": 1000,
        "params": [
          {
            "name": "first_price",
            "text": "First price",
            "value": 250
          },
          {
            "name": "second_price",
            "text": "Second price",
            "value": 750
          }
        ]
      },
      {
        "name": "BRN",
        "type": "Bernoulli",
        "start_price": 2500,
        "dynamic": 0,
        "price": 2500,
        "available_quantity": 1000,
        "quantity": 1000,
        "params": [
          {
            "name": "first_price",
            "text": "First price",
            "value": 2500
          },
          {
            "name": "second_price",
            "text": "Second price",
            "value": 5000
          }
        ]
      },
      {
        "name": "BNML",
        "type": "Binomial",
        "start_price": 25000,
        "dynamic": 0,
        "price": 25000,
        "available_quantity": 1000,
        "quantity": 1000,
        "params": [
          {
            "name": "variation",
            "text": "Variation",
            "value": 1500
          }
        ]
      },
      {
        "name": "UNTD",
        "type": "Binomial",
        "start_price": 5000,
        "dynamic": 0,
        "price": 5000,
        "available_quantity": 1000,
        "quantity": 1000,
        "params": [
          {
            "name": "variation",
            "text": "Variation",
            "value": 500
          }
        ]
      },
      {
        "name": "UFRM",
        "type": "Uniform",
        "start_price": 15000,
        "dynamic": 0,
        "price": 15000,
        "available_quantity": 1000,
        "quantity": 1000,
        "params": [
          {
            "name": "first_price",
            "text": "First price",
            "value": 10000
          },
          {
            "name": "second_price",
            "text": "Second price",
            "value": 20000
          }
        ]
      },
      {
        "name": "DHRD",
        "type": "Bernoulli",
        "start_price": 1000,
        "dynamic": 0,
        "price": 1000,
        "available_quantity": 1000,
        "quantity": 1000,
        "params": [
          {
            "name": "first_price",
            "text": "First price",
            "value": 1000
          },
          {
            "name": "second_price",
            "text": "Second price",
            "value": 2000
          }
        ]
      },
      {
        "name": "WRD",
        "type": "Uniform",
        "start_price": 1000,
        "dynamic": 0,
        "price": 1000,
        "available_quantity": 1000,
        "quantity": 1000,
        "params": [
          {
            "name": "first_price",
            "text": "First price",
            "value": 500
          },
          {
            "name": "second_price",
            "text": "Second price",
            "value": 1500
          }
        ]
      },
      {
        "name": "FCKD",
        "type": "Static",
        "start_price": 213,
        "dynamic": 0,
        "price": 213,
        "available_quantity": 1000,
        "quantity": 1000,
        "params": [
          {
            "name": "value",
            "text": "Value",
            "value": 213
          }
        ]
      }
    ],
    "brokers": [
      {
        "name": "Paul",
        "type": "Afk",
        "money": 1000,
        "money_in_stocks": 42350,
        "total_money": 43350,
        "start_money": 43350,
        "stocks": [
          {
            "name": "LOL",
            "quantity": 10
          }
        ]
      },
      {
        "name": "Ivan",
        "type": "Afk",
        "money": 1500,
        "money_in_stocks": 0,
        "total_money": 1500,
        "start_money": 1500,
        "stocks": []
      },
      {
        "name": "George",
        "type": "Afk",
        "money": 2000,
        "money_in_stocks": 0,
        "total_money": 2000,
        "start_money": 2000,
        "stocks": []
      },
      {
        "name": "Abraham",
        "type": "Afk",
        "money": 3000,
        "money_in_stocks": 0,
        "total_money": 3000,
        "start_money": 3000,
        "stocks": []
      }
    ]
  }
}