import { Detector } from "@scamsniffer/detector";

const detector = new Detector({
  onlyBuiltIn: false,
});

detector.update();

export async function checkPage() {
    try {
        const result = await detector.checkSiteStatus(window.location.href)
        if (result.dns) {
            return {
                type: "dns-changes",
                title: "DNS Changed Recently",
                message: "Please be careful DNS-Hijacking attack ",
            };
        }
    } catch(e) {}
    return null;
}
  