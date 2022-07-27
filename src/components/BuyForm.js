import React, { Component } from "react";
import web3 from 'web3'
import { Snackbar } from '@material-ui/core';

import CoinField from "./CoinField";
import Web3 from "web3";

const DEFAULT_TOKEN = "defaultToken";
class BuyForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      input: "0",
      output: "0",
      currentTokenFrom: "eth",
      currentTokenTo: DEFAULT_TOKEN,
      currentNetwork: props.currentNetwork,
      snackbar: {
        open: false,
        msg: ""
      }
    };

    //window.alert('current network');
    //if (props.currentNetwork) {
    //  console.log('currentNetwork6789098788=>', props.currentNetwork);
    //}
  };

  setSnackBar = ({ open, msg }) => {
    let snackbar = Object.assign({}, this.state.snackbar, {open, msg});
    this.setState({snackbar});
  }

  onSnackBarClose = () => {
    let snackbar = Object.assign({}, this.state.snackbar, {open: false});
    this.setState({snackbar});
  }


  async addToken(tokenAddress,tokenSymbol){
    const tokenDecimals = 18;
    // const tokenImage = 'http://placekitten.com/200/300';
    if(localStorage.getItem(tokenAddress)){
      return
    }

    try {
      // wasAdded is a boolean. Like any RPC method, an error may be thrown.

      window.web3 = new  Web3(window.ethereum)
      const wasAdded = await window.ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20', // Initially only supports ERC20, but eventually more!
          options: {
            address: tokenAddress, // The address that the token is at.
            symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
            decimals: tokenDecimals, // The number of decimals in the token
            // image: tokenImage, // A string url of the token logo
          },
        },
      });

      if (wasAdded) {
        console.log('Token Added');
        localStorage.setItem(tokenAddress,"")
      } else {
        console.log('Token Canceled');
      }
    } catch (error) {
      console.log(error);
    }
  }


  switchTokenFrom = (type) => {
    switch (type) {
      case "eth":
        this.setState({ currentTokenFrom: type });
        break;
      case "bnb":
        this.setState({ currentTokenFrom: type });
        break;
      default:
        break;
    }
  };

  switchTokenTo = (type,address,title,icon) => {
    switch (type) {
      case "eth":
        this.setState({ currentTokenTo: type });
        break;
      case "bnb":
        this.setState({ currentTokenTo: type });
        break;
      case "usdc":
        this.setState({ currentTokenTo: type });
        break;
      case "comp":
        this.setState({ currentTokenTo: type });
        break;
      case "dai":
        this.setState({ currentTokenTo: type });
        break;
      case "wbtc":
        this.setState({ currentTokenTo: type });
        break;
      case "uni":
        this.setState({ currentTokenTo: type });
        break;
      case "donate":
        this.setState({ currentTokenTo: type });
        break;
      default:
        break;
    }
    console.log("TOKEN SWITCH")
    this.addToken(address,title)
  };

  render() {
    return (
      <>
        <form
          className="mb-3"
          onSubmit={async (event) => {
            event.preventDefault();
            if (!this.props.isLoaded) {
              this.setSnackBar({ open: true, msg: "Please connect wallet" });

              return;
            }
            if (!this.props.isCurrentNetwork) {
              this.setSnackBar({ open: true, msg: "Please select correct network from dropdown or in metamask wallet" });

              return;
            }

            let etherAmount;
            etherAmount = this.state.input.toString();
            etherAmount = window.web3.utils.toWei(etherAmount, "Ether");

            if (this.state.currentTokenTo === DEFAULT_TOKEN) {
              this.setSnackBar({ open: true, msg: "Please select coin/token" });
            } else this.props.buyTokens(etherAmount, this.state.currentTokenTo);
          }}
        >
          <div className="input-group mb-4">
            <CoinField
              activeField={true}
              // onClick={() => setDialog1Open(true)}
              onChange={(e) => {
                this.setState({
                  input: e,
                  output: e * 100,
                });
              }}
              changeToken = {this.switchTokenFrom}
              from={true}
              // currentNetwork = {this.state.currentNetwork}
              currentToken = {this.props.currentNetwork}
              // currentToken = {this.state.currentTokenFrom}
              balancePrice={this.props.isLoaded ? window.web3.utils.fromWei(
                this.props.ethBalance,
                "Ether"
              ) : "0"}
              //balanceUSD={11.994}
            />
          </div>

          <div className="input-group mb-4">
            <CoinField
              value={this.state.output}
              activeField={false}
              from={false}
              changeToken = {this.switchTokenTo}
              currentToken = {this.state.currentTokenTo}
              currentNetwork = {this.props.currentNetwork}
              balancePrice={this.props.isLoaded ? window.web3.utils.fromWei(
                this.props.tokenBalance,
                "Ether"
              ) : "0"}
              //balanceUSD={11.994}
            />
          </div>
          {/* <div className="mb-5">
            <span className="float-left text-muted">Exchange Rate</span>
            <span className="float-right text-muted">1 ETH = 100 DApp</span>
          </div> */}
          {/* <button type="submit" className="btn btn-primary btn-block btn-lg">SWAP!</button> */}
          <button
            type="submit"
            id="swap-button"
            disabled=""
            className={"swap-btn"}
          >
            <div className="css-10ob8xa">SWAP!</div>
          </button>
        </form>

        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          open={ this.state.snackbar.open }
          onClose={ this.onSnackBarClose }
          message = { this.state.snackbar.msg }
        />
      </>
    );
  }
}

export default BuyForm;
