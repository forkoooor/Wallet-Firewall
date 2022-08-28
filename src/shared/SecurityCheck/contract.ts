import fetch from "isomorphic-fetch";

const apiKey = '3URRN8BFCKZSWEYUQGW1DK96ZHCPX6UVT1'

async function getContractSource(address: string, size = 50) {
  for (let index = 0; index < 5; index++) {
    const req = await fetch(
      `https://api.etherscan.io/api?module=contract&action=getsourcecode&address=${address}&apikey=${apiKey}`
    );
    const txList = await req.json();
    if (txList.status === "0") {
        await new Promise((resolve) => {
            setTimeout(resolve, 6 * 1000);
        });
        continue;
    };
   
    return txList;
  }
}

export async function checkTransaction(tx: any, env: any) {
  if (tx.to) {
    try {
      const result = await new Promise((resolve, reject) => {
        (async () => {
          const result = await getContractSource(tx.to);
          reject(result);
        })();
        setTimeout(() => {
          reject('timeout');
        }, 10 * 1000)
      })
      return result ? null : {
        status: result ? 0 : 1,
        type: "contract-check",
        name: "Contract Check",
        message: result
          ? "The contract is open-source"
          : "The contract is not open-source",
        result,
      };
    } catch(e) {
      
    }
  }
  return null;
}
