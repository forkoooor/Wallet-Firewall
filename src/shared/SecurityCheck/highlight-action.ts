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

export async function checkTransaction(tx: any, env: any) {
  if (!tx.to) return;
  const isWatch = checkNames.includes(tx.name);
  if (isWatch && tx.args) {
    const index = nameMapping[tx.name];
    const address = tx.args[index];
    return {
      status: 2,
      name: "Highlight Action",
      type: "highlight-action",
      message: `${tx.name} ${address}`,
      address,
    };
  }
  return null
}