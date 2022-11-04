import { BigNumber, ethers } from "ethers";
import { ABIList, ActionFormatter } from "../config/abi.json";

// const abiList = [
//   "function setApprovalForAll(address operator, bool approved)",
//   "function transferFrom(address from, address to, uint256 tokenId)",
//   "function safeTransferFrom(address from, address to, uint256 tokenId)",
//   "function approve(address to, uint256 tokenId)",
// ];

const parser = new ethers.utils.Interface(ABIList);

function renderTemplate(template: string, context: any) {
  return template.replace(/\{\{(.*?)\}\}/g, (match, key) => context[key]);
}

export function formatAction(action: any, language: string) {
  const actionName = action.name as string;
  const allTemplates = ActionFormatter as any;
  const fallbackLanguage = "en-US";
  if (allTemplates[actionName]) {
    const template = allTemplates[actionName][language]
      ? allTemplates[actionName][language]
      : allTemplates[actionName][fallbackLanguage];
    // const formatted = renderTemplate(template.args, action.args);
    return {
      raw: action,
      ...template,
      // short: template.short,
      // args: template.args,
      // description: template.description,
    };
  }
  return {
    raw: action,
  };
}

export function parseRequest(request: any) {
  let parsedAction = null;
  const { method } = request;
  let isRead = false;
  if (
    [
      "eth_sign",
      "personal_sign",
      "signTypedData",
      "signTypedData_v1",
      "signTypedData_v3",
      "eth_signTypedData_v3",
      "eth_signTypedData_v4",
    ].includes(method)
  ) {
    return {
      isSign: true,
      method,
      params: request.params,
      address: request.params[0],
      payload: request.params[1],
    };
  }
  if (
    ["eth_sendTransaction", "eth_sendRawTransaction"].indexOf(method) > -1
  ) {
    const tx = request.params[0];
    const isRaw = method === "eth_sendRawTransaction";
    isRead = method === "eth_call";
    try {
      const transaction = isRaw ? ethers.utils.parseTransaction(tx) : tx;
      const dataEmpty =
        !transaction.data || (transaction.data && transaction.data === "0x");

      if (!dataEmpty) {
        const decodedInput = parser.parseTransaction({
          data: transaction.data,
          value: transaction.value,
        });
        const formatted = {};
        // for (let key in decodedInput.args) {
        //   formatted[key] =
        //     decodedInput.args[key] instanceof BigNumber
        //       ? decodedInput.args[key].toString()
        //       : decodedInput.args[key];
        // }
        if (decodedInput.name) {
          parsedAction = {
            method,
            name: decodedInput.name,
            isRead,
            signature: decodedInput.signature,
            args: decodedInput.args,
            to: transaction.to,
            from: transaction.from,
            data: transaction.data,
            raw: transaction,
          };
        }
      } else if (dataEmpty && transaction.value) {
        parsedAction = {
          name: "transferETH",
          method,
          isRead,
          to: transaction.to,
          from: transaction.from,
          data: transaction.data,
          args: {
            amount: transaction.value.toString(),
          },
          raw: transaction,
        };
      }
    } catch (e) {
      parsedAction = {
        isRead,
        method,
        to: tx.to,
        from: tx.from,
        data: tx.data,
        raw: tx,
      };
    }
  }

  return parsedAction;
}
