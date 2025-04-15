import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Button,
  Alert,
  ActivityIndicator,
} from "react-native";

interface Request {
  id: number;
  itemId: number;
  user: string;
  quantity: number;
}

export default function IssueScreen() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const res = await fetch("https://89fe7478329a133b.mokky.dev/IssueRequests");
      const data = await res.json();
      setRequests(data);
    } catch {
      Alert.alert("Ошибка", "Не удалось загрузить заявки");
    } finally {
      setLoading(false);
    }
  };

  const handleIssue = async (id: number) => {
    try {
      await fetch(`https://89fe7478329a133b.mokky.dev/IssueRequests/${id}`, {
        method: "DELETE",
      });
      Alert.alert("✅", "Товар выдан");
      fetchRequests();
    } catch {
      Alert.alert("Ошибка", "Не удалось выдать товар");
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Заявки на выдачу</Text>
      <FlatList
        data={requests}
        keyExtractor={(r) => r.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text>Товар ID: {item.itemId}</Text>
            <Text>Пользователь: {item.user}</Text>
            <Text>Количество: {item.quantity}</Text>
            <Button title="Выдать" onPress={() => handleIssue(item.id)} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  card: {
    backgroundColor: "#f2f2f2",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
});
