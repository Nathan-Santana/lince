import { View, Text, Button, StyleSheet } from 'react-native';
import { router } from 'expo-router';

export default function DashboardScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>

      <View style={styles.card}>
        <Text>Tempo de uso hoje: 2h 30m</Text>
        <Text>Apps mais usados: Instagram, WhatsApp</Text>
      </View>

      <Button
        title="Ver Relatórios"
        onPress={() => {
          router.push('/reports')
  
        }}
      />

      <Button
        title="Configurações"
        onPress={() => {
          router.push('/settings');
        }}
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
    marginBottom: 20,
  },
});