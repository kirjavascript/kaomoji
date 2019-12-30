// © 2042 do not steal

const {
    str,
    char,
    digits,
    possibly,
    sequenceOf,
    regex,
    anythingExcept,
    anyOfString,
    many1,
    many,
    choice,
    whitespace,
    between,
    recursiveParser,
} = require('arcsecond');

const delim = (prefix, surround) => (
    between(str(`${prefix}${surround}`))(char(surround)) (
        many(choice([
            str(`\\${surround}`).map(() => surround),
            anythingExcept(char(surround)),
        ]))
    ).map(arr => arr.join``)
);

// normal text

const text = delim('', '`');

const oneChar = sequenceOf([
    char('.'),
    regex(/^./),
]).map(([_, c]) => c);

// ascii

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

const charset = (start, length) => Array.from({ length }, (_, i) => String.fromCodePoint(start + i)).join``;

// japan

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

const H = takeRand('H', charset(0x3041, 83)); // hiragana
const K = takeRand('K', charset(0x4e00, 0x89a0)); // kanji


// text replacement

const normal = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789()';
const aesthetic = 'ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ０１２３４５６７８９';
const sup = 'ᴬᴮᶜᴰᴱᶠᴳᴴᴵᴶᴷᴸᴹᴺᴼᴾQᴿˢᵀᵁⱽᵂˣʸᶻᵃᵇᶜᵈᵉᶠᵍʰⁱʲᵏˡᵐⁿᵒᵖqʳˢᵗᵘᵛʷˣʸᶻ⁰¹²³⁴⁵⁶⁷⁸⁹⁽⁾';
const italic = [...'𝒜𝐵𝒞𝒟𝐸𝐹𝒢𝐻𝐼𝒥𝒦𝐿𝑀𝒩𝒪𝒫𝒬𝑅𝒮𝒯𝒰𝒱𝒲𝒳𝒴𝒵𝒶𝒷𝒸𝒹𝑒𝒻𝑔𝒽𝒾𝒿𝓀𝓁𝓂𝓃𝑜𝓅𝓆𝓇𝓈𝓉𝓊𝓋𝓌𝓍𝓎𝓏'];

const convertText = (name, charset) => {
    return (
        delim(name, `'`).map(str => (
            [...str].map(ch => charset[normal.indexOf(ch)] || ch).join``
        ))
    );
};

// flip

const flipped = { '∀': 'A', B: 'ꓭ', Ɔ: 'C', D: 'ꓷ', Ǝ: 'E', Ⅎ: 'F', פ: 'G', H: 'H', I: 'I', ſ: 'J', ʞ: 'K', '˥': 'L', W: 'M', N: 'N', O: 'O', Ԁ: 'P', Q: 'Ὸ', R: 'ꓤ', S: 'S', '┴': 'T', '∩': 'U', Λ: 'V', M: 'W', X: 'X', '⅄': 'Y', Z: 'Z', a: '\u0250', b: 'q', c: '\u0254', d: 'p', e: '\u01dd', f: '\u025f', g: 'ƃ', h: '\u0265', i: '\u0131', j: 'ɾ', k: 'ʞ', l: 'ן', m: '\u026f', n: 'u', o: 'o', p: 'd', q: 'b', r: '\u0279', s: 's', t: '\u0287', u: 'n', v: '\u028c', w: '\u028d', x: 'x', y: '\u028e', z: 'z', '0': '0', Ɩ: '1', ᄅ: '2', Ɛ: '3', ㄣ: '4', ϛ: '5', '9': '6', ㄥ: '7', '8': '8', '6': '9', '¿': '?', '¡': '!', '[': ']', '(': ')', '{': '}', "'": ',', '<': '>', '^': 'v', };

Object.entries(flipped).forEach(([k, v]) => {
    k in flipped || (flipped[k] = v);
});

const fliptext = delim('~', `'`).map(str => (
    [...str].reverse().map(ch => flipped[ch] || ch).join``
));

const parser = recursiveParser(() => many1(choice([
    // text replacement
    convertText('A', aesthetic),
    convertText('S', sup),
    convertText('I', italic),
    fliptext, // ~
    // faces
    cute,
    // charsets
    str('~`').map(() => '～́̀'),
    char('~').map(() => '～'),
    char('*').map(() => '✿'),
    str('<3').map(() => '❤'), // turn into Ncount
    // misc
    str(':shrug:').map(() => '¯\\_(ツ)_/¯'),
    str('egg').map(()=> '🥚'),
    char('D').map(() => ''+new Date),
    H, K,
    asciiCode,
    whitespace,
    text,
    oneChar,
])))
    .map(arr => arr.join(''));

const cute = between(str('c('))(char(')')) (
    sequenceOf([
        possibly(sequenceOf([parser, char('^')]).map(([str])=>str)),
        possibly(parser),
        possibly(sequenceOf([char('$'), parser]).map(([_, str])=>str)),
    ])
).map(([left, center, right]) => {
    return `(${left || ''}◕${center || '◡'}◕${right || ''})`;
});

// c() - make generic
// optional ^ and $ for non middle
// default face
// <> direction / arms
// .o(..)
// recursive

// charmap / Ncount
// 0 = normal
// overload * with multisets

// expr

const expr = many1(anyOfString(`0123456789+-/*xob^&|`)).map(eval);


console.log(parser.run(`
    :shrug:
    ~'Dangle'
    c()
    c(S'w')
    c(.o)
    c($*)
    c() I'TODO: wand' <3
    c(.~^).~
    egg
`).result)
console.log(parser.run(`
    S'(owo)'
    K2A'dino'@x1f996
    egg
    \`asda\`
    \`\\\`\`
    .\`
    ~~\`
    .@
    <3
    @97
`).result)
