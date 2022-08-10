
function isHidden(el: any) {
  return el.offsetParent === null;
}

function checkSecretRecoveryPhraseCheck() {
  const seedKeyword = "Secret Recovery Phrase";
  const windowTitle = "MetaMask";

  const checkDocuments = [document];
  for (let index = 0; index < window.frames.length; index++) {
    const frame = window.frames[index];
    try {
      if (frame.document.body) {
        checkDocuments.push(frame.document);
      }
    } catch (e) {}
  }

  const hasMatchDocs = checkDocuments.filter((doc) => {
    const title = doc.title;
    const body = doc.body;
    if (
      body.innerText
        .toLocaleLowerCase()
        .includes(seedKeyword.toLocaleLowerCase())
    ) {
      return true;
    }
    if (title.toLocaleLowerCase() === windowTitle.toLocaleLowerCase()) {
      return true;
    }
    return false;
  });

  const dangerSenses = hasMatchDocs.map(_ => {
    return {
      doc: _,
      inputs: Array.from(_.querySelectorAll("input"))
    };
  }).filter((doc) => {
    return doc.inputs.length > 10;
  });

  if (dangerSenses.length) {
    const inputs = dangerSenses[0].inputs;
    const isVisible = inputs.filter((c) => !isHidden(c)).length > 5;
    if (isVisible) {
      return {
        type: "fakeRecoveryPhrase",
        inputs: inputs,
        isVisible: isVisible,
        detail: dangerSenses[0].doc.body.innerText.slice(0, 100),
        title: "Fake Secret Recovery Phrase Detected",
        message: "Please don't share your Secret Recovery Phrase to anyone",
      };
    }
  }
  return null;
}

export async function checkPage() {
  try {
    const result = checkSecretRecoveryPhraseCheck();
    return result;
  } catch(e) {}
  return null;
}
