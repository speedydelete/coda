
import {createConnection, TextDocuments, ProposedFeatures, CompletionItemKind, TextDocumentSyncKind, InitializeParams} from 'vscode-languageserver/node';
import {TextDocument} from 'vscode-languageserver-textdocument';

let connection = createConnection(ProposedFeatures.all);
let documents = new TextDocuments(TextDocument);

connection.onInitialize((params: InitializeParams) => {
    connection.console.log('Coda LSP: onInitialize called');
    return {
        capabilities: {
            textDocumentSync: TextDocumentSyncKind.Incremental,
            completionProvider: {triggerCharacters: [' ', '.', ':']},
        },
    };
});

const KEYWORDS = [
    'if', 'else', 'while', 'for', 'return', 'enum', 'union', 'struct', 'fn', 'module', 'include', 'mut', 'defer', 'match', 'type',
    'int8', 'uint8', 'int16', 'uint16', 'int32', 'uint32', 'int64', 'uint64', 'float16', 'float32', 'float64',
    'true', 'false', 'none', 'null',
];

connection.onCompletion((params) => {
    connection.console.log('Coda LSP: onCompletion called at position ' + JSON.stringify(params.position));
    return KEYWORDS.map((k) => ({
        label: k,
        kind: CompletionItemKind.Keyword,
    }));
});

connection.onCompletionResolve(item => {
    item.detail = 'Coda keyword';
    item.documentation = `Docs for ${item.label}`;
    return item;
});

documents.onDidOpen(event => {
    connection.console.log('Coda LSP: document opened: ' + event.document.uri);
});

documents.listen(connection);
connection.listen();
