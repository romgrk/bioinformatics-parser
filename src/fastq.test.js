/*
 * fastq.test.js
 */
/* global describe, test, expect */

const fs = require('fs')
const { parse, } = require('./fastq')

const textValid   = fs.readFileSync(`${__dirname}/../assets/example_input.fq`).toString()
const textInvalid = fs.readFileSync(__filename).toString()


describe('Fastq.parse()', () => {

  test('works with fastq files', () => {
    const result = parse(textValid)
    expect(result.ok).toEqual(true)
    expect(result.error).toEqual(undefined)
    expect(result.result.length).toEqual(50000)
  })

  /* test('works with bad fastq files', () => {
   *   const result = parse(textValid)
   *   console.log(result.error)
   *   expect(result.ok).toEqual(true)
   *   expect(result.error).toEqual(undefined)
   *   expect(result.result.length).toEqual(50000)
   * }) */

  test('works with bad files', () => {
    const result = parse(textInvalid)
    expect(result.ok).toEqual(false)
    expect(result.error).toBeInstanceOf(Error)
    expect(result.result).toEqual(undefined)
  }) 
})
