// © 2042 do not steal

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

// japan

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

// kao

const cute = between(str('c('))(char(')')) (

);
// chain

// c() - make generic
// optional ^ and $ for non middle
// <> direction
// recursive


// Ncount charset
// overload * with multisets

// text replacement

const normal = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789()';
const aesthetic = 'ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ０１２３４５６７８９';
const sup = 'ᴬᴮᶜᴰᴱᶠᴳᴴᴵᴶᴷᴸᴹᴺᴼᴾQᴿˢᵀᵁⱽᵂˣʸᶻᵃᵇᶜᵈᵉᶠᵍʰⁱʲᵏˡᵐⁿᵒᵖqʳˢᵗᵘᵛʷˣʸᶻ⁰¹²³⁴⁵⁶⁷⁸⁹⁽⁾';
const v = '𝒜𝐵𝒞𝒟𝐸𝐹𝒢𝐻𝐼𝒥𝒦𝐿𝑀𝒩𝒪𝒫𝒬𝑅𝒮𝒯𝒰𝒱𝒲𝒳𝒴𝒵𝒶𝒷𝒸𝒹𝑒𝒻𝑔𝒽𝒾𝒿𝓀𝓁𝓂𝓃𝑜𝓅𝓆𝓇𝓈𝓉𝓊𝓋𝓌𝓍𝓎𝓏';

const convertText = (name, charset) => {
    return (
        delim(name, `'`).map(str => (
            [...str].map(ch => charset[normal.indexOf(ch)] || ch).join``
        ))
    );
};

const parser = many1(choice([
    convertText('A', aesthetic),
    convertText('sup', sup),
    convertText('v', v),
    str(':shrug:').map(() => '¯\\_(ツ)_/¯'),
    str('~`').map(() => '～́̀'),
    char('~').map(() => '～'),
    str('egg').map(()=> '🥚'),
    char('D').map(() => ''+new Date),
    str('<3').map(() => '❤'), // turn into Ncount
    H, K,
    asciiCode,
    text,
    oneChar,
    whitespace,
]))
    .map(arr => arr.join(''));

// TODO collect everything after it stops parsing

console.log(parser.run(`
    K2A'dino'@x1f996
    sup'(owo)'
    :shrug:
    egg
`).result)
console.log(parser.run(`
    \`asda\`
    ~~\`
    .@
    <3
    @97
`))
