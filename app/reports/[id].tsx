import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function ReportDetailScreen() {
  const { id } = useLocalSearchParams(); 

  // Dados fictícios baseados no ID
  const report = {
    id: id,
    title: `Relatório ${id}`,
    details: 'Instagram: 1h 30m, WhatsApp: 1h',
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{report.title}</Text>
      <Text>{report.details}</Text>
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