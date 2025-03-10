import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
import { router } from 'expo-router';

const reports = [
  { id: '1', title: 'Uso Diário', description: 'Instagram: 1h 30m, WhatsApp: 1h' },
  { id: '2', title: 'Uso Semanal', description: 'Instagram: 10h, WhatsApp: 8h' },
];

export default function ReportsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Relatórios</Text>
      
      <FlatList
        data={reports}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text>{item.description}</Text>
            <Button
              title="Ver Detalhes"
              onPress={() => {
                // Implementar '/reports/[id]'
                // router.push(`/reports/${item.id}`);
              }}
            />
          </View>
        )}
      />
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
  card: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});