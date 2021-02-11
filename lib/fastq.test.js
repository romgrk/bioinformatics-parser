"use strict";

/*
 * fastq.test.js
 */

/* global describe, test, expect */
var fs = require('fs');

var _require = require('./fastq'),
    parse = _require.parse;

var textValid = fs.readFileSync("".concat(__dirname, "/../assets/example_input.fq")).toString();
var textInvalid = fs.readFileSync(__filename).toString();
describe('Fastq.parse()', function () {
  test('works with fastq files', function () {
    var result = parse(textValid);
    expect(result.ok).toEqual(true);
    expect(result.error).toEqual(undefined);
    expect(result.result.length).toEqual(50000);
  });
  /* test('works with bad fastq files', () => {
   *   const result = parse(textValid)
   *   console.log(result.error)
   *   expect(result.ok).toEqual(true)
   *   expect(result.error).toEqual(undefined)
   *   expect(result.result.length).toEqual(50000)
   * }) */

  test('works with bad files', function () {
    var result = parse(textInvalid);
    expect(result.ok).toEqual(false);
    expect(result.error).toBeInstanceOf(Error);
    expect(result.result).toEqual(undefined);
  });
});