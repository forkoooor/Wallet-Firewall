export async function checkTransaction(tx: any, env: any) {
  const { params, method } = tx;
  const isSignV4 = method === "eth_signTypedData_v4";
  const isSign = ["eth_sign", "personal_sign"].includes(method);
  console.log("sign-check", tx);
  if (isSign) {
    const hexString =
      method === "personal_sign"
        ? tx.params[0].indexOf("0x") === 0
        : tx.params[1].indexOf("0x") === 0;
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