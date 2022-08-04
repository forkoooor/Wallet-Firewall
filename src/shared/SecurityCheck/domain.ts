
import { Detector } from "@scamsniffer/detector";

const detector = new Detector({
  onlyBuiltIn: false,
});

detector.update();

export async function checkTransaction(tx: any, env: any) {
    const scam = await detector?.detectScam({
      links: [env.url],
    });
    return {
      status: scam ? 1 : 0,
      type: "domain",
      name: "Domain Check",
      shareText: scam ? `Fake ${scam.name} ${scam.externalUrl}` : null,
      message: !scam
        ? "No similar project domains found"
        : `This site similar to ${scam.externalUrl} - ${scam.name} `,
      scam,
    };
}   
