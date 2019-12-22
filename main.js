const {
    str,
    char,
    digits,
    possibly,
    sequenceOf,
    regex,
    anythingExcept,
    many1,
    many,
    choice,
    whitespace,
    between,
} = require('arcsecond');

const asciiCode = choice([
    sequenceOf([
        str('@x'),
        regex(/^[0-9a-fA-F]+/g),
    ]).map(([_, h]) => String.fromCodePoint(parseInt(h, 16))),
    sequenceOf([
        char('@'),
        digits,
    ]).map(([_, d]) => String.fromCodePoint(d)),
]);

const hiragana = Array.from({ length: 83 }, (_, i) => (
    String.fromCharCode(0x3041 + i)
));

const kanji = Array.from({ length: 0x89A0 }, (_, i) => (
    String.fromCharCode(0x4e00 + i)
));

const takeRand = (type, charset) => {
    return sequenceOf([
        char(type),
        possibly(digits),
    ])
        .map(([_, n]) => (
            Array.from({ length: +n || 1 }, () => (
                charset[0|Math.random()*charset.length]
            )).join('')
        ));
}

const H = takeRand('H', hiragana);
const K = takeRand('K', kanji);

const text = between(char('`'))(char('`'))
    (many(anythingExcept(char('`'))))
    .map(arr => arr.join(''));

const oneChar = sequenceOf([
    char('.'),
    regex(/^./),
]).map(([_, c]) => c);

// c() - make generic

const parser = many1(choice([

    H, K,
    asciiCode,
    text,
    oneChar,
    whitespace,
]))
    .map(arr => arr.join(''));

// TODO collect everything after it stops parsing

console.log(parser.run(`
    \`asda\`
    .@
    K2@x1f996 @97
`))

// const cute = str('cute').map(() => '(◕‿◕✿)').run('cute')
// console.log(cute);
