// ./services/linkService.js
import { db } from '../firebase';
import { collection, query, where, getDocs, updateDoc } from 'firebase/firestore';

export const linkDeviceToParent = async (token, parentId) => {
  const tokensRef = collection(db, 'tokens');
  const q = query(tokensRef, where('token', '==', token));
  const snapshot = await getDocs(q);

  if (snapshot.empty) throw new Error('Token inválido ou expirado');

  const tokenDoc = snapshot.docs[0];
  const tokenData = tokenDoc.data();

  if (tokenData.expiresAt.toDate() < new Date()) {
    throw new Error('Token expirado');
  }

  await updateDoc(tokenDoc.ref, {
    parentId,
    isLinked: true
  });

  const devicesRef = collection(db, 'devices');
  await setDoc(doc(devicesRef, tokenData.deviceId), {
    parentId,
    blockedApps: [],
    schedules: []
  });
};