import Inspector from "./FireWall/Inspector";
import App from "./App";
import {
  setupPortalShadowRoot,
  ReactRootShadowed,
  createReactRootShadowedPartial,
} from "./ShadowRoot";

import "./i18n";
import "./shared/api";

const version = "0.0.4";
const firewall = new Inspector();
firewall.init();

function mountApp() {
  const createReactRootShadowed = createReactRootShadowedPartial({
    preventEventPropagationList: [],
  });
  const shadow = setupPortalShadowRoot({ mode: "closed" });
  let view: ReactRootShadowed | null = null;
  let counter = 1;

  function createAndRender() {
    view = createReactRootShadowed(shadow, { key: `app-${counter}` });
    view.render(<App firewall={firewall} />);
    counter++;
  }
  createAndRender();
}

/* @ts-ignore */
if (document.body) {
  mountApp();
} else {
  document.addEventListener("DOMContentLoaded", () => {
    mountApp();
  });
}

if (process.env.NODE_ENV === "development") {
  require("./test")?.default?.();
}
