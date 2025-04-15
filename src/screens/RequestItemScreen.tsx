import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";

export default function RequestItemScreen({ navigation }: any) {
  const [products, setProducts] = useState<any[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [quantity, setQuantity] = useState("1");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      const res = await fetch("https://89fe7478329a133b.mokky.dev/StockItems");
      const data = await res.json();
      setProducts(data);
      if (data.length > 0) setSelectedProductId(String(data[0].productId));
      setLoading(false);
    };

    loadProducts();
  }, []);

  const handleSubmit = async () => {
    const userId = await AsyncStorage.getItem("userId");
    if (!userId || !selectedProductId) {
      Alert.alert("Ошибка", "Проверьте выбранный товар и вход в аккаунт");
      return;
    }

    try {
      const res = await fetch("https://89fe7478329a133b.mokky.dev/Requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: Number(userId),
          productId: Number(selectedProductId),
          quantity: Number(quantity),
          status: "pending",
          createdAt: new Date().toISOString(),
        }),
      });

      if (!res.ok) throw new Error("Ошибка отправки запроса");

      Alert.alert("✅ Готово", "Заявка отправлена");
      navigation.goBack();
    } catch (err) {
      Alert.alert("Ошибка", "Не удалось создать заявку");
    }
  };

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 40 }} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Выберите товар:</Text>
      <Picker
        selectedValue={selectedProductId}
        onValueChange={(val) => setSelectedProductId(val)}
        style={styles.picker}
      >
        {products.map((p) => (
          <Picker.Item key={p.id} label={p.name} value={p.productId.toString()} />
        ))}
      </Picker>

      <Text style={styles.label}>Количество:</Text>
      <TextInput
        style={styles.input}
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="numeric"
      />

      <Button title="Отправить заявку" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  label: { marginTop: 15, marginBottom: 5 },
  input: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 6,
    marginBottom: 15,
  },
  picker: { height: 50 },
});
