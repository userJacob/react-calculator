import React from 'react';
import './stylesheet.css';

class App extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div id="app">
        <Calculator />
      </div>
    )
  }
}

class Calculator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      display: '0',
      history: '',
      fullHistory: [],
      preVal: '',
      histHeight: '40px'
    };
    this.handleExpand = this.handleExpand.bind(this);
    this.handleNumber = this.handleNumber.bind(this);
    this.handleOperator = this.handleOperator.bind(this);
    this.handleDecimal = this.handleDecimal.bind(this);
    this.evaluate = this.evaluate.bind(this);
    this.handleClear = this.handleClear.bind(this);
    this.maxDigits = this.maxDigits.bind(this);
    this.copy = this.copy.bind(this);
    this.backSpace = this.backSpace.bind(this);
  }
  copy(e) {
    let copied = e.target.textContent;
    this.setState({
      history: copied,
      display: /[x+/-]/g.test(copied) ? copied.match(/[0-9]{1,}$/) : copied
    });
  }
  handleExpand(e) {
    this.setState({
      histHeight: this.state.histHeight === '40px'
                  ? '450px' : '40px'
    });
    console.log(this.state.histHeight);
  }
  maxDigits() {
    this.setState({
      preVal: this.state.display,
      display: "I CAN'T TAKE THIS"
    });
    setTimeout(() => this.setState({
      display: this.state.preVal
    }), 1000);
  }
  handleNumber(e) {
    if (this.state.display.length > 21) {
      return this.maxDigits();
    }
    if (this.state.display != "I CAN'T TAKE THIS") {
      this.setState({
        preVal: this.state.display,
        history: /\./.test(this.state.display)
                 ? this.state.history + e.target.value
                 : /[0-9]/.test(e.target.value)
                 && this.state.history == '0'
                 ? e.target.value
                 : /[x+-/]0$/.test(this.state.history)
                 && e.target.value == '0'
                 ? this.state.history
                 : /(?<=[x+-/])0$/.test(this.state.history)
                 ? this.state.history.slice(0, -1) + e.target.value
                 : this.state.history + e.target.value,
        display: this.state.display == '0'
                 || /[x/+-]/.test(this.state.display)
                 ? e.target.value
                 : this.state.display + e.target.value
      })
    }
  }
  handleOperator(e) {
    if (this.state.display.length > 21) {
      return this.maxDigits();
    }
    if (this.state.display != "I CAN'T TAKE THIS") {
      this.setState({
        preVal: this.state.display
      })
      if (this.state.history.length == 0 && e.target.value != '-') {
        return this.maxDigits();
      } else if (!/[x+-/]$/.test(this.state.history)) {
        this.setState({
        display: e.target.value,
        history: this.state.history + e.target.value
        });
      } else if (e.target.value == '-' && /[x/]$/.test(this.state.history)) {
        this.setState({
          display: e.target.value,
          history: this.state.history + e.target.value
        });
      } else if (e.target.value == this.state.display) {
        this.setState({
          display: e.target.value,
          history: this.state.history
        })
      } else if (/[+x/]-$/.test(this.state.history)) {
        this.setState({
          display: e.target.value,
          history: this.state.history.slice(0, -2) + e.target.value
        });
      } else {
        this.setState({
          display: e.target.value,
          history: this.state.history.slice(0, -1) + e.target.value
        });
      }
    }
  }
  handleDecimal(e) {
    if (this.state.display.length > 21) {
      return this.maxDigits();
    }
    if (this.state.display != "I CAN'T TAKE THIS") {
      if (!(/\./g).test(this.state.display)) {
        this.setState({
          preVal: this.state.display,
          display: /[0-9]/.test(this.state.display)
                   ? this.state.display + e.target.value
                   : '0' + e.target.value,
          history: this.state.history + e.target.value
        });
      } else {
        this.setState({
          history: this.state.history
        });
      }
    }
  }
  handleClear(e) {
    if (this.state.history == '' && this.state.fullHistory.length != 0) {
      if (window.confirm("Do you wish to clear all history?")) {
        this.setState({
          fullHistory: []
        });
      }
    }
    if (this.state.display != "I CAN'T TAKE THIS") {
      this.setState({
        display: '0',
        history: '',
        preVal: ''
      });
    }
  }
  backSpace(e) {
    if (this.state.display != "I CAN'T TAKE THIS") {
      let endOfHistory = this.state.history.slice(0, -1)
      let hasOperator = /[x+-/]/.test(endOfHistory);
      let endsWithOperator = /[x+-/]$/.test(endOfHistory);
      this.setState({
        display: this.state.history.length === 1 ? '0'
               : /[0-9]+\.$/.test(endOfHistory) ? endOfHistory.match(/[0-9]+\.$/)
               : this.state.display.length === 1
                  && this.state.history.length > 1
                  && endsWithOperator
                  ? this.state.history.slice(-2, -1)
               : !hasOperator
                  && this.state.display.length === 1
                  && this.state.history.length > 1
                  ? endOfHistory
               : /[0-9]+\.[0-9]+$/.test(endOfHistory) ? endOfHistory.match(/[0-9]+\.[0-9]+$/)
               : hasOperator ? endOfHistory.match(/(?<=[x+-/])[0-9]+$/)
               : this.state.display.slice(0, -1),
        history: endOfHistory
      });
    }
  }
  evaluate(e) {
    var formula = this.state.history;
    if (/[x+-/.]$/.test(formula)) {
      formula = formula.slice(0, -1);
    }
    var noX = formula.replaceAll('x', '*');
    var solution = Math.round(eval(noX) * 1000000000000) / 1000000000000;
    this.setState({
	    display: String(solution),
      history: String(solution),
      fullHistory: [solution, this.state.history, ...this.state.fullHistory]
    });
  }
  render() {
    var historical = this.state.fullHistory.map(x =>
        <div className="piece-of-history"
        onClick={this.copy}>{x}</div>);
    return (
      <div id="calculator">
        <div id="full-history" style={{height: this.state.histHeight}}>{historical}</div>
        <div id="display-box">
          <div id="history">
            {this.state.history}
          </div>
          <div id="display">
            {this.state.display}
          </div>
        </div>
        <Buttons
          handleNumber={this.handleNumber}
          handleClear={this.handleClear}
          backSpace={this.backSpace}
          handleOperator={this.handleOperator}
          handleDecimal={this.handleDecimal}
          evaluate={this.evaluate}
          />
      </div>
    )
  }
}

