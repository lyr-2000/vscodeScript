import * as vscode from 'vscode';
import * as childProcess from 'child_process';
// import fetch from 'node-fetch'

function checkParam(...w) {
  for (var i = 0; i < w.length; i++) {
    if (w[i] === undefined) {
      throw new Error(`undefined params arg${i}`);
    }
  }
  return true
}



export async function spawn(cmd, stdin = null, args = null) {
  checkParam(cmd, stdin, args)
  return new Promise(function (resolve, reject) {
    const ls = childProcess.spawn(cmd, args);
    if (stdin && typeof stdin == 'string') {
      ls.stdin.write(stdin);
      ls.stdin.end()
    }
    let stdoutData = "";
    let stderrData = "";
    ls.stdout.on('data', (data) => {
      // Edit thomas.g: stdoutData = Buffer.concat([stdoutData, chunk]);
      stdoutData += data;
    });

    ls.stderr.on('data', (data) => {
      stderrData += data;
    });

    ls.on('close', (code) => {
      if (stderrData) {
        reject(stderrData);
      } else {
        resolve(stdoutData);
      }
    });
    ls.on('error', (err) => {
      reject(err);
    });
  })
}

export function executeShellCommand(command: string, opt0 = {}, opt = {
  cwd: vscode.workspace.rootPath,
  encoding: 'utf8',

}): Promise<string> {
  checkParam(command, opt0, opt)
  return new Promise<string>((resolve, reject) => {
    childProcess.exec(command, opt, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve(stdout.trim());
      }
    });
  });
}

function get(k, v) {
  return vscode.workspace.getConfiguration().get(k) || v
}

interface tshellConfig {
  show: boolean
}
export function tshell(text: string, conf: tshellConfig = { show: true }) {
  checkParam(text, conf)
  // const terminal = vscode.window.cra
  const terminals = vscode.window.terminals;
  const k = get('custom-kit.terminal.title', '[cmd]')
  // 查找名为"My Terminal"的终端
  let terminal = terminals.find(terminal => terminal.name === k);

  if (!terminal) {
    // 如果找不到，则创建一个名为"My Terminal"的新终端
    terminal = vscode.window.createTerminal(k);
  }
  terminal.sendText(text)
  if (conf.show) {
    terminal.show()
  }
  return terminal
}

import fetch from 'node-fetch';



export function request(url: string, ...opt: any[]) {
  checkParam(url, opt)
  return fetch(url, ...opt)
}