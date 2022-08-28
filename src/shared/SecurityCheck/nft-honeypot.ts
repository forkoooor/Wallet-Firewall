import { ethers } from "ethers";
import { provider } from "./provider/eth";

export async function checkTransaction(tx: any, env: any) {
  const rawTx = tx.raw;
  if (!rawTx) return null;
  const callContract = rawTx.to;
  const hasEthTransfer = rawTx.value;
  
  if (rawTx && callContract && hasEthTransfer) {
   try {
    const nftContract = new ethers.Contract(
      callContract,
      [
        `function isApprovedForAll(address owner, address operator) public view returns (bool)`,
        `function setApprovalForAll(address operator, bool approved) public`
      ],
      provider
    );

    await nftContract.isApprovedForAll(rawTx.from, rawTx.to);
    // not revert, that's mean this is a erc721 contract
    const seaport = '0x00000000006c3852cbEf3e08E8dF289169EdE581'

    let isFailed = false;
    try {
      const gas = await nftContract.estimateGas.setApprovalForAll(seaport, true);
      // console.log('gas', gas)
    } catch(e ){
      // reverted
      isFailed = true
    }

    if (isFailed) {
      return {
        status: 1,
        type: "nft-honeypot-check",
        name: "NFT Honeypot Check",
        message: `setApprovalForAll locked, that's mean you can't sell on opensea and other marketplace`,
      };
    }
   } catch(e) {
    // reverted
    //  console.log("error", e);
   }
  }
  return null;
}


function test() {
    checkTransaction({
      raw: {
        from: '0x67fa9c3613b8b8c8c15b41023895ca3a6b09fb62',   
        to: '0xcc39ebea634483cd19f2dc30133aa9a237d61903',
        data: '0x9fb17e340000000000000000000000000000000000000000000000000000000000000002',
        value: '1000000'
      }
    }, {

    })
}

// test();