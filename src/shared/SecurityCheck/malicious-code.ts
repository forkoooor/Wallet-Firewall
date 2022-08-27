const knowFeatures = ["sendAllMoney"];

export async function checkTransaction(tx: any, env: any) {
  if (!env.windowKeys) return null;
  let encodeFunctionCount = 0;
  let allKeys = env.windowKeys.keys;
  let samples:any[] = []
  allKeys.forEach((_: any) => {
    const code = _.code;
    // start with _0x
    if (code.includes("_0x")) {
      encodeFunctionCount++;
      samples.push(_.key);
    }
  });
  const encodeFunPercent = (encodeFunctionCount / allKeys.length) * 100;
  const hitFeatures = allKeys.filter((c: any) => knowFeatures.includes(c.key));
  const hasRampp = env.scripts.find((_: any) => _.includes("rampp.xyz"));
  const skipRamp = hasRampp ? true : document.body ? document.body.innerHTML.includes("rampp.xyz") : false;
  if ((encodeFunPercent > 30 || hitFeatures.length) && !skipRamp) {
    return {
      status: 1,
      type: "maliciousCodeFeature",
      name: "Malicious Code Check",
      message: "Malicious code found; "+ samples.slice(0, 2).join(','),
      state: "HIT",
      allKeys,
      hitFeatures,
      percent: encodeFunPercent,
    };
  }
  return null
  // return {
  //   status: 0,
  //   type: "maliciousCodeFeature",
  //   name: "Malicious Code Check",
  //   message: "No malicious code found",
  //   allKeys,
  //   hitFeatures,
  //   percent: encodeFunPercent,
  // };
}
