const keccakHashSize = 66;

const permitType = [
  { name: 'owner', type: 'address' },
  { name: 'spender', type: 'address' },
  { name: 'value', type: 'uint256' },
  { name: 'nonce', type: 'uint256' },
  { name: 'deadline', type: 'uint256' }
];

function toId(array1: any) {
  let id = '';
  array1.forEach((c: any) => {
    id += `${c.name}:${c.type}`;
  })
  return id
}

function compareTypes(array1: any, array2: any) {
  const id1 = toId(array1);
  const id2 = toId(array2)
  return id2 === id1;
}

function checkPermitPayload(payload: any) {
  const { primaryType, types, domain, message } = payload;
  const typeDef = types[primaryType];
  const isPermitType = compareTypes(typeDef, permitType)
  if (isPermitType) {
    const formattedMsg = `Sign-request detected, Approve ${message.spender} to spend your ${domain.name} with limit ${message.value}`
    console.log('isSame', formattedMsg)
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



export async function checkTransaction(tx: any, env: any) {
  const { params, method } = tx;
  const isSignV4 = method === "eth_signTypedData_v4";
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
  
  if (isSignV4) {
      const payload = JSON.parse(tx.payload);
      const { domain, message } = payload;
      if (domain.name === "Seaport") {
        const { orderType, consideration } = message;
        if (orderType === 2) {
          const zeroAmountItems = consideration.filter(
            (_: any) => _.startAmount === "1" && _.endAmount === "1"
          );
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
      } catch(e) {}
    }
  return null;
} 