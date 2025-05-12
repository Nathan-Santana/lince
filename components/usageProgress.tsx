import { View, Text, StyleSheet } from 'react-native';
import { ProgressBar } from 'react-native-paper';

interface Props {
  app: string;
  used: number;
  limit: number;
}

export default function UsageProgress({ app, used, limit }: Props) {
  const safeLimit = limit || 1; // Evita divisão por zero
  const progress = Math.min(used / safeLimit, 1); // Máximo 100%

  return (
    <View style={styles.container}>
      <Text style={styles.appName}>{app}</Text>
      <Text style={styles.timeText}>
        {formatTime(used)} / {formatTime(limit)}
      </Text>
      <ProgressBar
        progress={progress}
        color={progress >= 1 ? '#ff4444' : '#4CAF50'}
        style={styles.progressBar}
      />
    </View>
  );
}

const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  return `${minutes}m`;
};

const styles = StyleSheet.create({
    container: {
      marginBottom: 16,
      padding: 12,
      backgroundColor: '#fff',
      borderRadius: 8,
      elevation: 2,
    },
    appName: {
      fontSize: 16,
      marginBottom: 4,
    },
    timeText: {
      fontSize: 14,
      color: '#666',
      marginBottom: 8,
    },
    progressBar: {
      height: 8,
      borderRadius: 4,
    },
  });