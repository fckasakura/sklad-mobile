import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Switch,
  StyleSheet,
  Button,
  Alert,
} from "react-native";

export default function EditStockItemScreen({ route, navigation }: any) {
  const { item } = route.params;
  const [productId, setProductId] = useState(item.productId.toString());
  const [quantity, setQuantity] = useState(item.quantity.toString());
  const [isDamaged, setIsDamaged] = useState(item.isDamaged);

  const handleSave = async () => {
    try {
      const body = {
        productId: parseInt(productId),
        quantity: parseInt(quantity),
        isDamaged,
      };

      const res = await fetch(
        `https://89fe7478329a133b.mokky.dev/StockItems/${item.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err);
      }

      Alert.alert("✅ Успешно", "Товар обновлён");
      navigation.goBack();
    } catch (err: any) {
      Alert.alert("Ошибка", err.message || "Не удалось обновить товар");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>ID продукта:</Text>
      <TextInput
        style={styles.input}
        value={productId}
        onChangeText={setProductId}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Количество:</Text>
      <TextInput
        style={styles.input}
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="numeric"
      />

      <View style={styles.switchRow}>
        <Text>Повреждён?</Text>
        <Switch value={isDamaged} onValueChange={setIsDamaged} />
      </View>

      <Button title="Сохранить" onPress={handleSave} />
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
    gap: 10,
    marginBottom: 20,
  },
});
