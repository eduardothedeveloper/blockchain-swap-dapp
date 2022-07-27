import React, { Component } from 'react'
import BuyForm from './BuyForm'
import SellForm from './SellForm'

class Main extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentForm: 'buy'
    }
  }

  render() {
    let content
    if(this.state.currentForm === 'buy') {
      content = <BuyForm
        ethBalance={this.props.ethBalance}
        tokenBalance={this.props.tokenBalance}
        currentNetwork={this.props.currentNetwork}
        buyTokens={this.props.buyTokens}
        isLoaded={this.props.isLoaded}
        isCurrentNetwork={this.props.isCurrentNetwork}
      />
    } else {
      content = <SellForm
        ethBalance={this.props.ethBalance}
        tokenBalance={this.props.tokenBalance}
        sellTokens={this.props.sellTokens}
        isLoaded={this.props.isLoaded}
      />
    }

    return (
      <div id="content" className="mt-3">

        <div className="d-flex justify-content-between mb-3">
          <div
              className=""
              onClick={(event) => {
                this.setState({ currentForm: 'buy' })
              }}
            >
            
          </div>
          {/* <span className="text-muted">&lt; &nbsp; &gt;</span> */}
          {/* <button
              className="btn btn-light"
              onClick={(event) => {
                this.setState({ currentForm: 'sell' })
              }}
            >
            
          </button> */}
        </div>

        <div className="container-card card mb-4" >

          <div className="card-body">

            {content}
            

            {/* <div className="card-body">Testnet Beta! Use ETH Ropsten and BSC Testnet! To test dApp, send 2 transactions of the same request. As demand increases we will increase Lot logic proportionately.</div> */}
         
          </div>
          
        </div>
        <div style={{alignItems: "center", justifyContent: "center", marginLeft:75}}>Coming Soon! Click <a href="../tutorials.html">Here</a> For UseFul Tips And Tutorials</div>
      </div>
    );
  }
}

export default Main;
