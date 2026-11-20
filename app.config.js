const { execSync } = require('node:child_process');

/** Commit do build, exibido na tela "Sobre o App" para conferir que o app publicado é este código. */
function commitDoBuild() {
  if (process.env.EXPO_PUBLIC_COMMIT_HASH) return process.env.EXPO_PUBLIC_COMMIT_HASH;
  try {
    return execSync('git rev-parse HEAD', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
  } catch {
    return 'desconhecido';
  }
}

/** @param {import('expo/config').ConfigContext} context */
module.exports = ({ config }) => ({
  ...config,
  extra: { ...config.extra, commitHash: commitDoBuild() },
});
