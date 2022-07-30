import fetch from "isomorphic-fetch";
import { BigNumber, ethers } from "ethers";

const ERC20ABIList = [
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "event Approval(address indexed owner, address indexed spender, uint256 value)",
];

const ERC721ABIList = [
  "event ApprovalForAll(address indexed owner, address indexed operator, bool approved);",
  "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);",
  "event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId);",
];

const ERC721Parser = new ethers.utils.Interface(ERC721ABIList);
const ERC20PArser = new ethers.utils.Interface(ERC20ABIList);
const parsers = [ERC721Parser, ERC20PArser];

function parseLog(log: any) {
  for (let index = 0; index < parsers.length; index++) {
    const parser = parsers[index];
    try {
      const parsed = parser.parseLog(log);
      return parsed;
    } catch(e) {}
  }
  return null;
}

const SIMULATE_URL = `https://api.tenderly.co/api/v1/account/0xfun/project/gas/simulate`;

async function simulateTx(tx: any) {
  const body = {
    // standard TX fields
    network_id: "1",
    from: tx.from,
    to: tx.to,
    input: tx.data,
    gas: 401572,
    gas_price: "0",
    value: tx.value,
    save_if_fails: true,
    save: false,
    simulation_type: "quick",
  };

  try {
    const req = await fetch(SIMULATE_URL, {
      headers: {
        "X-Access-Key": "1fUuNlidconDi1hhqnckDAdHznJ5hOTo",
      },
      referrerPolicy: "strict-origin-when-cross-origin",
      body: JSON.stringify(body),
      method: "POST",
      mode: "cors",
      credentials: "omit",
    });

    const result = await req.json();
    // console.log("result", result);
    return result;
  } catch (e) {
    return null;
  }
}

export async function checkTransaction(tx: any, env: any) {
  let message = [];
  let status = 0;
  let logs = [];
  let result = null;
  let transaction = null;
  let parsedEvents: any[] = [];
  let logsByName: any = {};
  let from = tx.from.toLowerCase();
  try {
    result = await simulateTx(tx);
    transaction = result.transaction;

    if (transaction) {
      if (transaction.error_message) {
        status = 2;
        message.push("Error: " + transaction.error_message);
      }
      if (transaction.transaction_info.logs) {
        transaction.transaction_info.logs.forEach((log: any) => {
          try {
            let parsedEvent = parseLog(log.raw);
            if (parsedEvent) {
              parsedEvents.push(parsedEvent);
              logsByName[parsedEvent.name] = logsByName[parsedEvent.name] || [];
              logsByName[parsedEvent.name].push(parsedEvent);
            }
          } catch (e) {
            // console.log("parse Error", e, log.raw);
          }
        });

        if (logsByName['ApprovalForAll']) {
          const approveToOthers = logsByName["ApprovalForAll"].filter(
            (event: any) => {
              return (
                event.args.owner.toLowerCase() === from && event.args.approved
              );
            }
          );
          // console.log("approveToOthers", approveToOthers);
          if (approveToOthers.length) {
            status = 1;
            message.push(
              `This transaction will approve authority to ${approveToOthers[0].args.operator}`
            );
          }
        }
        // console.log("logsByName", logsByName);
        if (logsByName["Transfer"]) {
          const sendOut = logsByName["Transfer"].filter((event: any) => {
            return event.args.from.toLowerCase() === from;
          })
          const receiveIn = logsByName["Transfer"].filter((event: any) => {
            return event.args.to.toLowerCase() === from;
          });
          // console.log('sendOut', sendOut)
          if (sendOut.length) {
            status = 1;
            message.push(
              `This transaction will transfer ${sendOut.length} Token to ${sendOut[0].args.to}`
            );
          }
          if (receiveIn.length) {
             message.push(
               `Receive +${receiveIn.length} Transfer events; `
             );
          }
        }
        // const logsByName = parsedEvents.reduce(() => {
        // })
        // transaction.logs.push*()
        // message.push(JSON.stringify(transaction.logs, null, 2));
      }
    }
  } catch (e) {}
  message.push("Simulation powered by Tenderly");
  return {
    name: "Simulating transaction",
    type: "simulation",
    status,
    transaction,
    message:
      result && result.transaction ? message.join("\n\n") : "run simulation failed",
  };
}
