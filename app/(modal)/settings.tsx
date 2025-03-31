import { View, Text, Button, StyleSheet, Switch } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';

export default function SettingsScreen() {
    const { theme, isDark, toggleTheme } = useTheme();
    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <Text style={[styles.title, { color: theme.text }]}>Configurações</Text>

            <View style={styles.settingItem}>
                <Text style={{ color: theme.text }}>Tema Escuro</Text>
                <Switch
                value={isDark}
                onValueChange={toggleTheme}
                trackColor={{ false: '#767577', true: '#81b0ff' }}
                />
            </View>

            <Text style={{ color: theme.text }}>Limite de tempo diário: 2h</Text>
            <Text style={{ color: theme.text }}>Apps bloqueados: TikTok</Text>

            <Button
                title="Fechar"
                onPress={() => {
                
                router.back();
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
      marginBottom: 30,
    },
    settingItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
});