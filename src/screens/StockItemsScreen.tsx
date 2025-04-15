import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface StockItem {
  id: number;
  name: string;
  quantity: number;
  productId: number;
  isDamaged: boolean;
  stockId: number;
  stockName?: string;
  price?: number;
}

export default function StockScreen({ navigation }: any) {
  const [items, setItems] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStockItems = async () => {
      try {
        const stockId = await AsyncStorage.getItem("selectedStockId");
        if (!stockId) {
          Alert.alert("Ошибка", "Склад не выбран. Зайдите в профиль.");
          return;
        }

        const res = await fetch("https://89fe7478329a133b.mokky.dev/StockItems");
        const data: StockItem[] = await res.json();
        const filtered = data.filter((item) => item.stockId === parseInt(stockId));
        setItems(filtered);
      } catch (err: any) {
        Alert.alert("Ошибка", err.message || "Не удалось загрузить остатки");
      } finally {
        setLoading(false);
      }
    };

    loadStockItems();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate("EditStockItem", { item })}
          >
            <View style={styles.item}>
              <Text style={styles.title}>{item.name || "Без названия"}</Text>
              <Text>ID продукта: {item.productId}</Text>
              <Text>Цена: {item.price || 0} ₽</Text>
              <Text>Количество: {item.quantity}</Text>
              <Text>Склад: {item.stockName || "неизвестно"}</Text>
              <Text>Повреждён: {item.isDamaged ? "Да" : "Нет"}</Text>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.list}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("AddStockItem")}
      >
        <Text style={styles.addButtonText}>➕ Добавить товар</Text>
      </TouchableOpacity>
    </View>
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
    paddingBottom: 100, // чтобы не перекрывалось кнопкой
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
    marginBottom: 4,
  },
  addButton: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 12,
    margin: 20,
    alignItems: "center",
  },
  addButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
});
