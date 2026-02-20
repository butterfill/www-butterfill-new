import setupArgon2idWasm from 'argon2id/lib/setup.js';
import argon2idSimdWasmUrl from 'argon2id/dist/simd.wasm?url';
import argon2idNoSimdWasmUrl from 'argon2id/dist/no-simd.wasm?url';
import generatePassword from './q3-browser.js';

const HARD_MODE_COOKIE_NAME = 'q3_hashme_hard_mode';
const HARD_MODE_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;
const HARD_MODE_DEBOUNCE_MS = 350;
const HARD_MODE_CONTEXT = 'hashme-hard-mode-v2';

const textEncoder = new TextEncoder();
let argon2idPromise;

function getArgon2id() {
  if (!argon2idPromise) {
    argon2idPromise = setupArgon2idWasm(
      (importObject) => instantiateWasmFromUrl(argon2idSimdWasmUrl, importObject),
      (importObject) => instantiateWasmFromUrl(argon2idNoSimdWasmUrl, importObject),
    );
  }
  return argon2idPromise;
}

async function instantiateWasmFromUrl(wasmUrl, importObject) {
  const response = await fetch(wasmUrl);

  if (WebAssembly.instantiateStreaming) {
    try {
      return await WebAssembly.instantiateStreaming(response, importObject);
    } catch {
      // Some browsers/CDNs serve wasm with a non-wasm content-type.
      // In that case we fall back to ArrayBuffer instantiation.
    }
  }

  const wasmBytes = await response.arrayBuffer();
  return WebAssembly.instantiate(wasmBytes, importObject);
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
  const all = uppercase + lowercase + digits + symbols;
  const source = { bytes, index: 0 };
  const chars = [
    pickCharUnbiased(uppercase, source),
    pickCharUnbiased(lowercase, source),
    pickCharUnbiased(digits, source),
    pickCharUnbiased(symbols, source),
  ];

  while (chars.length < 13) {
    chars.push(pickCharUnbiased(all, source));
  }

  for (let i = chars.length - 1; i > 0; i -= 1) {
    const swapIndex = pickIntUnbiased(i + 1, source);
    const temp = chars[i];
    chars[i] = chars[swapIndex];
    chars[swapIndex] = temp;
  }

  return chars.join('');
}

function pickCharUnbiased(alphabet, source) {
  return alphabet[pickIntUnbiased(alphabet.length, source)];
}

function pickIntUnbiased(range, source) {
  if (range <= 0 || range > 256) {
    throw new Error(`Invalid unbiased range: ${range}`);
  }
  const threshold = Math.floor(256 / range) * range;
  while (source.index < source.bytes.length) {
    const candidate = source.bytes[source.index];
    source.index += 1;
    if (candidate < threshold) {
      return candidate % range;
    }
  }
  throw new Error('Insufficient entropy while mapping hard mode password characters');
}

function canonicalizeDomainForHardMode(domainInput) {
  const trimmed = domainInput.trim();
  if (!trimmed) {
    return '';
  }

  try {
    const withScheme = /^[a-z][a-z0-9+.-]*:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    const parsed = new URL(withScheme);
    return parsed.hostname.toLowerCase().replace(/\.+$/, '');
  } catch {
    return trimmed.toLowerCase().replace(/\.+$/, '');
  }
}

async function deriveHardModeSalt(domainInput) {
  const canonicalDomain = canonicalizeDomainForHardMode(domainInput);
  const saltMaterial = `${HARD_MODE_CONTEXT}:salt:${canonicalDomain}`;
  const digest = await crypto.subtle.digest('SHA-256', textEncoder.encode(saltMaterial));
  return new Uint8Array(digest).slice(0, 16);
}

async function generateHardModePassword(masterPassword, domain) {
  const canonicalDomain = canonicalizeDomainForHardMode(domain);
  const passwordMaterial = `${HARD_MODE_CONTEXT}:password:${masterPassword}\u0000${canonicalDomain}`;
  const passwordSeed = await crypto.subtle.digest('SHA-256', textEncoder.encode(passwordMaterial));
  const salt = await deriveHardModeSalt(domain);

  const argon2id = await getArgon2id();
  const hash = argon2id({
    password: new Uint8Array(passwordSeed),
    salt,
    parallelism: 1,
    passes: 4,
    memorySize: 256 * 1024,
    tagLength: 128,
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
  let hardModeDebounceTimer = null;
  let hardModeGenerationId = 0;

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

  function clearHardResultForTyping() {
    if (!hardModeToggleElement.checked) {
      return;
    }
    hardModeGenerationId += 1;
    hardResultContainer.style.display = 'block';
    clearPasswordResult(hardResultElement, hardResultIndexElement, '');
  }

  async function resultDisplay({ includeHardMode = true } = {}) {
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
    const hasPrimaryInputs = Boolean(pw1);
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
          if (includeHardMode) {
            const generationId = ++hardModeGenerationId;
            try {
              const hardModePassword = await generateHardModePassword(pw1, dom1);
              if (generationId !== hardModeGenerationId) {
                return;
              }
              showPasswordResult(hardResultElement, hardResultIndexElement, hardModePassword);
            } catch (error) {
              if (generationId !== hardModeGenerationId) {
                return;
              }
              clearPasswordResult(hardResultElement, hardResultIndexElement, errorText, 'red');
              console.error('Error generating hard mode password:', error);
            }
          }
        } else {
          hardModeGenerationId += 1;
          resetHardResult();
        }
      } catch (error) {
        hardModeGenerationId += 1;
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
        if (includeHardMode) {
          clearPasswordResult(hardResultElement, hardResultIndexElement, placeholderText);
        }
      } else {
        hardModeGenerationId += 1;
        resetHardResult();
      }
    } else {
      const mismatchMessage = getMismatchMessage(passwordMismatch, domainMismatch);
      clearPasswordResult(resultElement, resultIndexElement, mismatchMessage, 'red');
      resetExtendedResult();
      if (hardModeEnabled) {
        hardResultContainer.style.display = 'block';
        if (includeHardMode) {
          clearPasswordResult(hardResultElement, hardResultIndexElement, mismatchMessage, 'red');
        }
      } else {
        hardModeGenerationId += 1;
        resetHardResult();
      }
    }
  }

  function scheduleHardModeRefresh() {
    if (hardModeDebounceTimer) {
      clearTimeout(hardModeDebounceTimer);
    }

    hardModeDebounceTimer = setTimeout(() => {
      resultDisplay({ includeHardMode: true });
    }, HARD_MODE_DEBOUNCE_MS);
  }

  async function update() {
    await resultDisplay({ includeHardMode: false });
    scheduleHardModeRefresh();
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
  document.getElementById('pw1').addEventListener('keydown', clearHardResultForTyping);
  document.getElementById('pw2').addEventListener('keydown', clearHardResultForTyping);
  document.getElementById('dom1').addEventListener('keydown', clearHardResultForTyping);
  document.getElementById('dom2').addEventListener('keydown', clearHardResultForTyping);
  document.getElementById('extension').addEventListener('keydown', clearHardResultForTyping);
  hardModeToggleElement.addEventListener('change', () => {
    setHardModeCookie(hardModeToggleElement.checked);
    resultDisplay({ includeHardMode: true });
  });

  resultElement.addEventListener('click', () => copyPassword(resultElement));
  extendedResultElement.addEventListener('click', () => copyPassword(extendedResultElement));
  hardResultElement.addEventListener('click', () => copyPassword(hardResultElement));

  update();
}

initUI();
