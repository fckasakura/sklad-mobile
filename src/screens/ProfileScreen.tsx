import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TextInput,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types"; 

interface Stock {
  id: number;
  name: string;
}

// Тип для навигации
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function ProfileScreen() {
  const navigation = useNavigation<NavigationProp>(); // Типизированное useNavigation
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [selectedStock, setSelectedStock] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newStockName, setNewStockName] = useState("");

  useEffect(() => {
    loadStocks();
  }, []);

  const loadStocks = async () => {
    try {
      const res = await fetch("https://89fe7478329a133b.mokky.dev/Stocks");
      const data: Stock[] = await res.json();

      if (!data || data.length === 0) {
        throw new Error("Склады не найдены");
      }

      setStocks(data);

      const savedStockId = await AsyncStorage.getItem("selectedStockId");
      if (savedStockId) {
        setSelectedStock(parseInt(savedStockId));
      }
    } catch (err: any) {
      Alert.alert("Ошибка", err.message || "Не удалось загрузить склады");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("authToken");
    await AsyncStorage.removeItem("selectedStockId");
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" as keyof RootStackParamList }], // Явная типизация
    });
  };

  const handleStockChange = async (value: number) => {
    setSelectedStock(value);
    await AsyncStorage.setItem("selectedStockId", value.toString());
    Alert.alert("✅ Склад выбран", "Теперь товар будет добавляться в выбранный склад.");
  };

  const handleCreateStock = async () => {
    if (!newStockName.trim()) {
      Alert.alert("Введите название склада");
      return;
    }

    try {
      const res = await fetch("https://89fe7478329a133b.mokky.dev/Stocks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newStockName }),
        });

      if (!res.ok) {
        throw new Error("Не удалось создать склад");
      }

      const created: Stock = await res.json();
      setStocks((prev) => [...prev, created]);
      setSelectedStock(created.id);
      await AsyncStorage.setItem("selectedStockId", created.id.toString());
      setNewStockName("");
      setCreating(false);
      Alert.alert("✅ Готово", "Склад успешно создан и выбран!");
    } catch (err: any) {
      Alert.alert("Ошибка", err.message || "Ошибка при создании склада");
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Профиль</Text>

      <Text style={styles.label}>Выбрать склад:</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={selectedStock ?? undefined}
          onValueChange={handleStockChange}
          style={styles.picker}
        >
          {stocks.map((stock) => (
            <Picker.Item key={stock.id} label={stock.name} value={stock.id} />
          ))}
        </Picker>
      </View>

      {creating ? (
        <>
          <Text style={styles.label}>Название склада:</Text>
          <TextInput
            value={newStockName}
            onChangeText={setNewStockName}
            placeholder="Введите название"
            style={styles.input}
          />
          <Button title="Создать" onPress={handleCreateStock} />
          <Button title="Отмена" color="gray" onPress={() => setCreating(false)} />
        </>
      ) : (
        <Button title="➕ Создать новый склад" onPress={() => setCreating(true)} />
      )}

      <View style={{ marginTop: 30 }}>
        <Button title="Выйти из аккаунта" onPress={handleLogout} color="#ff3b30" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  label: { fontSize: 16, marginBottom: 5 },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 20,
  },
  picker: { height: 50 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
});