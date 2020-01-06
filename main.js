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
    delim('@', "'").map(ch => {
        if (!ch) return '✖';
        const code = ch.codePointAt(0);
        return `${code}-0x${code.toString(16)}-${code.toString(36)}`;
    }),
    delim('', '`').map(ch => String.fromCodePoint(parseInt(ch || 0, 36))),
]);

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

const charset = (start, length) => Array.from({ length }, (_, i) => String.fromCodePoint(start + i)).join``;

const zGroups = [ '̍̎̄̅̿̑̆̐͒͗͑̇̈̊͂̓̈́͊͋͌̃̂̌͐̀́̋̏̒̓̔̽̉ͣͤͥͦͧͨͩͪͫͬͭͮͯ̾͛͆̚', '̴̵̶̡̢̧̨̛̀́̕͘͏̸̷͜͟͢͝͞͠͡҉', '̖̗̘̙̜̝̞̟̠̤̥̦̩̪̫̬̭̮̯̰̱̲̳̹̺̻̼͇͈͉͍͎͓͔͕͖͙͚̣ͅ'
]; // needs to be on another line so it doesnt break my syntax highlighting

const toZalgo = (str) => {
    const r = v => 0|Math.random()*v;
    const counts = [r(8) + 1, r(3), r(8) + 1];
    return [...str].flatMap((ch) => (
        [ch, ...zGroups.flatMap((charset, i) => [...Array(counts[i])].map(() => charset[r(charset.length - 1)]))]
    )).join``;
};

const textReplacement = choice([
    delim('t', "'"), // none
    convertText('i', italic),
    convertText('bi', boldItalic),
    convertText('s', sup),
    convertText('d', dia),
    convertText('a', aesthetic),
    convertText('h', charset(0x3041, 83)), // hiragana
    convertText('k', charset(0x4e00, 0x89a0)), // kanji
    delim('z', "'").map(toZalgo),
    fliptext, // f
]);

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
    '$': '🗲',
    '#': '✿',
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

const emotes = charmap(':', {
    ')': 'ツ',
});

const script = recursiveParser(() => possibly(many1(choice([
    textReplacement,
    faces,
    // charsets
    star,
    heart,
    tilde,
    emotes,
    // misc
    asciiCode,
    whitespace,
    sequenceOf([ char('.'), regex(/^./) ]).map(([_, c]) => c), // oneChar
    str('ZWJ').map(()=> String.fromCharCode(0x200b)),
    str('BELL').map(()=> String.fromCharCode(0x7)),
]))))
    .map(arr => arr ? arr.join('') : '');

const face = (ident) => (fn) => sequenceOf([
    sequenceOf([
        ident,
        many(anyOfString('!"£*')),
        char('('),
    ]),
    possibly(sequenceOf([script, char('^')]).map(([str])=>str)),
    script,
    possibly(sequenceOf([char('$'), script]).map(([_, str])=>str)),
    possibly(sequenceOf([char('?'), script]).map(([_, str])=>str)),
    char(')'),
]).map(([[name, mods], left, center, right, optional ]) => {
    const pound = mods.includes('£');
    const hideWrap = mods.includes('*') || pound;
    const hideArms = mods.includes('"');
    const hideFace = (str) => (mods.includes('!') || pound) ? '' : str;
    const face = fn({
        name,
        dir: /[A-Z]/.test(name),
        left: (def) => left == null ? hideFace(def) : left,
        eye: (str) => hideFace(str),
        center: (def) => center || hideFace(def),
        right: (def) => right == null ? hideFace(def) : right,
        arm: (str) => hideArms ? '' : str,
        wrap: (str) => hideWrap ? str.join`` : `(${str.join``})`,
        obj: (str) => optional == null ? str : optional,
    })
    return Array.isArray(face) ? face.join`` : face;
});

