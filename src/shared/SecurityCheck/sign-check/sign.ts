const keccakHashSize = 66;

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


function toId(array1: any) {
  let id = '';
  array1.forEach((c: any) => {
    id += `${c.name}:${c.type}`;
  })
  return id
}

function isEqualType(array1: any, array2: any) {
  const id1 = toId(array1);
  const id2 = toId(array2)
  return id2 === id1;
}

function checkPermitPayload(payload: any) {
  const { primaryType, types, domain, message } = payload;
  const typeDef = types[primaryType];

  let formattedMsg = "";
  if (isEqualType(typeDef, permitType)) {
    formattedMsg = `Sign-request detected, Approve ${message.spender} to spend your ${domain.name} with limit ${message.value}`;
  } else if (isEqualType(typeDef, permitTypeForDAI) && message.allowed) {
    const date = new Date(message.expiry * 1000);
    formattedMsg = `Sign-request detected, Approve ${message.spender} to spend your ${domain.name} utils ${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
  }

  if (formattedMsg) {
    return {
      status: 2,
      name: "Sign Check",
      type: "sign-check",
      address: message.spender,
      shareText: formattedMsg,
      message: formattedMsg,
    };
  }
}


function checkWyvernPayload(payload: any) {
  const { primaryType, types, domain, message } = payload;
  if (primaryType === 'Order') {
    if (message.basePrice == '0' || message.basePrice == 1) {
      const recipient = message.taker;
      return {
        status: 1,
        name: "Sign Check",
        type: "sign-check",
        address: recipient,
        shareText: `Suspicious Opensea Order Sign Request detected, Recipient: ${recipient}`,
        message: `Suspicious Opensea Order Sign Request detected, Recipient: ${recipient}`,
      };

    }
  }
}


export async function checkTransaction(tx: any, env: any) {
  const { params, method } = tx;
  // personal_sign
  const isSign = ["eth_sign", "personal_sign"].includes(method);
  if (isSign) {
    const message = method === 'eth_sign' ? tx.params[1] : tx.params[0];
    // verify keccak256 hash
    const hexString = message.indexOf("0x") === 0 && message.length === keccakHashSize;
    if (hexString) {
      return {
        status: 1,
        name: "Sign Check",
        type: "sign-check",
        shareText: `Suspicious Hex message Sign Request detected`,
        message: `Suspicious Hex message Sign Request detected`,
      };
    }
  }

  const isSignTypedData = ["eth_signTypedData_v3", "eth_signTypedData_v4"];
  if (isSignTypedData) {
    const payload = JSON.parse(tx.payload);
    const { domain, message } = payload;
    if (domain.name === "Seaport") {
      const { orderType, consideration } = message;
      const zeroAmountItems = consideration.filter(
        (_: any) => _.startAmount === "1" && _.endAmount === "1"
      );
      if (zeroAmountItems.length) {
        const recipient = zeroAmountItems[0].recipient;
        return {
          status: 1,
          name: "Sign Check",
          type: "sign-check",
          address: recipient,
          shareText: `Suspicious Seaport Order Sign Request detected, Recipient: ${recipient}`,
          message: `Suspicious Seaport Order Sign Request detected, Recipient: ${recipient}`,
        };
      }
    }



    try {
      const checkResult = checkPermitPayload(payload);
      if (checkResult) {
        return checkResult;
      }
    } catch (e) { }

    try {
      const checkResult = checkWyvernPayload(payload);
      if (checkResult) {
        return checkResult;
      }
    } catch (e) { }
  }
  return null;
} 