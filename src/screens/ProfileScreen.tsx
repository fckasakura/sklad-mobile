import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  ActivityIndicator,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker"; // нужно установить

export default function ProfileScreen({ navigation }: any) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ email: string; userId: number } | null>(null);
  const [stocks, setStocks] = useState<any[]>([]);
  const [selectedStockId, setSelectedStockId] = useState<number | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (!token) throw new Error("Нет токена");

        // --- Получение пользователя
        const resUser = await fetch("https://stoq-web-api.devspace.bafid.app/api/v1/users/current", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const rawUser = await resUser.text();
        console.log("👤 Ответ профиля:", rawUser);

        if (!rawUser || rawUser.trim() === "") {
          throw new Error("Сервер не вернул данные пользователя");
        }

        const userData = JSON.parse(rawUser);
        if (!userData.email) throw new Error("Некорректные данные пользователя");

        setUser({ email: userData.email, userId: userData.userId });

        // --- Получение складов
        const resStocks = await fetch("https://stoq-web-api.devspace.bafid.app/api/v1/stocks?skip=0&take=100", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Accept-Language": "en-US",
            "Content-Language": "en-US",
          },
        });

        const rawStocks = await resStocks.text();
        console.log("🏷️ Ответ по складам:", rawStocks);

        if (!rawStocks || rawStocks.trim() === "") {
          throw new Error("Сервер не вернул список складов");
        }

        const stockList = JSON.parse(rawStocks);
        setStocks(stockList);
        setSelectedStockId(stockList[0]?.stockId || null);
      } catch (err: any) {
        console.log("❗ Ошибка загрузки:", err.message);
        Alert.alert("Ошибка", err.message || "Не удалось загрузить данные");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.clear();
    navigation.replace("Login");
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
      <Text style={styles.title}>Профиль</Text>

      {user ? (
        <>
          <Text style={styles.text}>Email: {user.email}</Text>
          <Text style={styles.text}>ID пользователя: {user.userId}</Text>
        </>
      ) : (
        <Text style={styles.text}>Нет данных пользователя</Text>
      )}

      <Text style={[styles.title, { marginTop: 20 }]}>Выбор склада:</Text>

      {stocks.length > 0 ? (
        <Picker
          selectedValue={selectedStockId}
          onValueChange={(itemValue) => setSelectedStockId(itemValue)}
        >
          {stocks.map((stock) => (
            <Picker.Item
              key={stock.stockId}
              label={stock.name}
              value={stock.stockId}
            />
          ))}
        </Picker>
      ) : (
        <Text style={styles.text}>Склады не найдены</Text>
      )}

      {selectedStockId && (
        <Text style={styles.text}>
          ✅ Выбран склад ID: {selectedStockId}
        </Text>
      )}

      <View style={styles.logout}>
        <Button title="Выйти из аккаунта" color="red" onPress={handleLogout} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  text: { fontSize: 16, marginBottom: 5 },
  logout: { marginTop: 40 },
});
