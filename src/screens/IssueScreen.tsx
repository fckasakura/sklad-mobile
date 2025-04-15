import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Button,
  Alert,
  ActivityIndicator,
} from "react-native";

interface IssueRequest {
  id: number;
  stockItemId: number;
  quantity: number;
}

interface StockItem {
  id: number;
  name: string;
  quantity: number;
  stockId: number;
}

export default function IssueScreen() {
  const [requests, setRequests] = useState<IssueRequest[]>([]);
  const [items, setItems] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const resRequests = await fetch("https://89fe7478329a133b.mokky.dev/IssueRequests");
      const resItems = await fetch("https://89fe7478329a133b.mokky.dev/StockItems");

      const requestsData: IssueRequest[] = await resRequests.json();
      const itemsData: StockItem[] = await resItems.json();

      setRequests(requestsData);
      setItems(itemsData);
    } catch (err: any) {
      Alert.alert("Ошибка", err.message || "Не удалось загрузить данные");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleIssue = async (request: IssueRequest) => {
    const item = items.find((i) => i.id === request.stockItemId);
    if (!item) {
      Alert.alert("Ошибка", "Товар не найден");
      return;
    }

    if (item.quantity < request.quantity) {
      Alert.alert("Ошибка", "Недостаточно товара на складе");
      return;
    }

    try {
      // Обновляем количество товара
      await fetch(`https://89fe7478329a133b.mokky.dev/StockItems/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: item.quantity - request.quantity }),
      });

      // Удаляем заявку
      await fetch(`https://89fe7478329a133b.mokky.dev/IssueRequests/${request.id}`, {
        method: "DELETE",
      });

      Alert.alert("✅ Готово", "Товар выдан");

      // Обновим список
      loadData();
    } catch (err: any) {
      Alert.alert("Ошибка", err.message || "Не удалось выдать товар");
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
      <FlatList
        data={requests}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={<Text>Нет заявок на выдачу</Text>}
        renderItem={({ item: request }) => {
          const stockItem = items.find((i) => i.id === request.stockItemId);
          return (
            <View style={styles.item}>
              <Text style={styles.title}>{stockItem?.name || "Неизвестный товар"}</Text>
              <Text>Запрошено: {request.quantity}</Text>
              <Text>Доступно: {stockItem?.quantity ?? "-"}</Text>
              <Button title="Выдать" onPress={() => handleIssue(request)} />
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  item: {
    backgroundColor: "#f8f8f8",
    padding: 15,
    borderRadius: 8,
    marginBottom: 12,
  },
  title: { fontWeight: "bold", fontSize: 16, marginBottom: 4 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
});
