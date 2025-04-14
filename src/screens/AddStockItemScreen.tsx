import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Button,
  Switch,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function AddStockItemScreen({ navigation }: any) {
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [isDamaged, setIsDamaged] = useState(false);
  const [stockId, setStockId] = useState<string | null>(null);

  useEffect(() => {
    const loadStock = async () => {
      const savedStockId = await AsyncStorage.getItem("selectedStockId");
      setStockId(savedStockId);
    };
    loadStock();
  }, []);

  const handleSubmit = async () => {
    const token = await AsyncStorage.getItem("authToken");

    if (!token || !stockId) {
      Alert.alert("Ошибка", "Не найден токен или склад. Перезайдите в приложение.");
      return;
    }

    if (!productId.trim() || !quantity.trim()) {
      Alert.alert("Ошибка", "Пожалуйста, заполните все поля.");
      return;
    }

    const body = {
      productId: parseInt(productId),
      stockId: parseInt(stockId),
      quantity: parseInt(quantity),
      isDamaged,
    };

    try {
      const res = await fetch(
        "https://stoq-web-api.devspace.bafid.app/api/v1/stock-items",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      const responseText = await res.text();
      console.log("📦 Ответ от сервера:", responseText);

      if (!res.ok) {
        throw new Error(responseText || "Не удалось добавить товар");
      }

      Alert.alert("✅ Успешно", "Товар добавлен на склад");
      navigation.goBack();
    } catch (err: any) {
      console.log("❌ Ошибка создания:", err.message);
      Alert.alert("Ошибка", err.message || "Не удалось создать товар");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>ID продукта:</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={productId}
        onChangeText={setProductId}
        placeholder="Например, 1"
      />

      <Text style={styles.label}>Количество:</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={quantity}
        onChangeText={setQuantity}
        placeholder="Например, 10"
      />

      <View style={styles.switchRow}>
        <Text>Повреждённый?</Text>
        <Switch value={isDamaged} onValueChange={setIsDamaged} />
      </View>

      <Button title="Добавить товар" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  label: { fontSize: 16, marginBottom: 5 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 10,
  },
});
