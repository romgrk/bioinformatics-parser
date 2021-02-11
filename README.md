
# bioinformatics-parser

Simple package to read and write fasta and fastq inputs.

Usage:

```javascript
const { fasta, fastq } = require('bioinformatics-parser')

const exampleFasta =
`>strain_1
NNNACGTACGCTAGCTACGTA
CAGCTAGCTAGCTACATNNNN
>strain_2
NNNACGTACGCTAGCTACGTA
CAGCTAGCTAGCTACATNNNN`

const { ok, error, result } = fasta.parse(exampleFasta)

console.log(result)
// => [
//   { description: 'strain_1',
//     data: 'NNNACGTACGCTAGCTACGTACAGCTAGCTAGCTACATNNNN' },
//   { ... },
// ]

const stringifiedFasta = fasta.stringify(result)
// `exampleFasta` might be different from `stringifiedFasta` because
// the line break length might be different, but the description and
// data stay the same

// NOTE: fastq only implements fastq.parse but not fastq.stringify,
//       if you need it open an issue.

```
