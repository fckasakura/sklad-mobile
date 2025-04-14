import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Button,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

const API_BASE = "https://89fe7478329a133b.mokky.dev";

export default function MovementsScreen() {
  const [items, setItems] = useState<any[]>([]);
  const [stocks, setStocks] = useState<any[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [selectedStockId, setSelectedStockId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [itemsRes, stocksRes] = await Promise.all([
          fetch(`${API_BASE}/StockItems`).then((res) => res.json()),
          fetch(`${API_BASE}/Stocks`).then((res) => res.json()),
        ]);
        setItems(itemsRes);
        setStocks(stocksRes);
      } catch (err: any) {
        Alert.alert("Ошибка", err.message || "Не удалось загрузить данные");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleMove = async () => {
    if (!selectedItemId || !selectedStockId) {
      Alert.alert("⚠️", "Выберите товар и целевой склад");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/StockItems/${selectedItemId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stockId: selectedStockId }),
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err);
      }

      Alert.alert("✅ Успешно", "Товар перемещён");
    } catch (err: any) {
      Alert.alert("Ошибка", err.message || "Не удалось переместить товар");
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Выберите товар:</Text>
      <Picker
        selectedValue={selectedItemId ?? undefined}
        onValueChange={(val) => setSelectedItemId(val)}
        style={styles.picker}
      >
        <Picker.Item label="-- Товар --" value={undefined} />
        {items.map((item) => (
          <Picker.Item
            key={item.id}
            label={`${item.name || "Без названия"} (ID ${item.id})`}
            value={item.id}
          />
        ))}
      </Picker>

      <Text style={styles.label}>Куда переместить:</Text>
      <Picker
        selectedValue={selectedStockId ?? undefined}
        onValueChange={(val) => setSelectedStockId(val)}
        style={styles.picker}
      >
        <Picker.Item label="-- Склад --" value={undefined} />
        {stocks.map((stock) => (
          <Picker.Item key={stock.id} label={stock.name} value={stock.id} />
        ))}
      </Picker>

      <Button title="Переместить" onPress={handleMove} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, gap: 16 },
  label: { fontSize: 16, fontWeight: "bold" },
  picker: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#f2f2f2",
  },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
});
