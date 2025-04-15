import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Alert,
  TextInput,
  FlatList,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Stock {
  id: number;
  name: string;
}

interface User {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
}

export default function ProfileScreen({ navigation }: any) {
  const [user, setUser] = useState<User | null>(null);
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [selectedStockId, setSelectedStockId] = useState<string | null>(null);
  const [newStockName, setNewStockName] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const token = await AsyncStorage.getItem("authToken");
    const storedStockId = await AsyncStorage.getItem("selectedStockId");
    setSelectedStockId(storedStockId);

    try {
      const resUser = await fetch("https://89fe7478329a133b.mokky.dev/Users");
      const users = await resUser.json();
      const currentUser = users.find((u: any) => `Bearer ${token}`.includes(u.email)); // моковая проверка
      setUser(currentUser);

      const resStocks = await fetch("https://89fe7478329a133b.mokky.dev/Stocks");
      const data = await resStocks.json();
      setStocks(data);
    } catch (err) {
      Alert.alert("Ошибка", "Не удалось загрузить профиль и склады");
    }
  };

  const handleSelectStock = async (id: number) => {
    await AsyncStorage.setItem("selectedStockId", id.toString());
    setSelectedStockId(id.toString());
    Alert.alert("✅ Успешно", "Склад выбран");
  };

  const handleCreateStock = async () => {
    if (!newStockName.trim()) {
      Alert.alert("Ошибка", "Введите название склада");
      return;
    }

    try {
      const res = await fetch("https://89fe7478329a133b.mokky.dev/Stocks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newStockName }),
      });

      if (!res.ok) throw new Error("Ошибка при создании склада");

      const created = await res.json();
      await AsyncStorage.setItem("selectedStockId", created.id.toString());
      setSelectedStockId(created.id.toString());
      setNewStockName("");
      loadData();
    } catch (err: any) {
      Alert.alert("Ошибка", err.message || "Не удалось создать склад");
    }
  };

  const logout = async () => {
    await AsyncStorage.multiRemove(["authToken", "selectedStockId"]);
    navigation.reset({ index: 0, routes: [{ name: "Login" as never }] }); // 👈 safe cast
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Профиль</Text>

      {user ? (
        <>
          <Text style={styles.info}>Email: {user.email}</Text>
          {user.firstName && <Text style={styles.info}>Имя: {user.firstName}</Text>}
          {user.lastName && <Text style={styles.info}>Фамилия: {user.lastName}</Text>}
        </>
      ) : (
        <Text style={styles.info}>Загрузка данных пользователя...</Text>
      )}

      <Text style={styles.subtitle}>Выбор склада:</Text>

      <FlatList
        data={stocks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.stockItem,
              item.id.toString() === selectedStockId && styles.selectedStock,
            ]}
            onPress={() => handleSelectStock(item.id)}
          >
            <Text style={styles.stockText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />

      <TextInput
        style={styles.input}
        placeholder="Новый склад"
        value={newStockName}
        onChangeText={setNewStockName}
      />
      <Button title="Создать склад" onPress={handleCreateStock} />

      <View style={{ marginTop: 20 }}>
        <Button title="Выйти из аккаунта" color="red" onPress={logout} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 16 },
  subtitle: { fontSize: 18, fontWeight: "bold", marginTop: 24, marginBottom: 8 },
  info: { fontSize: 16, marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
  stockItem: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#007AFF",
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedStock: {
    backgroundColor: "#007AFF",
  },
  stockText: {
    color: "#000",
  },
});
