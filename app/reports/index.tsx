import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { MaterialIcons } from '@expo/vector-icons';


const reports = [
  { id: '1', title: 'Uso Diário', description: 'Instagram: 1h 30m, WhatsApp: 1h' },
  { id: '2', title: 'Uso Semanal', description: 'Instagram: 10h, WhatsApp: 8h' },
];


export default function ReportsScreen() {
  const { theme } = useTheme();
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()}>
        <MaterialIcons name="arrow-back" size={24} color={theme.primary} />
      </TouchableOpacity>
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
                router.push(`/reports/${item.id}`);
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
