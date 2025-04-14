import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://stoq-web-api.devspace.bafid.app/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login: email, password }),
      });

      const raw = await res.text();
      if (!res.ok) throw new Error(raw);

      const data = JSON.parse(raw);
      const token = data.accessToken;
      await AsyncStorage.setItem("authToken", token);

      // ✅ Профиль
      const resProfile = await fetch("https://stoq-web-api.devspace.bafid.app/api/v1/profile-employees", {
        headers: { Authorization: `Bearer ${token}` },
      });

      let profiles = await resProfile.json();

      if (!profiles || profiles.length === 0) {
        const resCompanies = await fetch("https://stoq-web-api.devspace.bafid.app/api/v1/companies", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const companies = await resCompanies.json();
        const companyId = companies[0].companyId;

        const resCreate = await fetch("https://stoq-web-api.devspace.bafid.app/api/v1/profile-employees", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ companyId }),
        });

        const created = await resCreate.json();
        profiles = [created];
      }

      const profileId = profiles[0].profileEmployeeId;

      await fetch(
        `https://stoq-web-api.devspace.bafid.app/api/v1/default-profile-employees/profile-employees/${profileId}/select`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // ✅ Склад
      const resStocks = await fetch(
        "https://stoq-web-api.devspace.bafid.app/api/v1/stocks/under-my-management",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const stocks = await resStocks.json();

      if (stocks.length > 0) {
        await AsyncStorage.setItem("selectedStockId", stocks[0].stockId.toString());
      } else {
        const resCreateStock = await fetch(
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

        const created = await resCreateStock.json();
        await AsyncStorage.setItem("selectedStockId", created.stockId.toString());
      }

      navigation.replace("Home");
    } catch (err: any) {
      console.log("❌ Ошибка входа:", err.message);
      Alert.alert("Ошибка", err.message || "Не удалось выполнить вход");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Вход</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Пароль"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <Button title="Войти" onPress={handleLogin} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  title: { fontSize: 24, marginBottom: 20, textAlign: "center" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
});
