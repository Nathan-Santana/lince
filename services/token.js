import { db } from '../firebase';
import { addDoc, collection } from 'firebase/firestore';
import * as Crypto from 'expo-crypto';

export const generateToken = async (deviceId) => {
  const randomBytes = await Crypto.getRandomBytesAsync(32);
  
  const token = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    `${deviceId}-${Date.now()}-${randomBytes}`
  );

  await addDoc(collection(db, 'tokens'), {
    token,
    deviceId,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24h
    isLinked: false
  });

  return token;
};