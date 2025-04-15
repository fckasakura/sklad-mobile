import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  FlatList,
  Button,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface StockItem {
  id: number;
  name: string;
  stockId: number;
}

interface Stock {
  id: number;
  name: string;
}

export default function MovementsScreen() {
  const [items, setItems] = useState<StockItem[]>([]);
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [selectedItem, setSelectedItem] = useState<StockItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const stockId = await AsyncStorage.getItem("selectedStockId");
        const resItems = await fetch("https://89fe7478329a133b.mokky.dev/StockItems");
        const resStocks = await fetch("https://89fe7478329a133b.mokky.dev/Stocks");

        const dataItems = await resItems.json();
        const dataStocks = await resStocks.json();

        const current = dataItems.filter((i: any) => i.stockId === Number(stockId));
        setItems(current);
        setStocks(dataStocks.filter((s: Stock) => s.id !== Number(stockId)));
      } catch (e) {
        Alert.alert("Ошибка", "Не удалось загрузить данные");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const handleMove = async (targetStockId: number) => {
    if (!selectedItem) return;

    try {
      const res = await fetch(`https://89fe7478329a133b.mokky.dev/StockItems/${selectedItem.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stockId: targetStockId }),
      });

      if (!res.ok) throw new Error("Ошибка перемещения");

      Alert.alert("✅", "Товар перемещён");
      setItems((prev) => prev.filter((i) => i.id !== selectedItem.id));
      setSelectedItem(null);
    } catch (err: any) {
      Alert.alert("Ошибка", err.message);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Выберите товар для перемещения:</Text>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.item,
              selectedItem?.id === item.id && styles.selectedItem,
            ]}
            onPress={() => setSelectedItem(item)}
          >
            <Text>{item.name}</Text>
          </TouchableOpacity>
        )}
      />

      {selectedItem && (
        <>
          <Text style={styles.title}>Куда переместить:</Text>
          <FlatList
            data={stocks}
            keyExtractor={(s) => s.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.stockBtn}
                onPress={() => handleMove(item.id)}
              >
                <Text style={styles.stockText}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 8 },
  item: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#ccc",
    marginBottom: 6,
  },
  selectedItem: {
    borderColor: "#007AFF",
    backgroundColor: "#e0f0ff",
  },
  stockBtn: {
    padding: 10,
    backgroundColor: "#007AFF",
    borderRadius: 8,
    marginVertical: 4,
  },
  stockText: { color: "#fff", textAlign: "center", fontWeight: "bold" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
});
