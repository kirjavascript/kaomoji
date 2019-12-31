const { parser } = require('./main');
const clipboardy = require('clipboardy');
const {
    QMainWindow,
    QWidget,
    QLabel,
    FlexLayout,
    WindowType,
    QLineEdit,
} = require('@nodegui/nodegui');

const win = new QMainWindow();
const setTitle = (str) => {
    win.setWindowTitle('kaoscript' + (str ? ` - ${str}` : ''));
};
setTitle();
win.setGeometry(0, 0, 400, 25);
win.center();
win.setWindowFlag(WindowType.Dialog, true);

const centralWidget = new QWidget();
centralWidget.setObjectName('root');
const rootLayout = new FlexLayout();
centralWidget.setLayout(rootLayout);

const input = new QLineEdit();
input.setObjectName('input');
rootLayout.addWidget(input);

input.addEventListener('textChanged', (e) => {
    setTitle(parser(e));
})

input.addEventListener('returnPressed', () => {
    if (input.text()) {
        clipboardy.writeSync(parser(input.text()));
    }
    process.exit();
})

win.setCentralWidget(centralWidget);
win.setStyleSheet(
    `
    #root {
        background-color: steelblue;
        align-items: 'center';
        justify-content: 'center';
        padding: 0;
        margin: 0;
    }
    #input {
        width: 400px;
        padding: 0;
        margin: 0;
        background-color: steelblue;
        color: white;
        border: none;
        font-size: 32px;
    }
  `,
);
win.show();
