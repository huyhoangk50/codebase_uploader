const IPFS = require('ipfs-http-client');
// const ipfs = new IPFS({
//   host: 'ipfs.infura.io', 
//   port: 5001, 
//   protocol: 'https'
// });
const ipfs = new IPFS({host: '127.0.0.1', port: 5001, protocol: 'http'});

export default ipfs;