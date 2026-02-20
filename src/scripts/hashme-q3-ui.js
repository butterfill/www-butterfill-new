import loadArgon2idWasm from 'argon2id';
import generatePassword from '/q3-browser.js';

const HARD_MODE_COOKIE_NAME = 'q3_hashme_hard_mode';
const HARD_MODE_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

const textEncoder = new TextEncoder();
let argon2idPromise;

function getArgon2id() {
  if (!argon2idPromise) {
    argon2idPromise = loadArgon2idWasm();
  }
  return argon2idPromise;
}

function getCookie(name) {
  const cookie = document.cookie
    .split(';')
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${name}=`));
  if (!cookie) {
    return null;
  }
  return cookie.slice(name.length + 1);
}

function setHardModeCookie(enabled) {
  document.cookie = `${HARD_MODE_COOKIE_NAME}=${enabled ? '1' : '0'}; Max-Age=${HARD_MODE_COOKIE_MAX_AGE_SECONDS}; Path=/; SameSite=Lax`;
}

function readHardModeCookie() {
  return getCookie(HARD_MODE_COOKIE_NAME) === '1';
}

function passwordFromBytes(bytes) {
  const uppercase = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const lowercase = 'abcdefghijkmnpqrstuvwxyz';
  const digits = '23456789';
  const symbols = '!#$%^&*()-_=+[]{}|;:,.<>/';
  const all = `${uppercase}${lowercase}${digits}${symbols}`;
  const chars = [];

  chars.push(uppercase[bytes[0] % uppercase.length]);
  chars.push(lowercase[bytes[1] % lowercase.length]);
  chars.push(digits[bytes[2] % digits.length]);
  chars.push(symbols[bytes[3] % symbols.length]);

  for (let i = 4; i < 13; i += 1) {
    chars.push(all[bytes[i % bytes.length] % all.length]);
  }

  return chars.join('');
}

async function generateHardModePassword(masterPassword, domain) {
  const normalizedDomain = domain.trim().toLowerCase();
  const passwordSeed = await crypto.subtle.digest('SHA-256', textEncoder.encode(`${masterPassword}!@#${normalizedDomain}`));
  const saltSeed = await crypto.subtle.digest('SHA-256', textEncoder.encode(`q3-hard-mode:${normalizedDomain}`));

  const argon2id = await getArgon2id();
  const hash = argon2id({
    password: new Uint8Array(passwordSeed),
    salt: new Uint8Array(saltSeed).slice(0, 16),
    parallelism: 1,
    passes: 3,
    memorySize: 64 * 1024,
    tagLength: 32,
  });

  return passwordFromBytes(hash);
}

window.q3_generate_password = async function(masterPassword, domain) {
  try {
    return await generatePassword(domain, masterPassword);
  } catch (error) {
    console.error('Error generating password:', error);
    return 'Error generating password';
  }
};

