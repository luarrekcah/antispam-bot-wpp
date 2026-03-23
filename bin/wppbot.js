#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const projectDir = path.join(__dirname, '..');

function runCommand(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: 'inherit', shell: true, ...options });
    child.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`Comando ${command} falhou com código ${code}`));
    });
  });
}

async function start() {
  process.chdir(projectDir);

  console.log('\x1b[36m%s\x1b[0m', '--- WPPBOT CLI ---');
  
  if (fs.existsSync(path.join(projectDir, '.git'))) {
    console.log('Verificando atualizações no repositório...');
    try {
      await runCommand('git', ['pull'], { cwd: projectDir });
    } catch (e) {
      console.warn('Aviso: Não foi possível atualizar via git. Continuando...');
    }
  }

  if (!fs.existsSync(path.join(projectDir, 'node_modules'))) {
    console.log('Instalando dependências...');
    await runCommand('npm', ['install'], { cwd: projectDir });
  }

  if (!fs.existsSync(path.join(projectDir, 'build', 'index.js'))) {
    console.log('Compilando projeto pela primeira vez...');
    await runCommand('npm', ['run', 'build'], { cwd: projectDir });
  }

  console.log('Iniciando o bot...');
  console.log('\x1b[32m%s\x1b[0m', '------------------');
  
  await runCommand('node', ['build/index.js'], { cwd: projectDir });
}

start().catch((err) => {
  console.error('\x1b[31m%s\x1b[0m', 'Erro fatal ao iniciar o wppbot:');
  console.error(err);
  process.exit(1);
});
