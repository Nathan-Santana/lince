// services/authParent.js
import { auth } from './firebase'; // CORRIGIDO de '../firebase' para './firebase'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

// Função para registrar um pai (exemplo, você pode não precisar diferenciar aqui se 'userType' é tratado no Firestore)
export const signUpParent = async (email, password) => {
  // Se você quiser adicionar lógica específica para 'parent' ANTES ou DEPOIS
  // da criação do usuário Firebase, pode fazer aqui.
  // Caso contrário, esta função é muito similar à chamada direta.
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  // Aqui você poderia, por exemplo, automaticamente adicionar um campo 'userType: "parent"'
  // no Firestore se o registro fosse SEMPRE de um pai através desta função.
  return userCredential.user;
};

// Função para logar um pai (similarmente, pode não ser necessário se o tipo é verificado após login)
export const signInParent = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  // Após o login, você já busca o userType do Firestore em login.tsx.
  return userCredential.user;
};

// Se estas funções não adicionarem valor além das chamadas diretas do SDK
// e a lógica de tipo de usuário estiver bem gerenciada nas telas e no Firestore,
// este arquivo pode ser desnecessário para login/registro.
// Poderia ser útil para outras operações de auth específicas, como reautenticação,
// atualização de perfil do pai, etc.