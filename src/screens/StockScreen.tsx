import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";

export default function StocksScreen({ navigation }: any) {
  const [stocks, setStocks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStocks = async () => {
      try {
        const res = await fetch("https://89fe7478329a133b.mokky.dev/Stocks");
        if (!res.ok) throw new Error("Не удалось загрузить склады");
        const data = await res.json();
        setStocks(data);
      } catch (err: any) {
        Alert.alert("Ошибка", err.message);
      } finally {
        setLoading(false);
      }
    };

    loadStocks();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Список складов</Text>

      <FlatList
        data={stocks}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 40 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => navigation.navigate("StockItems", { stockId: item.id })}
          >
            <Text style={styles.itemTitle}>{item.name}</Text>
            {item.description ? <Text>{item.description}</Text> : null}
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  item: {
    backgroundColor: "#f2f2f2",
    padding: 15,
    marginBottom: 12,
    borderRadius: 10,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
