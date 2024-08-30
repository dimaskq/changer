import React, { useEffect, useReducer, useState } from 'react';
import { Block } from './Block';
import './index.scss';

function App() {
  const [ fromCurrency, setFromCurrency ] = React.useState("UAH");
    const [ toCurrency, setToCurrency ] = React.useState("USD");
    const [ fromPrice, setFromPrice ] = React.useState(0);
    const [ toPrice, setToPrice ] = React.useState(1);

    const [ rates, setRates ] = React.useState({});

    React.useEffect(() =>
    {
        fetch("https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json")
            .then((res) => res.json())
            .then((json) =>
            {
                setRates(json.reduce((acc, data) => {
                    acc[ data.cc ] = data.rate;
                    return acc;
                }, {}));
                onChangeToPrice(1);
            })
            .catch((err) =>
            {
                console.warn(err);
                alert("Не удалось получить информацию");
            });
    }, [toCurrency]);
    rates["UAH"] = 1

    const onChangeFromPrice = (value) =>
    {
        const price = value / rates[ toCurrency ];
        const result = price * rates[ fromCurrency ];

        setFromPrice(value);
        setToPrice(result);
    };

    const onChangeToPrice = (value) =>
    {
        const price = value / rates[ fromCurrency ];
        const result = price * rates[ toCurrency ];
        setToPrice(value);
        setFromPrice(result);
    };
  
    useEffect(() => {
        onChangeFromPrice(fromPrice)
    }, [fromCurrency])
    useEffect(() => {
        onChangeToPrice(toPrice)
    }, [toCurrency])
  return (
      <div className="App">
        <Block value={fromPrice} currency={fromCurrency} onChangeCurrency={setFromCurrency} onChangeValue={onChangeFromPrice}/>
        <Block value={toPrice} currency={toCurrency} onChangeCurrency={setToCurrency} onChangeValue={onChangeToPrice}/>
      </div>
  );
}

export default App;
