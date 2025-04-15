// screens/EditStockItemScreen.tsx
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

export default function EditStockItemScreen({ route, navigation }: any) {
  const { item } = route.params;
  const [quantity, setQuantity] = useState(item.quantity.toString());
  const [isDamaged, setIsDamaged] = useState(item.isDamaged);

  const handleSave = async () => {
    try {
      const res = await fetch(`https://89fe7478329a133b.mokky.dev/StockItems/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quantity: parseInt(quantity),
          isDamaged,
        }),
      });

      if (!res.ok) throw new Error("Ошибка при обновлении");

      Alert.alert("✅ Обновлено", "Товар успешно обновлён");
      navigation.goBack();
    } catch (err: any) {
      Alert.alert("Ошибка", err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Товар: {item.name}</Text>
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

      <Button title="Сохранить изменения" onPress={handleSave} />
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
