/*
 * fastq.js
 */


export function parse(text) {
  const lines = text.trim().split('\n')

  if (lines.length % 4 !== 0)
    return failWith(`line length isn't a multiple of 4: ${lines.length}`)

  const entries = []

  for (let i = 0; i < lines.length; i += 4) {
    let identifier     = lines[i + 0]
    let sequence       = lines[i + 1]
    let identifierPlus = lines[i + 2]
    let quality        = lines[i + 3]

    if (!identifier.startsWith('@'))
      return failWith(`identifier line doesn't start with @ (line ${i + 1})`)
    else
      identifier = identifier.slice(1)

    if (!isAllowed(sequence))
      return failWith(`sequence line contains invalide characters (line ${i + 1})`)

    if (!identifierPlus.startsWith('+'))
      return failWith(`identifierPlus line doesn't start with @ (line ${i + 1})`)
    else
      identifierPlus = identifierPlus.slice(1)

    if (quality.length !== sequence.length)
      return failWith(`quality line length doesn't match sequence line length (line ${i + 1})`)

    entries.push({ identifier, sequence, identifierPlus, quality })
  }

  return {
    ok: true,
    error: undefined,
    result: entries,
  }
}

function failWith(message) {
  return {
    ok: false,
    error: new Error('Invalid fastq file: ' + message),
    result: undefined,
  }
}

function isAllowed(text) {
  for (let i = 0; i < text.length; i++) {
    if (!isAllowedCode(text.charCodeAt(i)))
      return false
  }
  return true
}

function isAllowedOrEmpty(text) {
  if (text.length === 0)
    return true
  return isAllowed(text)
}

function isAllowedCode(code) {
  // FIXME: is it only ATCG ofr fastq?
  if (
       (code >= 65 /* A */ && code <= 78 /* N */)
    || (code >= 80 /* P */ && code <= 90 /* Z */)
    || (code >= 97 /* a */ && code <= 110 /* n */)
    || (code >= 112 /* p */ && code <= 122 /* z */)
    || (code === 42 /* * */)
    || (code === 45 /* - */)
  )
    return true
  return false
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
