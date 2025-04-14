import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface StockItem {
  stockItemId: number;
  name: string;
  quantity: number;
  productId: number;
  isDamaged: boolean;
}

export default function StockScreen() {
  const [items, setItems] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const prepareEverything = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (!token) throw new Error("Нет токена");

        // 🔹 Получаем профили
        const resProfiles = await fetch(
          "https://stoq-web-api.devspace.bafid.app/api/v1/profile-employees",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        let profiles = await resProfiles.json();

        if (!profiles || !profiles.length) {
          console.log("⚠️ Нет профилей — создаём новый");

          // 🔹 Получаем компанию
          const resCompanies = await fetch(
            "https://stoq-web-api.devspace.bafid.app/api/v1/companies",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const companies = await resCompanies.json();
          if (!companies || !companies.length) throw new Error("Нет компаний");

          const companyId = companies[0].companyId;

          const resCreateProfile = await fetch(
            "https://stoq-web-api.devspace.bafid.app/api/v1/profile-employees",
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ companyId }),
            }
          );

          if (!resCreateProfile.ok) {
            const err = await resCreateProfile.text();
            throw new Error("Ошибка создания профиля: " + err);
          }

          profiles = [await resCreateProfile.json()];
        }

        const profileId = profiles[0].profileEmployeeId;

        // 🔹 Активируем профиль
        await fetch(
          `https://stoq-web-api.devspace.bafid.app/api/v1/default-profile-employees/profile-employees/${profileId}/select`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // 🔹 Получаем склад или создаём
        let stockId = await AsyncStorage.getItem("selectedStockId");

        if (!stockId) {
          console.log("⚠️ Нет selectedStockId — создаём склад");

          const resStockCreate = await fetch(
            "https://stoq-web-api.devspace.bafid.app/api/v1/stocks",
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ name: "Авто-склад" }),
            }
          );

          if (!resStockCreate.ok) {
            const err = await resStockCreate.text();
            throw new Error("Ошибка создания склада: " + err);
          }

          const created = await resStockCreate.json();
          stockId = String(created.stockId);
          await AsyncStorage.setItem("selectedStockId", stockId);
        }

        // 🔹 Получаем остатки товаров
        const resItems = await fetch(
          `https://stoq-web-api.devspace.bafid.app/api/v1/stock-items?skip=0&take=25&stockId=${stockId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const rawText = await resItems.text();
console.log("📦 Ответ от сервера:", rawText.length > 100 ? rawText.slice(0, 100) + "..." : rawText);

if (!rawText || rawText.trim().length < 5) {
  throw new Error("Сервер вернул пустой или слишком короткий ответ");
}

try {
  const data = JSON.parse(rawText);
  setItems(data);
  console.log("✅ Остатки загружены:", data.length);
} catch (parseErr) {
  console.log("❌ Не удалось распарсить JSON:", rawText);
  throw new Error("Ошибка парсинга JSON");
}


        const data = JSON.parse(rawText);
        setItems(data);
        console.log("✅ Остатки загружены");
      } catch (err: any) {
        console.log("❗ Ошибка:", err.message);
        Alert.alert("Ошибка", err.message || "Что-то пошло не так");
      } finally {
        setLoading(false);
      }
    };

    prepareEverything();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item.stockItemId.toString()}
      renderItem={({ item }) => (
        <View style={styles.item}>
          <Text style={styles.title}>{item.name || "Без названия"}</Text>
          <Text>ID продукта: {item.productId}</Text>
          <Text>Количество: {item.quantity}</Text>
          <Text>Повреждён: {item.isDamaged ? "Да" : "Нет"}</Text>
        </View>
      )}
      contentContainerStyle={styles.list}
    />
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  list: {
    padding: 20,
  },
  item: {
    backgroundColor: "#f2f2f2",
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
  },
});
