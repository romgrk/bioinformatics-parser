"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

/*
 * fasta.test.js
 */

/* global describe, test, expect */
var _require = require('./fasta.js'),
    fastaToString = _require.fastaToString,
    isAllowed = _require.isAllowed,
    parse = _require.parse,
    realignFasta = _require.realignFasta,
    reverseComplement = _require.reverseComplement;

var file1 = ">NZ_CP022077.1 Campylobacter jejuni subsp. jejuni strain FDAARGOS_263 chromosome, complete genome\nTTTTTCATCTACCAAAGAGTAAGCTCCGATTAAATCCCCAATTTCTATTGCTTCATATTTAGGAGTTTTT\nAAACCTTTTAAAAGAGTATTTTCAAGTTCATTTCTACCTATGATCATTTTAGCTCCATTGGGTAATCTTA\nAATGACGACCATATTTTAAAAGTTGTGCGTCATTAACCTGCATATCTTTGTCAAATTCTATGAAATCTCG\nATAGGAATTTCTTACATCTATCATTTCAAAATCTGCACCTA";
var file2 = ">file 2\nAAAAAAAAACCGTAAAAXXX";
var badFastaFile = ">TEST for a bad fasta file\nTCTTATGATTTTATCTTAAZZZZZZZZZZZZZZZZZOZZZZZZZZZZZZZZZCGATGCTACGTACGTACG\nTCTTATGATTTTATCTTAAAATCAGACTTAAAAGAGGAAACCACCCTAAAAGCTAGCATCTAGCATCTAG";
var badFile = 'I am a very bad file'; // Both come from file2

var startSequence = 'CGT';
var startSequenceRev = 'ACG';
describe('isAllowed()', function () {
  test('returns true with good input', function () {
    var result = isAllowed('ACBDFKLJFHLUAEHLU');
    expect(result).toBe(true);
  });
  test('returns false with bad letters input', function () {
    var result = isAllowed('ACBDFKLJFHLUAEHLUO');
    expect(result).toBe(false);
  });
  test('returns false with bad numbers input', function () {
    var result = isAllowed('AAAA7AAAA');
    expect(result).toBe(false);
  });
  test('returns false with bad chars input', function () {
    var result = isAllowed('AAAA AAAA');
    expect(result).toBe(false);
  });
});
describe('parse()', function () {
  test('works with fasta files', function () {
    var validation = parse(file1);
    expect(validation).toEqual({
      ok: true,
      error: undefined,
      result: [{
        description: 'NZ_CP022077.1 Campylobacter jejuni subsp. jejuni strain FDAARGOS_263 chromosome, complete genome',
        data: 'TTTTTCATCTACCAAAGAGTAAGCTCCGATTAAATCCCCAATTTCTATTGCTTCATATTTAGGAGTTTTTAAACCTTTTAAAAGAGTATTTTCAAGTTCATTTCTACCTATGATCATTTTAGCTCCATTGGGTAATCTTAAATGACGACCATATTTTAAAAGTTGTGCGTCATTAACCTGCATATCTTTGTCAAATTCTATGAAATCTCGATAGGAATTTCTTACATCTATCATTTCAAAATCTGCACCTA'
      }]
    });
  });
  test('works with bad fasta files', function () {
    var validation = parse(badFastaFile);
    expect(validation.ok).toBe(false);
    expect(validation.result).toBe(undefined);
    expect(validation.error).toBeInstanceOf(Error);
  });
  test('works with bad files', function () {
    var validation = parse(badFile);
    expect(validation.ok).toBe(false);
    expect(validation.result).toBe(undefined);
    expect(validation.error).toBeInstanceOf(Error);
  });
});
describe('reverseComplement()', function () {
  test('works', function () {
    expect(startSequence).toBe(reverseComplement(startSequenceRev));
  });
});
describe('realignFasta()', function () {
  test('works with original sequence', function () {
    var _parse = parse(file2),
        _parse$result = _slicedToArray(_parse.result, 1),
        fasta = _parse$result[0];

    var newFasta = realignFasta(fasta, startSequence);
    expect(newFasta).toEqual({
      ok: true,
      result: {
        description: fasta.description,
        data: 'CGTAAAAXXXAAAAAAAAAC',
        isReversed: false,
        conversions: 0
      }
    });
  });
  test('works with reversed sequence', function () {
    var _parse2 = parse(file2),
        _parse2$result = _slicedToArray(_parse2.result, 1),
        fasta = _parse2$result[0];

    var newFasta = realignFasta(fasta, startSequenceRev);
    expect(newFasta).toEqual({
      ok: true,
      result: {
        description: fasta.description,
        data: 'ACGGTTTTTTTTTNNNTTTT',
        isReversed: true,
        conversions: 3
      }
    });
  });
});
describe('fastaToString()', function () {
  test('works', function () {
    var _parse3 = parse(file1),
        _parse3$result = _slicedToArray(_parse3.result, 1),
        fasta = _parse3$result[0];

    var string = fastaToString(fasta);
    expect(string).toBe(file1);
  });
});