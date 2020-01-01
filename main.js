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
    delim('@p', "'").map(ch => ch.codePointAt(0).toString(36)),
    delim('@', "'").map(ch => String.fromCodePoint(parseInt(ch, 36))),
]);
// 🦖

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
const boldItalic = [...'𝓐𝓑𝓒𝓓𝓔𝓕𝓖𝓗𝓘𝓙𝓚𝓛𝓜𝓝𝓞𝓟𝓠𝓡𝓢𝓣𝓤𝓥𝓦𝓧𝓨𝓩𝓪𝓫𝓬𝓭𝓮𝓯𝓰𝓱𝓲𝓳𝓴𝓵𝓶𝓷𝓸𝓹𝓺𝓻𝓼𝓽𝓾𝓿𝔀𝔁𝔂𝔃'];
const dia = 'ÄßÇÐÈ£GHÌJKLMñÖþQR§†ÚVW×¥Zåß¢Ðê£ghïjklmñðþqr§†µvwx¥z'

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

const fliptext = delim('f', `'`).map(str => (
    [...str].reverse().map(ch => flipped[ch] || ch).join``
));

// charmaps

const charmap = (trigger, lookup, _default = trigger) => (
    sequenceOf([
        str(trigger),
        possibly(choice(Object.keys(lookup).map(str))),
    ]).map(([_, key]) => key ? lookup[key] : _default)
);

const star = charmap('*', {
    '**': '⊃━☆ﾟ.*･｡',
    '!': '🎉',
    '"': '✴',
    '£': '✯',
    '*': '★',
    '+': '✧',
});

const heart = charmap('<3', {
    '!': '♥',
    '"': '❥',
}, '❤');

const tilde = charmap('~', {
    '~': '～',
    '`': '～́̀',
});

const script = recursiveParser(() => possibly(many1(choice([
    // text replacement
    convertText('a', aesthetic),
    convertText('s', sup),
    convertText('i', italic),
    convertText('bi', boldItalic),
    convertText('d', dia),
    fliptext, // f
    // faces
    cute,
    sad,
    cool,
    ohno,
    // charsets
    star,
    heart,
    tilde,
    // misc
    str(':shrug:').map(() => '¯\\_(ツ)_/¯'),
    str(':lambda:').map(() => 'λ'),
    str(':party:').map(()=> '🎉'),
    str(':egg:').map(()=> '🥚'),
    str('ZWJ').map(()=> String.fromCharCode(0x200b)),
    str('BELL').map(()=> String.fromCharCode(0x7)),
    H, K,
    asciiCode,
    whitespace,
    text,
    oneChar,
]))))
    .map(arr => arr ? arr.join('') : '');

const or = (obj, def) => (obj == null ? def : obj);

const face = (ident) => sequenceOf([
    sequenceOf([ident, char('(')]).map(([ident]) => ident),
    possibly(sequenceOf([script, char('^')]).map(([str])=>str)),
    script,
    possibly(sequenceOf([char('$'), script]).map(([_, str])=>str)),
    char(')'),
]).map(([name, left, center, right]) => ({
    name, left, center, right,
}));

const cute = face(anyOfString('cC')).map(({ name, left, center, right }) => {
    const eye = name == 'C' ? '◔' : '◕';
    return `(${or(left, '')}${eye}${center || '◡'}${eye}${or(right, '✿')})`;
});

const sad = face(char('s')).map(({ center }) => {
    return `ʘ${center || '︵'}ʘ`;
});

const cool = face(str('cool')).map(({ left, center, right }) => {
    return `(${or(left, '⌐')}■${center || '_'}■${or(right, '')})`;
});

const ohno = face(str('ohno')).map(({ left, center, right }) => {
    return `\\(${or(left, '')}\`${center || '⌒'}´${or(right, 'メ')})ノ`;
});

// map moods to keyboard keys
// https://www.vaporwavetextgenerator.com/
// https://beautifuldingbats.com/aesthetic-text-generator/
// http://kaomoji.ru/en/

// <> direction / arms
// .o(..)
//
// actually

// expr

// const expr = many1(anyOfString(`0123456789+-/*xob^&|`)).map(eval);

function parser(str) {
    const { result, index } = script.run(str);
    return str.length == index ? result : result + '// ' + str.slice(index);
}

module.exports = { parser };

console.log(parser(`
    *
    :shrug:
    f'Dangle'
    s()
    c()
    c(s'w')
    c(.o)
    c() i'TODO: wand' <3
    c($) KK
    c(.~^).~
    :egg:
`))

