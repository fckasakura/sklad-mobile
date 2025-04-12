import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface StockItem {
  stockItemId: number;
  name: string;
  quantity: number;
  productId: number;
}

export default function StockScreen() {
  const [items, setItems] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStockItems = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        console.log("🔥 Токен:", token);
  
        if (!token) {
          Alert.alert("Ошибка", "Токен не найден");
          return;
        }
  
        const res = await fetch("https://stoq-web-api.devspace.bafid.app/api/v1/stock-items", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        console.log("📦 Ответ статус:", res.status);
  
        if (!res.ok) {
          const err = await res.text();
          console.log("❌ Ошибка ответа:", err);
          throw new Error(err);
        }
  
        const data = await res.json();
        console.log("✅ Остатки:", data);
        setItems(data);
      } catch (err: any) {
        console.log("❗ Catch ошибка:", err.message);
        Alert.alert("Ошибка", err.message || "Не удалось получить остатки");
      } finally {
        setLoading(false);
      }
    };
  
    fetchStockItems(); // ✅ ВЫНЕСЕН за пределы объявления
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
      data={items}
      keyExtractor={(item) => item.stockItemId.toString()}
      renderItem={({ item }) => (
        <View style={styles.item}>
          <Text style={styles.title}>{item.name}</Text>
          <Text style={styles.subtitle}>ID продукта: {item.productId}</Text>
          <Text>Количество: {item.quantity}</Text>
        </View>
      )}
      contentContainerStyle={styles.list}
    />
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  list: {
    padding: 20,
  },
  item: {
    backgroundColor: "#f2f2f2",
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
  },
  subtitle: {
    fontStyle: "italic",
    color: "#666",
  },
});
