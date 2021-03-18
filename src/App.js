import React, { Component } from 'react';
import rp from 'request-promise';
import moment from 'moment';
import './App.css';
import LineChart from './Components/LineChart';
import ToolTip from './Components/ToolTip';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fetchingData: true,
      data: null,
      hoverLoc: null,
      activePoint: null
    }
  }
  handleChartHover(hoverLoc, activePoint){
    this.setState({
      hoverLoc: hoverLoc,
      activePoint: activePoint
    })
  }
  componentDidMount(){
    const getData = async () => {
      const historicalPrices = {
        uri: `http://api.coindesk.com/v1/bpi/historical/close.json`,
        json: true
      }
      try {
        const bitcoinData = await rp(historicalPrices);
        const sortedData = [];
        let count = 0;
        for (let date in bitcoinData.bpi){
          sortedData.push({
            d: moment(date).format('MMM DD'),
            p: bitcoinData.bpi[date].toLocaleString('us-EN',{ style: 'currency', currency: 'USD' }),
            x: count, //previous days
            y: bitcoinData.bpi[date] // numerical price
          });
          count++;
        }
        this.setState({
          data: sortedData,
          fetchingData: false
        })
      }
      catch(e){
        console.log(e);
      }
    }
    getData();
  }
  render() {
    return (

      <div className='container'>
        <div className='row'>
          <div className='popup'>
            {this.state.hoverLoc ? <ToolTip hoverLoc={this.state.hoverLoc} activePoint={this.state.activePoint}/> : null}
          </div>
        </div>
        <div className='row'>
          <div className='chart'>
            { !this.state.fetchingData ?
              <LineChart data={this.state.data} onChartHover={ (a,b) => this.handleChartHover(a,b) }/>
              : null }
          </div>
        </div>
      </div>

    );
  }
}

export default App;
