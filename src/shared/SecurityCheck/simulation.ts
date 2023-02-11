import fetch from "isomorphic-fetch";
import { BigNumber, ethers } from "ethers";

const ERC20ABIList = [
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "event Approval(address indexed owner, address indexed spender, uint256 value)",
];

const ERC721ABIList = [
  "event ApprovalForAll(address indexed owner, address indexed operator, bool approved)",
  "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)",
  "event Approval(address indexed owner, address indexed spender, uint256 indexed tokenId)",
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

async function simulateTx(tx: any, env: any) {
  const simulation = env.config.simulation || {};
  console.log('simulateTx', env, simulation)
  const user = simulation.account || 'ScamSniffer';
  const apiKey = simulation.apiKey || 'zam8lOrECdXk8zEJfN19cBnWTPYrOzh1';
  const project = simulation.project || 'project';
  const isCustom = typeof simulation.account != 'undefined';

  const SIMULATE_URL = `https://api.tenderly.co/api/v1/account/${user}/project/${project}/simulate`;
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
        "X-Access-Key": apiKey,
      },
      referrerPolicy: "strict-origin-when-cross-origin",
      body: JSON.stringify(body),
      method: "POST",
      mode: "cors",
      credentials: "omit",
    });

    const result = await req.json();
    // console.log("result", result);
    return [isCustom, result];
  } catch (e) {
    console.log('error', e)
    return null;
  }
}

export async function checkTransaction(tx: any, env: any) {
  if (!tx.to) return;
  let message = [];
  let status = 0;
  let logs = [];
  let result = null;
  let transaction = null;
  let parsedEvents: any[] = [];
  let logsByName: any = {};
  let from = tx.from.toLowerCase();
  let recipient = null;
  let reachLimit = false;
  let isCustom = false;

  const simulation = env.config.simulation || {};
  const hasSetting = typeof simulation.account != 'undefined';
  if (!hasSetting) {
    return null;
  }

  try {
    const res = await simulateTx(tx, env);
    if (res) {
      isCustom = res[0];
      result = res[1]
    } else {
      return null;
    }

    transaction = result.transaction;
    if (result.error) {
      reachLimit = result.error.message.includes('quota');
      // reachLimit = true
    }

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

         if (logsByName["Approval"]) {
           const approveToOthers = logsByName["Approval"].filter(
             (event: any) => {
               return (
                 event.args.owner.toLowerCase() === from
               );
             }
           );
           // console.log("approveToOthers", approveToOthers);
           if (approveToOthers.length) {

             status = 2;
             recipient = approveToOthers[0].args.spender;
             message.push(
               `This transaction will approve authority to ${approveToOthers[0].args.spender}`
             );
           }
         }

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
            recipient = approveToOthers[0].args.operator;
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
            status = 2;
            recipient = sendOut[0].args.to;
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
      }
    }
  } catch (e) {}
  message.push("Simulation powered by Tenderly");
  // if (!reachLimit && !result.transaction) {
  //   return null;
  // }
  return {
    name: "Simulating transaction",
    type: "simulation",
    status: reachLimit ? 2 : status,
    transaction,
    address: recipient,
    shareText: status
      ? `Transaction simulation detect risky behavior(${Object.keys(
          logsByName
        )})`
      : null,
    message:
      result && result.transaction
        ? message.join("\n\n")
        : reachLimit ?  isCustom ? result.error.message : 'Please set your Tenderly API key in setting page' : result.error.message + "\nSimulation powered by Tenderly",
  };
}
