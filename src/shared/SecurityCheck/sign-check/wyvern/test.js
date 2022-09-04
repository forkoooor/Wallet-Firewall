const domain = [
  { name: "name", type: "string" },
  { name: "version", type: "string" },
  { name: "chainId", type: "uint256" },
  { name: "verifyingContract", type: "address" },
];

const domainData = {
  name: "Wyvern Exchange Contract",
  version: "2.3",
  chainId: 1, //31337,80001
  verifyingContract: "0x7f268357A8c2552623316e2562D90e642bB538E5",
};

const Order = [
  { name: "exchange", type: "address" },
  { name: "maker", type: "address" },
  { name: "taker", type: "address" },
  { name: "makerRelayerFee", type: "uint256" },
  { name: "takerRelayerFee", type: "uint256" },
  { name: "makerProtocolFee", type: "uint256" },
  { name: "takerProtocolFee", type: "uint256" },
  { name: "feeRecipient", type: "address" },
  { name: "feeMethod", type: "uint8" },
  { name: "side", type: "uint8" },
  { name: "saleKind", type: "uint8" },
  { name: "target", type: "address" },
  { name: "howToCall", type: "uint8" },
  { name: "calldata", type: "bytes" },
  { name: "replacementPattern", type: "bytes" },
  { name: "staticTarget", type: "address" },
  { name: "staticExtradata", type: "bytes" },
  { name: "paymentToken", type: "address" },
  { name: "basePrice", type: "uint256" },
  { name: "extra", type: "uint256" },
  { name: "listingTime", type: "uint256" },
  { name: "expirationTime", type: "uint256" },
  { name: "salt", type: "uint256" },
  { name: "nonce", type: "uint256" },
];

const orderData = {
  exchange: "0x7f268357A8c2552623316e2562D90e642bB538E5",
  maker: "0x7f268357A8c2552623316e2562D90e642bB538E5",
  taker: "0x0000000000000000000000000000000000000000",
  makerRelayerFee: 250,
  takerRelayerFee: 0,
  makerProtocolFee: 250,
  takerProtocolFee: 250,
  feeRecipient: "0x7f268357A8c2552623316e2562D90e642bB538E5",
  feeMethod: 1,
  side: 1,
  saleKind: 0,
  target: "0x7f268357A8c2552623316e2562D90e642bB538E5",
  howToCall: 0,
  calldata: "",
  replacementPattern:
    "0x000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000ffffffffffffffffffffffffffffffffffffffff0000000000000000000000000000000000000000000000000000000000000000",
  staticTarget: "0x0000000000000000000000000000000000000000",
  staticExtradata: [],
  paymentToken: "0x0000000000000000000000000000000000000000",
  basePrice: 0,
  extra: 0,
  listingTime: Math.floor(new Date().getTime() / 1000) - 100,
  expirationTime: Math.floor(new Date().getTime() / 1000) + 36000,
  salt: "",
  nonce: 0,
};

let message = {
  types: {
    EIP712Domain: domain,
    Order: Order,
  },
  primaryType: "Order",
  domain: domainData,
  message: orderData,
};

request = {
  method: "eth_signTypedData_v4",
  params: [
    "0x83d49Bf358bF2BdAf4014A42d84385022C1583c7",
    JSON.stringify(message),
  ],
  from: "0x83d49Bf358bF2BdAf4014A42d84385022C1583c7",
  id: 1659364960573,
};

window.ethereum.request(request);
