import fetch from "isomorphic-fetch";

const needHighlightActions = [
  "bulkTransfer",
  "transferFrom",
  "safeTransferFrom",
  "0x5aefa4dd"
];  

async function loadRecentTransaction(address: string, size = 50) {
  for (let index = 0; index < 5; index++) {
    const req = await fetch(
      `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&page=1&sort=desc&apikey=YourApiKeyToken`
    );
    const txList = await req.json();
    if (txList.status === "0") {
      await new Promise((resolve) => {
        setTimeout(resolve, 6 * 1000);
      });
      continue;
    }
    return txList;
  }
}

async function checkGoPlus(address: string) {
  const req = await fetch(
    `https://api.gopluslabs.io/api/v1/address_security/${address}?chain_id=1`
  );
  const state = await req.json();
  return state.result;
}

function tryAnalyticRecentTx(txList: any) {
  let maxNonce = 0;
  let lastTimeStamp = 0;
  let totalTx = txList.result.length;
  const functionStats: any = {};
  txList.result.forEach((tx: any) => {
    if (!tx) return;
    if (tx.nonce > maxNonce) {
      maxNonce = parseInt(tx.nonce);
    }
    if (tx.timeStamp > lastTimeStamp) {
      lastTimeStamp = parseInt(tx.timeStamp);
    }

    if (tx.functionName) {
      functionStats[tx.functionName] = functionStats[tx.functionName] || 0;
      functionStats[tx.functionName]++;
    }
  });
  const topFunction = Object.keys(functionStats)
    .sort((a, b) => functionStats[b] - functionStats[a])
    .map((_) => {
      return {
        functionName: _,
        percent: (functionStats[_] / totalTx) * 100,
        count: functionStats[_],
      };
    });

  const highlightActions = topFunction.filter((_) => {
    const isMatch = needHighlightActions.find((name) =>
      _.functionName.includes(`${name}(`)
    );
    if (isMatch && _.percent > 10) {
      return true;
    }
    return false;
  });
  return {
    topFunction,
    maxNonce,
    lastTimeStamp,
    highlightActions,
  };
}

const checkNames = [
  "setApprovalForAll",
  "transferFrom",
  "safeTransferFrom",
  "approve",
  "allowance",
];

// args index
const nameMapping: any = {
  setApprovalForAll: 0,
  transferFrom: 1,
  safeTransferFrom: 1,
  approve: 0,
  allowance: 1,
};


async function checkAddress(address: string) {
  const [state, recentTxs] = await Promise.all([
    checkGoPlus(address),
    loadRecentTransaction(address),
  ]);
  const isBlack =
    state &&
    Object.keys(state).find((c: any) => {
      if (state[c] === "1" && c !== "contract_address") {
        return true;
      }
      return false;
    });

  if (isBlack) {
    const source = state.data_source || "GoPlus";
    return {
      status: 1,
      name: "Address Check",
      type: "address-check",
      address,
      message: `${address} has been blocked by ${source}, powered by GoplusSecurity`,
      shareText: `${address} has been blocked by ${source}`,
      goPlus: state,
    };
  }

  if (recentTxs) {
    try {
      const stats = await tryAnalyticRecentTx(recentTxs);
      let message = "The address is normal";
      if (stats.highlightActions.length) {
        message = `${address} Has a lot of suspicious transaction: ${
          stats.highlightActions[0].functionName.split("(")[0]
        }`;
      }
      return {
        status: stats.highlightActions.length ? 2 : 0,
        name: "Address Check",
        type: "address-check",
        message: message,
        address,
        shareText: `${address} Has a lot of suspicious transaction: ${
          stats.highlightActions[0].functionName.split("(")[0]
        }`,
        stats,
        goPlus: state,
      };
    } catch(e) {
      
    }
  }
}

export async function checkTransaction(tx: any, env: any) {
  if (!tx.to) return;
  const isWatch = checkNames.includes(tx.name);
  if (isWatch && tx.args) {
    const index = nameMapping[tx.name];
    const address = tx.args[index];
    if (address) {
      try {
        await new Promise((resolve, reject) => {
          (async () => {
            const message = await checkAddress(address);
            if (message) {
              resolve(message)
            }
          })();
          setTimeout(() => {
            reject('timeout');
          },  10 * 1000)
        })
      } catch(e) {

      }
    }
  }
  return null
  // return {
  //   status: 0,
  //   name: "Address Check",
  //   type: "address-check",
  //   message: "The address is normal",
  // };
}
