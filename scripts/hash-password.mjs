// Génère une entrée pour la variable CMS_USERS de Netlify.
// Usage : npm run hash-password -- <identifiant>
import { randomBytes, scryptSync } from 'node:crypto';
import { createInterface } from 'node:readline';

const username = (process.argv[2] || '').trim().toLowerCase();
if (!/^[a-z0-9._-]{2,}$/.test(username)) {
  console.error('Usage : npm run hash-password -- <identifiant>   (lettres, chiffres, . _ -)');
  process.exit(1);
}

function ask(question) {
  return new Promise((resolve) => {
    const rl = createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    rl._writeToOutput = (s) => { if (s.includes(question)) rl.output.write(s); }; // masque la saisie
    rl.question(question, (answer) => { rl.close(); process.stdout.write('\n'); resolve(answer); });
  });
}

const password = await ask('Mot de passe : ');
const confirm = await ask('Confirmer : ');
if (password !== confirm) { console.error('Les mots de passe ne correspondent pas.'); process.exit(1); }
if (password.length < 12) { console.error('12 caractères minimum, s\'il te plaît.'); process.exit(1); }

const salt = randomBytes(16);
const hash = scryptSync(password, salt, 64);
console.log('\nÀ ajouter dans CMS_USERS (séparer plusieurs comptes par une virgule) :\n');
console.log(`${username}:${salt.toString('hex')}:${hash.toString('hex')}\n`);
