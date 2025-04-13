import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Alert,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";

interface Stock {
  stockId: number;
  name: string;
}

export default function SettingsScreen() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [selectedStock, setSelectedStock] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const loadStocks = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const res = await fetch(
        "https://stoq-web-api.devspace.bafid.app/api/v1/stocks/under-my-management",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      setStocks(data);

      const saved = await AsyncStorage.getItem("selectedStockId");
      if (saved) setSelectedStock(parseInt(saved));
    } catch {
      Alert.alert("Ошибка", "Не удалось загрузить склады");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStocks();
  }, []);

  const createNewStock = async () => {
    Alert.prompt("Новый склад", "Введите название склада", async (name) => {
      if (!name) return;

      try {
        const token = await AsyncStorage.getItem("authToken");

        const res = await fetch(
          "https://stoq-web-api.devspace.bafid.app/api/v1/stocks",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ name }),
          }
        );

        if (!res.ok) throw new Error();

        Alert.alert("✅ Склад создан");
        loadStocks();
      } catch {
        Alert.alert("Ошибка", "Не удалось создать склад");
      }
    });
  };

  const saveSelection = async () => {
    if (selectedStock) {
      await AsyncStorage.setItem("selectedStockId", selectedStock.toString());
      Alert.alert("✅ Склад сохранён");
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
      <Text style={styles.label}>Выберите склад:</Text>
      <Picker
        selectedValue={selectedStock}
        onValueChange={(value) => setSelectedStock(value)}
        style={styles.picker}
      >
        {stocks.map((stock) => (
          <Picker.Item
            key={stock.stockId}
            label={stock.name}
            value={stock.stockId}
          />
        ))}
      </Picker>

      <View style={styles.btnGroup}>
        <Button title="Создать новый склад" onPress={createNewStock} />
        <View style={{ height: 12 }} />
        <Button title="Сохранить" onPress={saveSelection} color="#007bff" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  container: { flex: 1, padding: 20 },
  label: { fontSize: 18, marginBottom: 10 },
  picker: { height: 50, marginBottom: 20 },
  btnGroup: { marginTop: 20 },
});
