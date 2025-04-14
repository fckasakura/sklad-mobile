import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Button,
  Alert,
  Switch,
} from "react-native";

export default function AddItemScreen({ navigation }: any) {
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [isDamaged, setIsDamaged] = useState(false);

  const handleSubmit = async () => {
    if (!productId || !quantity) {
      Alert.alert("Ошибка", "Введите все поля");
      return;
    }

    const payload = {
      productId: parseInt(productId),
      quantity: parseInt(quantity),
      isDamaged: isDamaged,
    };

    try {
      const res = await fetch("https://89fe7478329a133b.mokky.dev/StockItems", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Не удалось добавить товар");

      Alert.alert("✅ Успешно", "Товар добавлен");
      navigation.goBack();
    } catch (err: any) {
      Alert.alert("Ошибка", err.message || "Что-то пошло не так");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Добавить товар</Text>

      <Text style={styles.label}>ID продукта:</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={productId}
        onChangeText={setProductId}
      />

      <Text style={styles.label}>Количество:</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={quantity}
        onChangeText={setQuantity}
      />

      <View style={styles.switchRow}>
        <Text>Повреждён?</Text>
        <Switch value={isDamaged} onValueChange={setIsDamaged} />
      </View>

      <Button title="Добавить" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
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
