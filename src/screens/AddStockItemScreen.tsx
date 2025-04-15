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
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [isDamaged, setIsDamaged] = useState(false);
  const [stockId, setStockId] = useState<string>("");
  const [stockName, setStockName] = useState<string>("");

  useEffect(() => {
    const loadStock = async () => {
      const savedStockId = await AsyncStorage.getItem("selectedStockId");
      const savedStockName = await AsyncStorage.getItem("selectedStockName");

      if (!savedStockId || !savedStockName) {
        Alert.alert("Ошибка", "Склад не выбран. Зайдите в профиль и выберите склад.");
        return;
      }

      setStockId(savedStockId);
      setStockName(savedStockName);
    };
    loadStock();
  }, []);

  const handleSubmit = async () => {
    if (!productId || !quantity || !name || !price) {
      Alert.alert("Ошибка", "Пожалуйста, заполните все поля");
      return;
    }

    const body = {
      productId: parseInt(productId),
      stockId: parseInt(stockId),
      quantity: parseInt(quantity),
      name,
      price: parseFloat(price),
      stockName,
      isDamaged,
    };

    try {
      const res = await fetch("https://89fe7478329a133b.mokky.dev/StockItems", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err);
      }

      Alert.alert("✅ Успешно", "Товар добавлен на склад");
      navigation.goBack();
    } catch (err: any) {
      Alert.alert("Ошибка", err.message || "Не удалось создать товар");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Название:</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />

      <Text style={styles.label}>ID продукта:</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={productId}
        onChangeText={setProductId}
      />

      <Text style={styles.label}>Цена (₽):</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={price}
        onChangeText={setPrice}
      />

      <Text style={styles.label}>Количество:</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={quantity}
        onChangeText={setQuantity}
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
