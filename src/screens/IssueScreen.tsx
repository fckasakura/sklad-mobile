import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

const API_BASE = "https://89fe7478329a133b.mokky.dev";

export default function IssueScreen() {
  const [items, setItems] = useState<any[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE}/StockItems`);
        const data = await res.json();
        setItems(data);
      } catch (err: any) {
        Alert.alert("Ошибка", err.message || "Не удалось загрузить товары");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleIssue = async () => {
    if (!selectedItemId) {
      Alert.alert("⚠️", "Выберите товар для выдачи");
      return;
    }

    try {
      await fetch(`${API_BASE}/StockItems/${selectedItemId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ issued: true }),
      });

      Alert.alert("✅ Успешно", "Товар выдан");
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
      <Text style={styles.label}>Выберите товар:</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={selectedItemId}
          onValueChange={(val) => setSelectedItemId(val)}
        >
          <Picker.Item label="-- Выбрать --" value={undefined} />
          {items
            .filter((item) => !item.issued)
            .map((item) => (
              <Picker.Item key={item.id} label={item.name || `ID ${item.id}`} value={String(item.id)} />
            ))}
        </Picker>
      </View>

      <Button title="Выдать товар" onPress={handleIssue} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, gap: 16 },
  label: { fontSize: 16, fontWeight: "bold" },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#f2f2f2",
    marginBottom: 20,
  },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
});
