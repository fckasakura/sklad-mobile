import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function MovementsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Перемещения</Text>
      <Text style={styles.text}>Здесь будет список перемещений и создание нового.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  text: { fontSize: 16, textAlign: "center" },
});
