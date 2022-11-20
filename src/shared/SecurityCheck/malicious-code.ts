const knowFeatures = ["sendAllMoney"];

export async function checkTransaction(tx: any, env: any) {
  if (!env.windowKeys) return null;
  let encodeFunctionCount = 0;
  let allKeys = env.windowKeys.keys;
  let samples: any[] = [];
  let names: any[] = [];
  const encodeNames: any[] = [];
  allKeys.forEach((_: any) => {
    const code = _.code;
    // start with _0x
    if (code.includes("_0x")) {
      encodeFunctionCount++;
      samples.push(_.key);
      encodeNames.push(_.key);
    }
    names.push({
      key: _.key,
      code,
    });
  });
  const encodeFunPercent = (encodeFunctionCount / allKeys.length) * 100;
  const hitFeatures = allKeys.filter((c: any) => knowFeatures.includes(c.key));

  const sites = [
    "discord.com",
    "mintplex.xyz",
    "rampp.xyz",
    "blogger.com",
    "/wp-content/",
    "_sec/cp_challenge",
  ];

  function containSite(value: any) {
    return sites.find((_) => value.includes(_));
  }

  const hasRampp = env.scripts.find((_) => containSite(_));
  const skipRamp = hasRampp
    ? true
    : document.body
    ? containSite(document.body.innerHTML)
    : false;

  const commonSites = [
    "fbAsyncInit",
    "onYouTubeIframeAPIReady",
    "OutstreamPlayer",
    "JSZip",
    "__scriptExecutionEnd__",
  ];

  const nativeOverride = [
    "setup",
    "__NEXT_PRELOADREADY",
    "CoinbaseWalletSDK",
    "imgload",
    "drift",
    "signIn",
    "onload",
    "gtag",
    "render",
    "sendFingerprint",
    "random_num",
    "onresize",
    "fetch",
    "_typeof",
    "_createForOfIteratorHelper",
    "a1_0x388b",
    "grcb",
  ];

  const commonSite = names.find((d) => commonSites.includes(d.key));

  if (commonSite) {
    // console.log("commonSite", commonSite, commonSites, names);
    return null;
  }

  const hasNativeOverride = encodeNames.find((d) => nativeOverride.includes(d));
  if (hasNativeOverride) {
    // console.log("hasNativeOverride", hasNativeOverride, names);
    return null;
  }

  if ((encodeFunPercent > 30 || hitFeatures.length) && !skipRamp) {
    return {
      status: 1,
      type: "maliciousCodeFeature",
      name: "Malicious Code Check",
      message:
        "Malicious code found: " + samples.slice(0, 2).join(", ") + "...",
      state: "HIT",
      allKeys,
      hitFeatures,
      percent: encodeFunPercent,
    };
  }
  return null;
}
