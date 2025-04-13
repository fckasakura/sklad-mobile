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
}

export default function StockScreen() {
  const [items, setItems] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const prepareAndLoadStock = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (!token) return;

        // Шаг 1: Получаем список профилей
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
          console.log("⚠️ Нет профилей. Создаём новый...");

          const resCompanies = await fetch(
            "https://stoq-web-api.devspace.bafid.app/api/v1/companies",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const companies = await resCompanies.json();
          if (!companies || !companies.length) {
            console.log("❌ Компании не найдены");
            return;
          }

          const companyId = companies[0].companyId;
          console.log("🏢 Берём компанию:", companyId);

          const resCreate = await fetch(
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

          if (!resCreate.ok) {
            const err = await resCreate.text();
            console.log("❌ Ошибка создания профиля:", err);
            return;
          }

          console.log("✅ Профиль создан");

          let createdProfile;
          try {
            createdProfile = await resCreate.json();
            profiles = [createdProfile];
          } catch {
            console.log(
              "⚠️ Сервер не вернул JSON. Пробуем повторно загрузить профили..."
            );
            const resProfilesRetry = await fetch(
              "https://stoq-web-api.devspace.bafid.app/api/v1/profile-employees",
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            profiles = await resProfilesRetry.json();
          }
        }

        const profileId = profiles[0].profileEmployeeId;
        console.log("✅ Активируем профиль:", profileId);

        const resActivate = await fetch(
          `https://stoq-web-api.devspace.bafid.app/api/v1/default-profile-employees/profile-employees/${profileId}/select`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!resActivate.ok) {
          const err = await resActivate.text();
          console.log("❌ Не удалось активировать профиль:", err);
          return;
        }

        console.log("✅ Профиль активирован!");

        // Шаг 2: Получаем склады
        const resStocks = await fetch(
          "https://stoq-web-api.devspace.bafid.app/api/v1/stocks/under-my-management",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const stocks = await resStocks.json();
        if (!stocks || !stocks.length) {
          console.log("❌ Склады не найдены");
          return;
        }

        const stockId = stocks[0].stockId;
        console.log("📦 Берём склад:", stockId);

        // Шаг 3: Загружаем остатки
        const resItems = await fetch(
          `https://stoq-web-api.devspace.bafid.app/api/v1/stock-items?skip=0&take=25&stockId=${stockId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!resItems.ok) {
          const err = await resItems.text();
          throw new Error(err);
        }

        const data = await resItems.json();
        console.log("✅ Остатки:", data);
        setItems(data);
      } catch (err: any) {
        console.log("❗ Catch ошибка:", err.message);
        Alert.alert("Ошибка", err.message || "Не удалось получить остатки");
      } finally {
        setLoading(false);
      }
    };

    prepareAndLoadStock();
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
          <Text style={styles.title}>{item.name}</Text>
          <Text style={styles.subtitle}>ID продукта: {item.productId}</Text>
          <Text>Количество: {item.quantity}</Text>
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
  },
  subtitle: {
    fontStyle: "italic",
    color: "#666",
  },
});
