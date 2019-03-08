import React, { Component } from "react";
import HashContract from "./contracts/Hash.json";
import getWeb3 from "./utils/getWeb3";

import "./App.css";
import ipfs from './ipfs';

class App extends Component {
  constructor (props) {
    super(props);
    this.state = {
      imageBuffer: null,
      web3: null,
      accounts: null,
      contract: null,
      ipfsHash: null,
      txHash: null,
      ipfsLink: null,
      etherscanLink: null
    };
    this.onSubmitImage = this.onSubmitImage.bind(this);
    this.onCaptureImage = this.onCaptureImage.bind(this);
  }
  

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      console.log(networkId)
      const deployedNetwork = HashContract.networks[networkId];
      const instance = new web3.eth.Contract(
        HashContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  runExample = async () => {
    const { accounts, contract } = this.state;

    // Stores a given value, 5 by default.
    // await contract.methods.set(5).send({ from: accounts[0] });

    // // Get the value from the contract to prove it worked.
    // const response = await contract.methods.get().call();

    // // Update state with the result.
    // this.setState({ storageValue: response });
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    const {txHash, ipfsHash, etherscanLink, ipfsLink} = this.state;
    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
          IPFS File Upload DApp
        </nav>
        <h1>Your Image</h1>
        <p>This image is stored on IPFS and its hash is saved in Ethereum blockchain</p>
        <img src="" alt =""/>
        <h2>Upload image</h2>
        <form onSubmit={ (event) => this.onSubmitImage(event) }>
          <input type='file' onChange={(event) => this.onCaptureImage(event ) }/>
          <input type='submit'/>
        </form>
        {
          ipfsHash? 
          <div>
            <div>ipfsHash: {ipfsHash}</div>
            <div><a href = {ipfsLink}>view on ipfs</a></div>
          </div>:
          <div></div>
        }
        {
          txHash? 
          <div>
            <div>txHash: {txHash}</div>
            <div><a href = {etherscanLink}>view on etherscan</a></div>
          </div>:
          <div></div>
        }
      </div>
    );
  }

  onSubmitImage(event) {
    event.preventDefault();
    const { accounts, contract, imageBuffer } = this.state;
    console.log(contract.methods)
    // const {imageBuffer} = this.state;
    console.log(ipfs.files);
    ipfs.add(imageBuffer)
    .then(result => {
      let hash = result[0].hash;
      this.setState({ipfsHash: hash});
      let ipfsLink = "https://ipfs.io/ipfs/" + hash;
      this.setState({ipfsLink: ipfsLink});
      contract.methods.setHash(hash)
      .send({from: accounts[0]})
      .then(result => {
        console.log(result.transactionHash)
        this.setState({txHash: result.transactionHash});
        let etherscanLink = "https://rinkeby.etherscan.io/tx/" + result.transactionHash;
        this.setState({etherscanLink: etherscanLink});
      })
      .catch(error => {
        console.log(error);
      });
    })
    .catch(error=>console.log(error));
    console.log('submitting imate');
  }

  onCaptureImage(event) {
    event.preventDefault();
    const file = event.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
      this.setState({imageBuffer: Buffer(reader.result)});
      console.log(Buffer(reader.result));
    }
    console.log('capturing file');
  }
}

export default App;
