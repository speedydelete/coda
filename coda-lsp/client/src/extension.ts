
import * as path from 'path';
import {ExtensionContext} from 'vscode';
import {LanguageClient, TransportKind} from 'vscode-languageclient/node';

export async function activate(context: ExtensionContext) {
    let serverModule = context.asAbsolutePath(path.join('server', 'out', 'server.js'));
    let serverOptions = {
        run: {module: serverModule, transport: TransportKind.ipc},
        debug: {module: serverModule, transport: TransportKind.ipc},
    };
    let clientOptions = {
        documentSelector: [
            {scheme: 'file', language: 'coda'},
            {scheme: 'untitled', language: 'coda'},
        ],
        revealOutputChannelOn: 2,
    };
    let client = new LanguageClient('codaLanguageServer', 'Coda Language Server', serverOptions, clientOptions);
    await client.start();
    context.subscriptions.push({
        dispose: () => { client.stop(); }
    });
}
