const payload = {
    "types": {
      "EIP712Domain": [
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "version",
          "type": "string"
        },
        {
          "name": "chainId",
          "type": "uint256"
        },
        {
          "name": "verifyingContract",
          "type": "address"
        }
      ],
      "Permit": [
        {
          "name": "owner",
          "type": "address"
        },
        {
          "name": "spender",
          "type": "address"
        },
        {
          "name": "value",
          "type": "uint256"
        },
        {
          "name": "nonce",
          "type": "uint256"
        },
        {
          "name": "deadline",
          "type": "uint256"
        }
      ]
    },
    "primaryType": "Permit",
    "domain": {
      "name": "1INCH Token",
      "verifyingContract": "0x111111111117dc0aa78b770fa6a738034120c302",
      "chainId": 56,
      "version": "1"
    },
    "message": {
      "owner": "0x2c9b2dbdba8a9c969ac24153f5c1c23cb0e63914",
      "spender": "0x11111112542d85b3ef69ae05771c2dccff4faa26",
      "value": "1000000000",
      "nonce": 0,
      "deadline": 192689033
    }
  }


  request = {
  method: "eth_signTypedData_v4",
  params: [
    "0x83d49Bf358bF2BdAf4014A42d84385022C1583c7",
    JSON.stringify(payload),
  ],
  from: "0x83d49Bf358bF2BdAf4014A42d84385022C1583c7",
  id: 1659364960573,
};


window.ethereum.request(request)