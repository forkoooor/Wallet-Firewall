import { ethers } from "ethers";

const provider = new ethers.providers.JsonRpcProvider(
  "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"
);

const allowListRegistryAddress = "0xb39c4EF6c7602f1888E3f3347f63F26c158c0336";
const allowListRegistry = new ethers.Contract(
  allowListRegistryAddress,
  [
    `function validateCalldataByOrigin( string memory originName, address targetAddress, bytes calldata data) public view returns (bool isValid)`,
  ],
  provider
);


export async function checkTransaction(tx: any, env: any) {
  if (tx.to) {
   try {
     const originName = env.host;
     const isAllow = await allowListRegistry.validateCalldataByOrigin(
       originName,
       tx.to,
       tx.data
     );
    //  console.log("Allowlist-check", isAllow);
     return {
       status: isAllow ? 0 : 1,
       type: "allowlist-check",
       name: "Allowlist Check",
       message: !isAllow
         ? `The transaction is not int ${originName} allowlist`
         : "The transaction is in allowlist",
       isAllow,
     };
   } catch(e) {
    //  console.log("error", e);
     return {
       status: 0,
       type: "allowlist-check",
       name: "Allowlist Check",
       message: "Allowlist not found for this site",
     };
   }
  }
  return null;
}
