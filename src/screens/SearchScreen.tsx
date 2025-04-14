import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

export default function SearchScreen() {
  const [query, setQuery] = useState("");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Поиск товара</Text>
      <TextInput
        style={styles.input}
        placeholder="Введите название или артикул"
        value={query}
        onChangeText={setQuery}
      />
      <Text style={styles.text}>Результаты поиска скоро появятся тут</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    fontSize: 16,
  },
  text: { fontSize: 16 },
});
