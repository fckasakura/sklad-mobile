import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Button,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

export default function IssueRequestsScreen() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadRequests = async () => {
    const res = await fetch("https://89fe7478329a133b.mokky.dev/Requests");
    const data = await res.json();
    setRequests(data.filter((r: any) => r.status === "pending"));
    setLoading(false);
  };

  const handleIssue = async (request: any) => {
    try {
      const res = await fetch(
        `https://89fe7478329a133b.mokky.dev/Requests/${request.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "issued" }),
        }
      );

      if (!res.ok) throw new Error("Не удалось обновить");

      Alert.alert("✅ Выдано", "Товар выдан");
      loadRequests();
    } catch (err) {
      Alert.alert("Ошибка", "Не удалось выдать товар");
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 40 }} />;
  }

  return (
    <FlatList
      data={requests}
      contentContainerStyle={styles.list}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text>Пользователь ID: {item.userId}</Text>
          <Text>Товар ID: {item.productId}</Text>
          <Text>Кол-во: {item.quantity}</Text>
          <Button title="Выдать" onPress={() => handleIssue(item)} />
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: { padding: 20 },
  card: {
    backgroundColor: "#f2f2f2",
    padding: 16,
    borderRadius: 10,
    marginBottom: 15,
  },
});