// console.log(script.run(`
//     s'(owo)'
//     K2A'dino'@x1f996
//     egg
//     \`asda\`
//     \`\\\`\`
//     .\`
//     ~~\`
//     .@
//     <3
//     @97
// `).result)
//
/*
TODO;

～
(っ⌒‿⌒)っ~
(✿◠‿◠)っ~
( ＾◡＾)っ~
( ´・‿-) ~
(Ɔ ˘⌣˘) ~
(◕‿◕)♡
//(◕‿◕✿)

(◔◡◔)⊃━☆ﾟ.*･｡

const faces = [ '(◕ᴗ◕✿)', '(◕◡◕✿)', '(◔◡◔✿)', '(｡◕‿◕｡✿)', '(◡‿◡✿)', '(◠‿◠✿)', '(◕ܫ◕✿)', '(◕▿◕✿)', '(◕ ワ ◕✿)' ];
(~˘▾˘)~
sparks
wand
qt

convert normal smileys

‿◡ᴗ
︶ᵕ˘
ᵔ
﹏ω꒳ɜε３
°Ｏ〇
〜～́̀
♪♬♫
❤
✿
￣¯
⁽⁾
^´Y∀▽*٩◕‿｡۶☆≧≦⌒<>。･―ヽ・ﾉ•゛°＠＾_彡人ﾟ∑╰▔╯─＼／⁽⁾ノっς/ヮ〃❛‾๑˃˂ﻭ˙꒦ິີ˖◝⁰▿◜„֊⁀ᗢ￢¬♡зμ､○ღ⌣ｏ³ԅσ⇀3↼ЗɔˆΣ→ゞ⁄ಡงืวヾДρ、ゝ~；ーд╥＞＜#＃|□」ｍロ＿︹︺ヘ﹌︿凸ツ‸‶ᗒᗣᗕ՞눈Uメ╬ψ皿益△∇ﾞ‵ﾒﾛ┌∩┐◣◢▼ㅂへ҂‡ʘÒÓಠ↑ΦΨ←ｰ∈୧୨ఠಥТ゜︵，个ˍつ̩╭╮〒×＋[±]ཀ∠シ″︴{}º〣Δ▓▒░ˇ‘　ᕕᐛᕗ?ิ◎ლ٥⊙౦０づ⊃ʖ⊂≡∂−ﾊ་།¨ﾍ┬┴┤├͜͡φ．〆=ミﾐ┘Z－∪ｪ①‥ฅㅅ❀ɪଲⓛᴥ˵◔ตｴʕʔˋェＵＴ●ᆺоΘθ◉◇ζ╱╲ರ⌓༼ل͟༽ᴼ౪☉八爻☞☜口︻デ═一…Qو三ڡ｢ð┻┳━∞占く¤✿ᄑ炎旦且♨二ｃ└√¸⌐■乁✺◟◞◖◗⊥Ю̯͠≖༎ຶٹˊ尸̲̅$﹃【】☂✂⋃фଘ੭ੈ✩‧₊˚
☂☔✈☀☼☁⚡⌁☇☈❄❅❆☃☉☄★☆☽☾⌛⌚⌂✆☎☏✉☑✓✔⎷⍻✖✗✘☒✕☓☕♿✌☚☛☜☝☞☟☹☺☻☯⚘☮⚰⚱⚠☠☢⚔⚓⎈⚒☡❂⚕⚖⚗✇☣⚙☤⚚⚜☥✝☦☧☨☩†☪☫☬☭✁✂✃✄✍✎✏✐✑✒✙✚✜✛♰♱✞✟✠✡☸✢✣✤✥✦✧✩✪✫✬✭✮✯✰✲✱✳✴✵✶✷✸✹✺✻✼✽✾❀✿❁❃❇❈❉❊❋⁕☘❦❧☙❢❣♀♂⚤⚦⚧⚨⚩☿♁⚯♛♕♚♔♜♖♝♗♞♘♟♙☗☖♠♣♦♥❤❥♡♢♤♧⚀⚁⚂⚃⚄⚅⚇⚆⚈⚉♨♩♪♫♬♭♮♯⏏⎗⎘⎙⎚⎇⌘⌦⌫⌧♲♳♴♵♶♷♸♹♻♼♽⁌⁍⎌⌇⍝⍟⍣⍤⍥⍨⍩⎋♃♄♅♆♇♈♉♊♋♌♍♎♏♐♑♒♓⏚⏛დღ♡❣❤❥❦❧♥☤☥☧☨☩☫☬☭☯☽☾✙✚✛✜✝✞✟✠✡✢卍卐


*/
