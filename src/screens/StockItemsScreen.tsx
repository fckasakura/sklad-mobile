import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TextInput,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface StockItem {
  id: number;
  productId: number;
  stockId: number;
  quantity: number;
  isDamaged: boolean;
}

export default function StockItemsScreen() {
  const [items, setItems] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await fetch("https://89fe7478329a133b.mokky.dev/StockItems");
      const data = await res.json();
      setItems(data);
    } catch (err) {
      Alert.alert("Ошибка", "Не удалось загрузить товары");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await fetch(`https://89fe7478329a133b.mokky.dev/StockItems/${id}`, {
        method: "DELETE",
      });
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch {
      Alert.alert("Ошибка", "Не удалось удалить товар");
    }
  };

  const filteredItems = items.filter(
    (item) =>
      item.id.toString().includes(search) ||
      item.productId.toString().includes(search)
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={styles.title}>Остатки товаров</Text>

      <TextInput
        placeholder="Поиск по ID товара или ProductID"
        value={search}
        onChangeText={setSearch}
        style={styles.input}
        placeholderTextColor="#999"
      />

      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 40 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>ID: {item.id}</Text>
            <Text style={styles.cardText}>ID продукта: {item.productId}</Text>
            <Text style={styles.cardText}>Количество: {item.quantity}</Text>
            <Text style={styles.cardText}>
              Повреждён: {item.isDamaged ? "Да" : "Нет"}
            </Text>

            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() =>
                Alert.alert("Удалить", "Удалить этот товар?", [
                  { text: "Отмена", style: "cancel" },
                  { text: "Удалить", style: "destructive", onPress: () => handleDelete(item.id) },
                ])
              }
            >
              <Text style={styles.deleteText}>Удалить</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    color: "#000",
  },
  card: {
    backgroundColor: "#f9f9f9",
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 6,
  },
  cardText: {
    fontSize: 14,
    marginBottom: 4,
    color: "#444",
  },
  deleteButton: {
    marginTop: 10,
    backgroundColor: "#ff3b30",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  deleteText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
