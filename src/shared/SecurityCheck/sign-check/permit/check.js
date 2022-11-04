
const testPayload = {
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

const testDAIPayload = (function () {
  const SECOND = 1000;

  const fromAddress = "0x9EE5e175D09895b8E1E28c22b961345e1dF4B5aE";
  // JavaScript dates have millisecond resolution
  const expiry = Math.trunc((Date.now() + 120 * SECOND) / SECOND);
  const nonce = 1;
  const spender = "0xE1B48CddD97Fa4b2F960Ca52A66CeF8f1f8A58A5";

  const message = {
    holder: fromAddress,
    spender: spender,
    nonce: nonce,
    expiry: expiry,
    allowed: true,
  };

  return {
    types: {
      EIP712Domain: [
        {
          name: "name",
          type: "string",
        },
        {
          name: "version",
          type: "string",
        },
        {
          name: "chainId",
          type: "uint256",
        },
        {
          name: "verifyingContract",
          type: "address",
        },
      ],
      Permit: [
        {
          name: "holder",
          type: "address",
        },
        {
          name: "spender",
          type: "address",
        },
        {
          name: "nonce",
          type: "uint256",
        },
        {
          name: "expiry",
          type: "uint256",
        },
        {
          name: "allowed",
          type: "bool",
        },
      ],
    },
    primaryType: "Permit",
    domain: {
      name: "Dai Stablecoin",
      version: "1",
      chainId: 42,
      verifyingContract: "0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa",
    },
    message: message,
  };
})()


const permitType = [
  { name: 'owner', type: 'address' },
  { name: 'spender', type: 'address' },
  { name: 'value', type: 'uint256' },
  { name: 'nonce', type: 'uint256' },
  { name: 'deadline', type: 'uint256' }
];

const permitTypeForDAI = [
  {
    name: "holder",
    type: "address",
  },
  {
    name: "spender",
    type: "address",
  },
  {
    name: "nonce",
    type: "uint256",
  },
  {
    name: "expiry",
    type: "uint256",
  },
  {
    name: "allowed",
    type: "bool",
  }
]

function toId(array1) {
  let id = '';
  array1.forEach(_ => {
    id += `${_.name}:${_.type}`;
  })
  return id
}

function isEqualType(array1, array2) {
  const id1 = toId(array1);
  const id2 = toId(array2)
  return id2 === id1;
}

function checkPayload(payload) {
  const { primaryType, types, domain, message } = payload;
  const typeDef = types[primaryType];
  
  let formattedMsg = ""
  if (isEqualType(typeDef, permitType)) {
    formattedMsg = `Sign-request detected, Approve ${message.spender} to spend your ${domain.name} with limit ${message.value}`;
    // console.log('isSame', formattedMsg)
   
  } else if (isEqualType(typeDef, permitTypeForDAI)) {
    if (message.allowed) {
      const date = new Date(message.expiry * 1000);
      formattedMsg = `Sign-request detected, Approve ${message.spender} to spend your ${domain.name} utils ${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    }
  }

  if (formattedMsg) {
    return {
      status: 1,
      name: "Sign Check",
      type: "sign-check",
      address: message.spender,
      shareText: formattedMsg,
      message: formattedMsg,
    };
  }
}

// checkPayload(testPayload);