function initUI() {
  const placeholderText = 'Enter details above';
  const mismatchInputsText = '--- match inputs first! ---';
  const mismatchDomainsText = '--- match domains first! ---';
  const mismatchPasswordsText = '--- match passwords first! ---';
  const errorText = 'Error';

  const resultElement = document.getElementById('result');
  const resultIndexElement = document.getElementById('result-index');
  const extendedResultContainer = document.getElementById('extended-result-container');
  const extendedResultElement = document.getElementById('extended-result');
  const extendedResultIndexElement = document.getElementById('extended-result-index');
  const hardModeToggleElement = document.getElementById('hard-mode-enabled');
  const hardResultContainer = document.getElementById('hard-result-container');
  const hardResultElement = document.getElementById('hard-result');
  const hardResultIndexElement = document.getElementById('hard-result-index');

  function formatPasswordForDisplay(password) {
    return password.split('').join(' ');
  }

  function formatIndexForLength(length) {
    return Array.from({ length }, (_, index) => String((index + 1) % 10)).join(' ');
  }

  function getMismatchMessage(passwordMismatch, domainMismatch) {
    if (passwordMismatch && domainMismatch) {
      return mismatchInputsText;
    }
    if (domainMismatch) {
      return mismatchDomainsText;
    }
    if (passwordMismatch) {
      return mismatchPasswordsText;
    }
    return mismatchInputsText;
  }

  function showPasswordResult(element, indexElement, password) {
    element.textContent = formatPasswordForDisplay(password);
    element.dataset.rawPassword = password;
    element.className = '';
    indexElement.textContent = formatIndexForLength(password.length);
    indexElement.style.visibility = 'visible';
  }

  function clearPasswordResult(element, indexElement, text, className = '') {
    element.textContent = text;
    delete element.dataset.rawPassword;
    element.className = className;
    indexElement.textContent = '';
    indexElement.style.visibility = 'hidden';
  }

  function resetExtendedResult() {
    extendedResultContainer.style.display = 'none';
    clearPasswordResult(extendedResultElement, extendedResultIndexElement, '');
  }

  function resetHardResult() {
    hardResultContainer.style.display = 'none';
    clearPasswordResult(hardResultElement, hardResultIndexElement, '');
  }

  async function resultDisplay() {
    const pw1 = document.getElementById('pw1').value;
    const pw2 = document.getElementById('pw2').value;
    const dom1 = document.getElementById('dom1').value;
    const dom2 = document.getElementById('dom2').value;
    const extension = document.getElementById('extension').value.trim();
    const hardModeEnabled = hardModeToggleElement.checked;

    const hasPasswordConfirmation = pw2 !== '';
    const hasDomainConfirmation = dom2 !== '';
    const passwordMismatch = hasPasswordConfirmation && pw1 !== pw2;
    const domainMismatch = hasDomainConfirmation && dom1 !== dom2;
    const hasPrimaryInputs = Boolean(pw1 && dom1);
    const hasMismatch = passwordMismatch || domainMismatch;

    if (hasPrimaryInputs && !hasMismatch) {
      try {
        const generatedPassword = await window.q3_generate_password(pw1, dom1);
        showPasswordResult(resultElement, resultIndexElement, generatedPassword);

        if (extension) {
          const extendedPassword = await window.q3_generate_password(pw1, `${dom1}${extension}`);
          extendedResultContainer.style.display = 'block';
          showPasswordResult(extendedResultElement, extendedResultIndexElement, extendedPassword);
        } else {
          resetExtendedResult();
        }

        if (hardModeEnabled) {
          hardResultContainer.style.display = 'block';
          try {
            const hardModePassword = await generateHardModePassword(pw1, dom1);
            showPasswordResult(hardResultElement, hardResultIndexElement, hardModePassword);
          } catch (error) {
            clearPasswordResult(hardResultElement, hardResultIndexElement, errorText, 'red');
            console.error('Error generating hard mode password:', error);
          }
        } else {
          resetHardResult();
        }
      } catch (error) {
        clearPasswordResult(resultElement, resultIndexElement, errorText, 'red');
        resetExtendedResult();
        resetHardResult();
        console.error(error);
      }
    } else if (!hasPrimaryInputs) {
      clearPasswordResult(resultElement, resultIndexElement, placeholderText);
      resetExtendedResult();
      if (hardModeEnabled) {
        hardResultContainer.style.display = 'block';
        clearPasswordResult(hardResultElement, hardResultIndexElement, placeholderText);
      } else {
        resetHardResult();
      }
    } else {
      const mismatchMessage = getMismatchMessage(passwordMismatch, domainMismatch);
      clearPasswordResult(resultElement, resultIndexElement, mismatchMessage, 'red');
      resetExtendedResult();
      if (hardModeEnabled) {
        hardResultContainer.style.display = 'block';
        clearPasswordResult(hardResultElement, hardResultIndexElement, mismatchMessage, 'red');
      } else {
        resetHardResult();
      }
    }
  }

  async function update() {
    await resultDisplay();
  }

  function fallbackCopyToClipboard(text, onSuccess) {
    const textArea = document.createElement('textarea');
    textArea.value = text;

    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    textArea.style.left = '0';
    textArea.style.top = '0';

    document.body.appendChild(textArea);

    if (navigator.userAgent.match(/ipad|ipod|iphone/i)) {
      const editable = textArea.contentEditable;
      const readOnly = textArea.readOnly;

      textArea.contentEditable = true;
      textArea.readOnly = false;

      const range = document.createRange();
      range.selectNodeContents(textArea);

      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);

      textArea.setSelectionRange(0, 999999);

      textArea.contentEditable = editable;
      textArea.readOnly = readOnly;
    } else {
      textArea.select();
    }

    try {
      document.execCommand('copy');
      onSuccess();
    } catch (error) {
      console.error('Failed to copy text: ', error);
      alert('Could not copy password. Please long-press and copy manually.');
    }

    document.body.removeChild(textArea);
  }

  function showCopiedFeedback(resultContainerElement) {
    const originalPassword = resultContainerElement.dataset.rawPassword;

    resultContainerElement.textContent = 'Copied!';
    resultContainerElement.style.backgroundColor = '#d4edda';
    resultContainerElement.style.color = '#155724';
    resultContainerElement.style.borderColor = '#c3e6cb';

    setTimeout(() => {
      if (originalPassword) {
        resultContainerElement.textContent = formatPasswordForDisplay(originalPassword);
      }
      resultContainerElement.style.backgroundColor = '';
      resultContainerElement.style.color = '';
      resultContainerElement.style.borderColor = '';
    }, 1500);
  }

  function copyPassword(element) {
    const rawPassword = element.dataset.rawPassword;
    if (!rawPassword) {
      return;
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(rawPassword)
        .then(() => {
          showCopiedFeedback(element);
        })
        .catch(() => {
          fallbackCopyToClipboard(rawPassword, () => showCopiedFeedback(element));
        });
    } else {
      fallbackCopyToClipboard(rawPassword, () => showCopiedFeedback(element));
    }
  }

  hardModeToggleElement.checked = readHardModeCookie();

  document.getElementById('pw1').addEventListener('input', update);
  document.getElementById('pw2').addEventListener('input', update);
  document.getElementById('dom1').addEventListener('input', update);
  document.getElementById('dom2').addEventListener('input', update);
  document.getElementById('extension').addEventListener('input', update);
  hardModeToggleElement.addEventListener('change', () => {
    setHardModeCookie(hardModeToggleElement.checked);
    update();
  });

  resultElement.addEventListener('click', () => copyPassword(resultElement));
  extendedResultElement.addEventListener('click', () => copyPassword(extendedResultElement));
  hardResultElement.addEventListener('click', () => copyPassword(hardResultElement));

  update();
}

initUI();