const cute = face(anyOfString('cC'))(({ dir, left, right, center, wrap, eye }) => {
    const eye_ = eye(dir ? '◔' : '◕');
    const left_ = dir ? '✿' : undefined;
    const right_ = dir ? undefined : '✿';
    return wrap([left(left_), eye_, center('◡'), eye_, right(right_)]);
});

const cool = face(char('x'))(({ left, center, right, wrap, eye }) => {
    return wrap([left('⌐'), eye('■'), center('_'), eye('■'), right()]);
});

const sad = face(char('a'))(({ center, eye }) => {
    return [eye(`ʘ`), center('︵'), eye(`ʘ`)];
});

const lod = face(char('d'))(({ center, eye }) => {
    return [eye(`ಠ`), center('_'), eye(`ಠ`)];
});

const actually = face(char('z'))(({ left, center, right, wrap, arm, eye }) => {
    return [wrap([left(arm('~')), eye('˘'), center('▾'), eye('˘'), right()]), arm('~')];
});

const shrug = face(char('s'))(({ left, center, right, wrap, arm }) => {
    return [arm(`¯\\_`), wrap([left(), center('ツ'), right()]), arm('_/¯')];
});

const lenny = face(char('v'))(({ left, center, right, wrap, eye }) => {
    return wrap([left(), eye(' ͡°'), center(' ͜ʖ'), eye(' ͡°'), right()]);
});


const flip = face(anyOfString('fF'))(({ dir, left, center, right, wrap, obj, arm, eye }) => {
    if (dir) {
        return [obj('┬──┬◡'), arm('ﾉ'), wrap([
            left(), eye('° '), center('-'), eye('°'), right(arm('ﾉ'))
        ])]
    }
    return [wrap([
        left(arm('╯')), eye('°'), center('□'), eye('°'), right()
    ]), arm(' ╯'), '︵ ', obj('┻━┻')]
});

const dumb = face(anyOfString('qQ'))(({ dir, left, right, center, wrap, eye, arm }) => {
    return [arm('ヘ '), wrap([
        left(), eye('°。'[+dir]), center('□'), eye('。°'[+dir]), right()
    ]), arm(' ヘ')];
});

const wizard = face(char('w'))(({ left, right, center, wrap, eye, arm, obj }) => {
    return [wrap([
        left(arm('∩')), eye('｀'), center('-'), eye('´'), right()
    ]), arm('⊃'), '━☆ﾟ.*･｡ﾟ ', obj('')];
});

const faces = choice([
    sad,
    lod,
    lenny,
    shrug,
    cool,
    actually,
    cute,
    flip,
    dumb,
    wizard,
]);

function parser(str) {
    const { result, index } = script.run(str);
    return str.length == index ? result : result + '// ' + str.slice(index);
}

module.exports = { parser };

// http://kaomoji.ru/en/
//https://cutekaomoji.com

// hex 2 rgb, rgb to hex, eval()

// say() speech bubble

/*
    qj λ
    2rtm 🥚
    2rva 🦖
    2qlw 🌴
    1e65 ﷽
*/

/*
～
(っ⌒‿⌒)っ~
(✿◠‿◠)っ~
( ＾◡＾)っ~
( ´・‿-) ~
(Ɔ ˘⌣˘) ~
(◕‿◕)♡
//(◕‿◕✿)
//
    happy: "(• ◡•)",
    ayy: "☜(ﾟヮﾟ)☜",
    love: "( ˘ ³˘)♥",
    lenny2: "( ͡º ͜ʖ ͡º)",
    wink: "( ͡~ ͜ʖ ͡°)",
    notes: "♪♫",

(◔◡◔)⊃━☆ﾟ.*･｡

const faces = [ '(◕ᴗ◕✿)', '(◕◡◕✿)', '(◔◡◔✿)', '(｡◕‿◕｡✿)', '(◡‿◡✿)', '(◠‿◠✿)', '(◕ܫ◕✿)', '(◕▿◕✿)', '(◕ ワ ◕✿)' ];
(~˘▾˘)~
sparks
wand
qt

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
