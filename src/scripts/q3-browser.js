/**
 * JavaScript implementation of q3.py functionality as an ES module
 * 
 * This must match the Python implementation in q3.py (which is the key source)
 * You can test the match by running `test_q3.js`
 *
 * 
 */

// A modern, secure replacement for the hex_sha512 function
async function secure_sha512_hex(str) {
  const textEncoder = new TextEncoder();
  const data = textEncoder.encode(str);
  const hashBuffer = await window.crypto.subtle.digest('SHA-512', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  // Convert bytes to a hex string
  const hexHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hexHash;
}

// Helper function to check if password meets requirements
function pwMeetsRequirements(pw) {
  const hasUpper = /[A-Z]/.test(pw);
  const hasLower = /[a-z]/.test(pw);
  const hasDigit = /[0-9]/.test(pw);
  const hasSymbol = /[!@#$%^&*()\-_=+\[\]{}|;:,.<>?\/]/.test(pw);
  // Check the password does not contain commonly banned characters
  const bannedChars = new Set(['\'', '"', '\\', '`', '~', '?', '@']);
  for (let i = 0; i < pw.length; i++) {
    if (bannedChars.has(pw[i])) {
      return false;
    }
  }
  return hasUpper && hasLower && hasDigit && hasSymbol;
}

// Helper function to get password from hash
function _getPassword(hexDigest) {
  const b64 = python_b64encode(hexDigest);
  const res = b64.slice(5, 5+12) + '!'; 
  return res;
}


// Main function to generate password from domain and master password
async function go(domain, pw) {
  let cumulativeInput = `${pw}!@#` + domain;

  // First password generation
  let hexDigest = await secure_sha512_hex(cumulativeInput);
  let res = _getPassword(hexDigest);

  // Second password generation
  cumulativeInput += res;
  hexDigest = await secure_sha512_hex(cumulativeInput);
  res = _getPassword(hexDigest);

  // Continue generating passwords until one meets the requirements.
  while (!pwMeetsRequirements(res)) {
    cumulativeInput += res;
    hexDigest = await secure_sha512_hex(cumulativeInput);
    res = _getPassword(hexDigest);
  }

  return res;
}


// ----------------
// helper functions
// ----------------

/**
 * function equivalent to base64.b64encode in Python
 */
function python_b64encode(str) {
    return base64ArrayBuffer(str2ab(str));
}

/**
 * convert string to array buffer
 * modified from:
 * http://stackoverflow.com/questions/6965107/converting-between-strings-and-arraybuffers
 * note that we're using Uint8Array where the author uses Uint16Array
 */
function str2ab(str) {
  var buf = new ArrayBuffer(str.length); // 1 byte for each char
  var bufView = new Uint8Array(buf);
  for (var i=0, strLen=str.length; i<strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

/**
 * convert arrayBuffer to base64
 * http://stackoverflow.com/questions/7370943/retrieving-binary-file-content-using-javascript-base64-encode-it-and-reverse-de?rq=1
 * https://gist.github.com/958841
 */
function base64ArrayBuffer(arrayBuffer) {
  var base64    = ''
  var encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'

  var bytes         = new Uint8Array(arrayBuffer)
  var byteLength    = bytes.byteLength
  var byteRemainder = byteLength % 3
  var mainLength    = byteLength - byteRemainder

  var a, b, c, d
  var chunk

  // Main loop deals with bytes in chunks of 3
  for (var i = 0; i < mainLength; i = i + 3) {
    // Combine the three bytes into a single integer
    chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2]

    // Use bitmasks to extract 6-bit segments from the triplet
    a = (chunk & 16515072) >> 18 // 16515072 = (2^6 - 1) << 18
    b = (chunk & 258048)   >> 12 // 258048   = (2^6 - 1) << 12
    c = (chunk & 4032)     >>  6 // 4032     = (2^6 - 1) << 6
    d = chunk & 63               // 63       = 2^6 - 1

    // Convert the raw binary segments to the appropriate ASCII encoding
    base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d]
  }

  // Deal with the remaining bytes and padding
  if (byteRemainder == 1) {
    chunk = bytes[mainLength]

    a = (chunk & 252) >> 2 // 252 = (2^6 - 1) << 2

    // Set the 4 least significant bits to zero
    b = (chunk & 3)   << 4 // 3   = 2^2 - 1

    base64 += encodings[a] + encodings[b] + '=='
  } else if (byteRemainder == 2) {
    chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1]

    a = (chunk & 64512) >> 10 // 64512 = (2^6 - 1) << 10
    b = (chunk & 1008)  >>  4 // 1008  = (2^6 - 1) << 4

    // Set the 2 least significant bits to zero
    c = (chunk & 15)    <<  2 // 15    = 2^4 - 1

    base64 += encodings[a] + encodings[b] + encodings[c] + '='
  }

  return base64
}




// Export the go function as default
export default go;