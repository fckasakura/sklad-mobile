import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function IssueScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Выдача товара</Text>
      <Text style={styles.text}>Здесь будет список заявок и форма для выдачи товара.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  text: { fontSize: 16, textAlign: "center" },
});
