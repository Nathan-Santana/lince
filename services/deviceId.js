import * as Application from 'expo-application';
import * as Crypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';

export const getOrCreateDeviceId = async () => {
  let deviceId = await SecureStore.getItemAsync('deviceId');

  if (!deviceId) {
    if (Application.androidId) {
      deviceId = Application.androidId;
    } else {
      const uuid = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        `${Application.applicationId}-${Date.now()}`
      );
      deviceId = uuid;
    }

    await SecureStore.setItemAsync('deviceId', deviceId);
  }

  return deviceId;
};