class Buttons extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return(
      <div id="buttons">
        <button id="clear" className="wide" value="AC" onClick={this.props.handleClear}>AC</button>
        <button id="backspace" className="backspace" value="C" onClick={this.props.backSpace}>C</button>
        <button id="divide" className="operator" value="/" onClick={this.props.handleOperator}>/</button>
        <button id="multiply" className="operator" value="x" onClick={this.props.handleOperator}>x</button>
        <button id="seven" className="normie" value="7" onClick={this.props.handleNumber}>7</button>
        <button id="eight" className="normie" value="8" onClick={this.props.handleNumber}>8</button>
        <button id="nine" className="normie" value="9" onClick={this.props.handleNumber}>9</button>
        <button id="subtract" className="operator" value="-" onClick={this.props.handleOperator}>-</button>
        <button id="four" className="normie" value="4" onClick={this.props.handleNumber}>4</button>
        <button id="five" className="normie" value="5" onClick={this.props.handleNumber}>5</button>
        <button id="six" className="normie" value="6" onClick={this.props.handleNumber}>6</button>
        <button id="add" className="operator" value="+" onClick={this.props.handleOperator}>+</button>
        <button id="one" className="normie" value="1" onClick={this.props.handleNumber}>1</button>
        <button id="two" className="normie" value="2" onClick={this.props.handleNumber}>2</button>
        <button id="three" className="normie" value="3" onClick={this.props.handleNumber}>3</button>
        <button id="equals" className="lol" value="=" onClick={this.props.evaluate}>=</button>
        <button id="zero" className="wide" value="0" onClick={this.props.handleNumber}>0</button>
        <button id="decimal" className="normie" value="." onClick={this.props.handleDecimal}>.</button>
      </div>
    )
  }
}


export default App;
