const checkNames = [
  "setApprovalForAll",
  "transferFrom",
  "safeTransferFrom",
  "approve",
  "allowance",
  "validate",
  "upgradeTo"
];
  
// args index
const nameMapping: any = {
  setApprovalForAll: 0,
  transferFrom: 1,
  safeTransferFrom: 1,
  approve: 0,
  allowance: 1,
  upgradeTo: 0
};

const whitelist: any = {
  setApprovalForAll: [
    'opensea.io',
    'looksrare.org',
    'x2y2.io', 
    'www.element.market',
  ]
}

const contractWhiteList = [
  // opensea 
  '0x1e0049783f008a0085193e00003d00cd54003c71',
  // element
  '0x20F780A973856B93f63670377900C1d2a50a77c4'
]

export async function checkTransaction(tx: any, env: any) {
  if (!tx.to) return;
  const isWatch = checkNames.includes(tx.name);
  if (isWatch && tx.args) {
    const isInWhitelist = whitelist[tx.name] && whitelist[tx.name].includes(env.host)
    if (isInWhitelist) {
      return null
    }
    const index = nameMapping[tx.name];
    const address = tx.args[index] ?? "";
    return {
      status: 2,
      name: "Highlight Action",
      type: "highlight-action",
      message: address ? `${tx.name} ${address}` : tx.name,
      address,
    };
  }
  return null
}