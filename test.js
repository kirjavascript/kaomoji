const { parser } = require('./main');

[
    `c($<3)`,
    `c(s'w')`,
    `c(.o$) **`,
    ``,
    `z()`,
    `z"(~~^)~~`,
    `v(.-)`,
    `v()*** *!`,
    `h'hs' a'vaportext' ~~ \`2qlw\``,
    ``,
    `s(a*())`,
    ``,
    `f£(C())`,
    ``,
    `f!(d()?f'Dangle')`,
].forEach(case_ => {
    console.log(case_.padEnd(30), parser(case_))
});

console.log(' ');

['qw', 'asdf', 'zxcv']
    .forEach(d => {
        console.log([...d].map(f => `${f}: ${parser(`${f}()`)}`).join` `)
    });
