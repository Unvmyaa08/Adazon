import { Link, Stack } from 'expo-router';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: '404 - Page Not Found' }} />
      <ThemedView style={styles.container}>
        <ThemedText type="title" style={styles.text}>
          "404 - Welcome to Atlanta."
        </ThemedText>
        <ThemedText style={styles.subtext}>
          This page was not found..
        </ThemedText>
        <Link href="/" style={styles.link}>
          <ThemedText type="link">Back to home</ThemedText>
        </Link>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  text: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
  subtext: {
    textAlign: 'center',
    marginTop: 10,
    fontSize: 16,
    color: 'gray',
  },
  link: {
    marginTop: 20,
    paddingVertical: 15,
  },
});
