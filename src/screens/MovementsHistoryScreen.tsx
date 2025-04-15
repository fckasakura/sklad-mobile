import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from "react-native";

const API_BASE = "https://89fe7478329a133b.mokky.dev";

export default function MovementsHistoryScreen() {
  const [movements, setMovements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE}/Movements`);
        const data = await res.json();
        setMovements(data);
      } catch (err: any) {
        console.log("Ошибка при загрузке истории:", err.message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <FlatList
      data={movements}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => (
        <View style={styles.item}>
          <Text style={styles.title}>Товар ID: {item.stockItemId}</Text>
          <Text>Из склада ID: {item.fromStockId}</Text>
          <Text>В склад ID: {item.toStockId}</Text>
          <Text>Когда: {new Date(item.date).toLocaleString()}</Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  list: { padding: 16 },
  item: {
    backgroundColor: "#f2f2f2",
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
  },
  title: { fontWeight: "bold", fontSize: 16 },
});
