import BackgroundService from 'react-native-background-actions';
import { db, auth } from '../firebase';
import AppUsage from 'react-native-app-usage'; 

const updateDeviceActivity = async (deviceId) => {
    try {
        const apps = await AppUsage.getAppUsageStats();
        if (!apps || apps.length === 0) {
          console.warn('Nenhum dado de uso de app retornado.');
        }
        await updateDoc(doc(db, 'devices', deviceId), { 
          lastActivity: apps,
          updatedAt: new Date() 
        });
        await BackgroundService.updateNotification({ taskDesc: "Monitorando..." });
      } catch (error) {
        console.error('Erro no monitoramento:', error); //por enquanto vms logar o erro pra analisar. Dps implementar lógica de tratamento
      }      
  };
  
  const monitorApps = async () => {
    const deviceId = await getDeviceId(); 
    while (true) {
      try {
        await updateDeviceActivity(deviceId);
        await BackgroundService.updateNotification({ taskDesc: "Monitorando..." });
      } catch (error) {
        console.error('Erro no monitoramento:', error);//por enquanto vms logar o erro pra analisar. Dps implementar lógica de tratamento
      }
      await sleep(30000);
    }
  };
  

BackgroundService.start(monitorApps, {
  taskName: 'LinceMonitor',
  taskTitle: 'Monitorando atividades',
  taskDesc: 'Em execução',
  taskIcon: { name: 'ic_notification', type: 'drawable' },
});