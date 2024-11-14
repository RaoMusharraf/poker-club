const { web3 } = require('../web3');
const { env } = require('../config');

const TokenData = require(`./${env}/Token.json`);
const RewardData = require(`./${env}/Reward.json`);
const Swap = require(`./${env}/swaptoken.json`);
const marketplace = require(`./${env}/marketplace.json`);


const TokenABI = TokenData['abi'];
const TokenAddress = TokenData['address'];
const Token = new web3.eth.Contract(TokenABI, TokenAddress);

const RewardABI = RewardData['abi'];
const RewardAddress = RewardData['address'];
const Reward = new web3.eth.Contract(RewardABI, RewardAddress);

const SwapABI = Swap['abi'];
const SwapAddress = Swap['address'];

const marketplaceABI = marketplace['abi'];
const marketplaceAddress = marketplace['address'];

module.exports = {
  Token, TokenABI, TokenAddress,
  Reward, RewardABI, RewardAddress,
  SwapABI, SwapAddress, marketplaceABI, marketplaceAddress
};
