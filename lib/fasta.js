"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.realignFasta = realignFasta;
exports.reverseComplement = reverseComplement;
exports.fastaToString = fastaToString;
exports.parse = parse;
exports.isAllowed = isAllowed;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/*
 * fasta.js
 */

/**
 * @typedef {Object} Fasta
 * @property {string} description
 * @property {string} data
 * @property {boolean} [isReversed]
 */

/**
 * @typedef {Object} ValidationResult<T>
 * @property {boolean} ok
 * @property {T} result
 */

/**
 * @param {Fasta} fasta
 * @param {string} sequence
 * @returns {ValidationResult<Fasta>}
 */
function realignFasta(fasta, sequence) {
  var index = fasta.data.indexOf(sequence);
  var isReversed = false;
  var conversionsRef = {
    value: 0
  };

  if (index === -1) {
    var reverseSequence = reverseComplement(sequence);
    index = fasta.data.indexOf(reverseSequence);
    isReversed = true;
  }

  if (index === -1) {
    return {
      ok: false,
      result: undefined
    };
  }

  var input = isReversed ? reverseComplement(fasta.data, conversionsRef) : fasta.data;
  if (isReversed) index = fasta.data.length - index - sequence.length;
  var newSequence = input.slice(index) + input.slice(0, index);
  return {
    ok: true,
    result: _objectSpread(_objectSpread({}, fasta), {}, {
      data: newSequence,
      isReversed: isReversed,
      conversions: conversionsRef.value
    })
  };
}

function reverseComplement(sequence) {
  var conversionsRef = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  return Array.from(sequence.replace(/./g, function (_char) {
    switch (_char) {
      case 'A':
        return 'T';

      case 'T':
        return 'A';

      case 'G':
        return 'C';

      case 'C':
        return 'G';

      default:
        if (conversionsRef !== null) conversionsRef.value += 1;
        return 'N';
    }
  })).reverse().join('');
}
/**
 * @param {Fasta} fasta
 * @returns {string} fasta file string
 */


function fastaToString(fasta) {
  var LINE_LENGTH = 70;
  var result = '>' + fasta.description + '\n';
  var i;

  for (i = 0; i + LINE_LENGTH < fasta.data.length; i += LINE_LENGTH) {
    result += fasta.data.slice(i, i + LINE_LENGTH) + '\n';
  }

  result += fasta.data.slice(i);
  return result;
}

function parse(text) {
  var lines = text.split('\n');
  if (!lines[0] || !lines[0].startsWith('>')) return failWith('file does not start with ">"');
  var sequences = [];
  var sequence = undefined;

  for (var i in lines) {
    var line = lines[i];

    if (line.startsWith('>')) {
      if (sequence) sequences.push(sequence);
      sequence = {
        description: line.slice(1),
        data: ''
      };
    } else if (isAllowedOrEmpty(line)) {
      if (!sequence) return failWith("data with no sequence identifier at line ".concat(i));
      sequence.data += line.toUpperCase();
    } else {
      return failWith("invalid input at line ".concat(i));
    }
  }

  if (sequence) sequences.push(sequence);
  return {
    ok: true,
    error: undefined,
    result: sequences
  };
}

function failWith(message) {
  return {
    ok: false,
    error: new Error('Invalid fasta file: ' + message),
    result: undefined
  };
}

function isAllowed(text) {
  for (var i = 0; i < text.length; i++) {
    if (!isAllowedCode(text.charCodeAt(i))) return false;
  }

  return true;
}

function isAllowedOrEmpty(text) {
  if (text.length === 0) return true;
  return isAllowed(text);
}

function isAllowedCode(code) {
  if (code >= 65
  /* A */
  && code <= 78
  /* N */
  || code >= 80
  /* P */
  && code <= 90
  /* Z */
  || code >= 97
  /* a */
  && code <= 110
  /* n */
  || code >= 112
  /* p */
  && code <= 122
  /* z */
  || code === 42
  /* * */
  || code === 45
  /* - */
  ) return true;
  return false;
}
/*
   Fasta format allowed chars:

        A  adenosine          C  cytidine             G  guanine
        T  thymidine          N  A/G/C/T (any)        U  uridine
        K  G/T (keto)         S  G/C (strong)         Y  T/C (pyrimidine)
        M  A/C (amino)        W  A/T (weak)           R  G/A (purine)
        B  G/T/C              D  G/A/T                H  A/C/T
        V  G/C/A              -  gap of indeterminate length

  For those programs that use amino acid query sequences (BLASTP and TBLASTN), the accepted amino acid codes are:

        A  alanine               P  proline
        B  aspartate/asparagine  Q  glutamine
        C  cystine               R  arginine
        D  aspartate             S  serine
        E  glutamate             T  threonine
        F  phenylalanine         U  selenocysteine
        G  glycine               V  valine
        H  histidine             W  tryptophan
        I  isoleucine            Y  tyrosine
        K  lysine                Z  glutamate/glutamine
        L  leucine               X  any
        M  methionine            *  translation stop
        N  asparagine            -  gap of indeterminate length
*/