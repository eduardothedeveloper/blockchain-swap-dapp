import React, { Component } from "react";
import Web3 from "web3";
//import Web3Modal from 'web3modal';
import TokenEth from "../build/TokenEth.json";
import BridgeEth from "../build/BridgeEth.json";
import TokenBsc from "../build/TokenBsc.json";
import BridgeBsc from "../build/BridgeBsc.json";
import Navbar from "./Navbar";
import Main from "./Main";
import "./App.css";
import Moralis from "moralis";

import { Snackbar } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
  return <MuiAlert {...props} />;
}

function transactionUrl({ network, transactionHash }) {
  if (network === 'eth')
    return `https://ropsten.etherscan.io/tx/${ transactionHash }`;
  else if (network === 'bnb')
    return `https://testnet.bscscan.com/tx/${ transactionHash }`;

  return '';
}

class App extends Component {
  async componentWillMount() {
    /*if (this.state.isWalletConnected) {
      await this.loadWeb3();
      await this.loadBlockchaindata();
    }*/
  }


  loadBlockchaindata = async (type = "eth") => {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();

    this.setState({ account: accounts[0] });

    const ethBalance = await web3.eth.getBalance(this.state.account);
    this.setState({ ethBalance: ethBalance });
    //console.log(this.state.ethBalance)

    const networkId = await web3.eth.net.getId();

    let Bridge;
    let TokenI;

    //short term switch network here by changing to BridgeBsc and TokenBsc
    if (type === "eth") {
      Bridge = BridgeEth;
      TokenI = TokenEth;
      this.setState({ currentNetwork: type });
    }
    if (type === "bnb") {
      Bridge = BridgeBsc;
      TokenI = TokenBsc;
      this.setState({ currentNetwork: type });
    }
    // window.alert(networkId)
    const tokenData = TokenI.networks[networkId];
    if (tokenData) {
      const token = new web3.eth.Contract(TokenI.abi, tokenData.address);


      this.setState({ token });
      let tokenBalance = await token.methods
        .balanceOf(this.state.account)
        .call();
      console.log("tokenBalance123", tokenBalance.toString());
      this.setState({ tokenBalance: tokenBalance.toString() });
    } else {
      //window.alert("Token contract not deployed to detected network, Please switch network in Metamask first then select desired network");

    }

    const ethSwapData = Bridge.networks[networkId];
    if (ethSwapData) {
      const ethSwap = new web3.eth.Contract(Bridge.abi, ethSwapData.address);
      this.setState({ ethSwap, isCurrentNetwork: true });
    } else {
      this.setState({ isCurrentNetwork: false });
      //window.alert("Token contract not deployed to detected network, Please switch network in Metamask.");
      // this.setSnackBar({
      //   open: true,
      //   //msg: `Transaction: ${ receipt.transactionHash } \n Request Address: ${ reqAddress }`     rel="noopener noreferrer"
      //   msg: "Wrong Network. Select correct network in dropdown or open metamask an change network.",
      //   type: "error"
      // });

        if(window.ethereum) {
            window.web3 = new  Web3(window.ethereum)
            window.ethereum.request({method: 'eth_requestAccounts'})
            window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [{chainId: '0x61',
                    chainName: "BSC Testnet",
                    nativeCurrency: {
                        name: "BSC",
                        symbol: "BSC",
                        decimals: 18
                    },
                    rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545'],     blockExplorerUrls: ['https://explorer.binance.org/smart-testnet']
                }]
            })
        }

    }

    this.setState({ isLoaded: true });
  }

  switchNetwork = (type) => {

    switch (type) {
      case "eth":
        this.loadBlockchaindata("eth");
        break;
      case "bnb":
        this.loadBlockchaindata("bnb");
        break;
      default:
        break;
    }
  };

  loadWeb3 = async () => {
    // Modern dapp browsers...
    if (window.ethereum) {
      console.log("here");
      await window.ethereum.enable();
      //await window.ethereum.request({ method: 'eth_requestAccounts' });
      window.web3 = new Web3(window.ethereum);
      //window.web3 = new Web3(provider);
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
      //window.web3 = new Web3(provider);
    }
    // Non-dapp browsers...
    else {
      window.alert(
        "Please connect your Metamask wallet with the Metamask extension in your browser and select the network you want to swap"
      );
    }
  }

   buyTokens = async (etherAmount, currentTokenTo) => {
    this.setState({ isLoaded: true });

    console.log('currentTokenFrom', this.state.currentNetwork);
    console.log('currentTokenTo', currentTokenTo);

    const serverUrl = "https://ov4tpe0rq.usemoralis.com:2053/server"; //Server url from moralis.io
    const appId = "tMpM28PtynOHXwVEoyrrYuwIKTJr8sUQaYyhT"; // Application id from moralis.io

    let fromToken = this.state.currentNetwork;
    let toToken = currentTokenTo;

    Moralis.start({ serverUrl, appId });

    let reqAddress = null;
    let reqType = null;
    let sendPe = null;
    let sendPb = null;

    if (fromToken === "eth"  ) {
      reqAddress = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
      reqType = 1;
    } else if (fromToken === "bnb" && toToken === "eth") {
      reqAddress = '0x37a04FB048FB1e4daECe8a3EbB97A3225eB5F2e7'
      reqType = 1;
    } else if ((fromToken === "eth" && toToken === "usdc") || (fromToken === "bnb" && toToken === "usdc") ) {
      reqAddress = '0x07865c6E87B9F70255377e024ace6630C1Eaa37F'
      if (fromToken === "eth"){
        reqType = 0;
      } else {
        reqType = 1;
      }
    } else if ((fromToken === "eth" && toToken === "comp") || (fromToken === "bnb" && toToken === "comp") ) {
      reqAddress = '0xf76d4a441e4ba86a923ce32b89aff89dbccaa075'
      if (fromToken === "eth"){
        reqType = 0;
      } else {
        reqType = 1;
      }
    }
    else if ((fromToken === "eth" && toToken === "wbtc") || (fromToken === "bnb" && toToken === "wbtc") ) {
      reqAddress = '0x442Be68395613bDCD19778e761f03261ec46C06D'
      if (fromToken === "eth"){
        reqType = 0;
      } else {
        reqType = 1;
      }
    }
    else if ((fromToken === "eth" && toToken === "dai") || (fromToken === "bnb" && toToken === "dai") ) {
      reqAddress = '0x31f42841c2db5173425b5223809cf3a38fede360'
      if (fromToken === "eth"){
        reqType = 0;
      } else {
        reqType = 1;
      }
    } else if ((fromToken === "eth" && toToken === "uni") || (fromToken === "bnb" && toToken === "uni") ) {
      reqAddress = '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984'
      if (fromToken === "eth"){
        reqType = 0;
      } else {
        reqType = 1;
      }
    } else if ((fromToken === "eth" && toToken === "donate") || (fromToken === "bnb" && toToken === "donate")) {
      reqAddress = '0x37a04FB048FB1e4daECe8a3EbB97A3225eB5F2e7'
      reqType = 2;

    } else {
      console.log('Default or Exception!');
    }
    //we can call current block, then subtract 201,600 for block 7 days ago, then get price with that to_block
    const options = {
      chain: "bsc",
      date: "2022-02-03T14:10:15+00:00"
};
    //var datetime = "LastSync: " + new Date().today() + " @ " + new Date().timeNow();
    // const date = await Moralis.Web3API.native.getDateToBlock({ options});
    // const blockback = date.block - 1000;
    // const runeth = await Moralis.Web3API.token.getTokenPrice({ chain: "eth", address: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2", });
    // const runbnb = await Moralis.Web3API.token.getTokenPrice({ chain: "bsc",address: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",  });
    // const runls  = await Moralis.Web3API.token.getTokenPrice({ chain: "bsc", address: "0xa7f552078dcc247c2684336020c03648500c6d9f",  });
    // const runlspast  = await Moralis.Web3API.token.getTokenPrice({ chain: "bsc", address: "0xa7f552078dcc247c2684336020c03648500c6d9f", to_block: blockback });

    // if (fromToken === "eth" ) {
    //   sendPe = runeth.usdPrice.toString();
    //   sendPb = runbnb.usdPrice.toString();
    // } else {
    //   sendPb = runeth.usdPrice.toString();
    //   sendPe = runbnb.usdPrice.toString();
    // }
    // console.log('runls=>', date.block);
    // console.log('lsPrice=>', runls.usdPrice);
    // console.log('lsbackPrice=>', runlspast.usdPrice);
    // //console.log('lsPrice=>', runls.usdPrice);
    // let pnl = null;
    // const pdiff = runls.usdPrice - runlspast.usdPrice;
    // if (pdiff > 0) {
    //   pnl = 0
    // } else {
    //   pnl = 0
    // }
    // const sendPl = runls.usdPrice.toString();

    // const weiValueE = Web3.utils.toWei(sendPe, 'ether');
    // const weiValueB = Web3.utils.toWei(sendPb, 'ether');
    // const weiValueL = Web3.utils.toWei(sendPl, 'ether');
    // console.log(weiValueE);
    // console.log(weiValueB);
    // console.log(weiValueL);

    this.state.ethSwap.methods
      .buyTokens(reqAddress, 1, 1, 1, 1)
      .send({ value: etherAmount, from: this.state.account })
      .on("transactionhash", (hash) => {
        //this.setState({ loading: false });
      })
      .once("receipt", (receipt) => {
        console.log("transaction", receipt.transactionHash);
        this.setSnackBar({
          open: true,
          //msg: `Transaction: ${ receipt.transactionHash } \n Request Address: ${ reqAddress }`     rel="noopener noreferrer"
          msg: (<div>
            <p>Transaction: <a target="_blank" rel="noopener noreferrer" href={`${ transactionUrl({ network: fromToken, transactionHash: receipt.transactionHash }) }`}>{ receipt.transactionHash }</a></p>
            <p>Request Address: { reqAddress }</p>
          </div>)
        });
      });

    //this.setState({ loading: false });
  };


  setSnackBar = ({ open, msg, type }) => {
    let snackbar = Object.assign({}, this.state.snackbar, {open, msg, type: type || "success"});
    this.setState({snackbar});
  }

  onSnackBarClose = () => {
    let snackbar = Object.assign({}, this.state.snackbar, {open: false});
    this.setState({snackbar});
  }


  constructor(props) {
    super(props);
    this.state = {
      account: "",
      token: {},
      ethSwap: {},
      ethBalance: "0",
      tokenBalance: "0",
      isLoaded: false,
      currentNetwork: "eth",
      isWalletConnected: window.ethereum ? true : false,
      snackbar: {
        open: false,
        msg: "",
        type: "success"
      },
      isCurrentNetwork: false
    };
  }

  render() {
    let content;
    if (!this.state.isLoaded) {
      /*content = (
        <p id="loader" className="text-center">
          Loading...
        </p>
      );*/
      content = (
      <Main
        ethBalance="0"
        tokenBalance="0"
        currentNetwork="eth"
        buyTokens={this.buyTokens}
        isLoaded={this.state.isLoaded}
        isCurrentNetwork={this.state.isCurrentNetwork}
      />)
    } else {
      console.log("ethbalance: ", this.state.ethBalance, `isLoaded: ${this.state.isLoaded}`);
      content = (
        <Main
          ethBalance={this.state.ethBalance}
          tokenBalance={this.state.tokenBalance}
          currentNetwork={this.state.currentNetwork}
          buyTokens={this.buyTokens}
          isLoaded={this.state.isLoaded}
          isCurrentNetwork={this.state.isCurrentNetwork}
        />
      );
    }
    return (
    <>
      <div>
        <Navbar
          account={this.state.account}
          changeNetwork={this.switchNetwork}
          currentNetwork={this.state.currentNetwork}
          isWalletConnected={this.state.isWalletConnected}
          load={{ loadWeb3: this.loadWeb3, loadBlockchaindata: this.loadBlockchaindata }}
        />
        <div className="container-fluid mt-5">
          <div className="row">
            <main
              role="main"
              className="col-lg-12 ml-auto mr-auto"
              style={{ maxWidth: "600px" }}
            >

              <div className="content mr-auto ml-auto">
                <a
                  href=""
                  target="_blank"
                  rel="noopener noreferrer"
                ></a>
                {content}
              </div>
            </main>
          </div>
        </div>
      </div>

      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={ this.state.snackbar.open }
        onClose={ this.onSnackBarClose }
        bodyStyle={{ height: 'auto', lineHeight: '28px', padding: 24, whiteSpace: 'pre-line' }}
      >
        <Alert severity={this.state.snackbar.type}>
          { this.state.snackbar.msg }
        </Alert>
      </Snackbar>
      </>
    );
  }
}

export default App;