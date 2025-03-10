import { View, Text, Button, StyleSheet } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';

export default function ReportDetailScreen() {
  const { id } = useLocalSearchParams(); 

  const reportData: { [key: string]: { title: string; details: string } } = {
    '1': { title: 'Uso Diário', details: 'Instagram: 1h 30m, WhatsApp: 1h' },
    '2': { title: 'Uso Semanal', details: 'Instagram: 10h, WhatsApp: 8h' },
  };

  const report = reportData[id as string] || { title: 'Relatório não encontrado', details: '' };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{report.title}</Text>
      <Text>{report.details}</Text>

      <Button title="Voltar" onPress={() => router.back()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});
