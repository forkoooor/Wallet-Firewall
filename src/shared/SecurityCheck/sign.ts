const keccakHashSize = 66;

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
    }
  return null;
} 