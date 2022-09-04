
function isHidden(el: any) {
  return el.offsetParent === null;
}

function checkSecretRecoveryPhraseCheck() {
  const seedKeyword = "Secret Recovery Phrase";
  const seedKeyword2 = "Recovery Phrase";
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
        .includes(seedKeyword.toLocaleLowerCase()) ||
      body.innerText
        .toLocaleLowerCase()
        .includes(seedKeyword2.toLocaleLowerCase())
    ) {
      return true;
    }
    if (title.toLocaleLowerCase() === windowTitle.toLocaleLowerCase()) {
      return true;
    }
    return false;
  });

  let dangerSenses = hasMatchDocs.map(_ => {
    return {
      doc: _,
      inputs: Array.from(_.querySelectorAll("input[type=text]")),
      textarea: Array.from(_.querySelectorAll("textarea")),
    };
  }).filter((doc) => {
    // make sure input is match 12
    const inputOver = doc.inputs.length > 10;
    const inputTextarea = doc.textarea.filter(el => {
      const placeholder = el.getAttribute('placeholder');
      // Typically 12 (sometimes 24) words separated by a single spaces.
      const match = placeholder && placeholder.includes('12') && placeholder.includes('separated') &&  placeholder.includes('space')
      return match;
    }).length > 0;
    return inputOver || inputTextarea;
  });

  if (dangerSenses.length) {
    const inputs = dangerSenses[0].inputs;
    const textarea = dangerSenses[0].textarea;
    const isVisible = [inputs].concat(textarea).filter((c) => !isHidden(c)).length > 1;
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
