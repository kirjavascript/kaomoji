const {
    str,
    char,
    digits,
    possibly,
    sequenceOf,
    either,
    regex,
    anyOfString,
    many1,
    choice,
    whitespace,
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

// K, count

// uuu

// (*< )

const parser = many1(choice([
    H, K,
    asciiCode,
    whitespace,
])).map(arr => arr.join(''));

// TODO collect everything after it stops parsing

console.log(parser.run(`
    K2@x1f996 @97
`))

// const cute = str('cute').map(() => '(◕‿◕✿)').run('cute')
// console.log(cute);
