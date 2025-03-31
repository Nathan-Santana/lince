const { auth } = require('./services/firebase');
const { signInWithEmailAndPassword } = require('firebase/auth');

(async () => {
  try {
    await signInWithEmailAndPassword(auth, 'pai@exemplo.com', 'senha123');
    console.log("✅ Login feito! User ID:", auth.currentUser.uid);
  } catch (error) {
    console.error("❌ Erro:", error.message);
  }
  process.exit();
})();