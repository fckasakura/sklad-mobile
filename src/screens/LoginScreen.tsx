import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "https://89fe7478329a133b.mokky.dev/Users";

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Ошибка", "Введите логин и пароль");
      return;
    }

    try {
      const res = await fetch(BASE_URL);
      const users = await res.json();

      const user = users.find(
        (u: any) => u.email === email && u.password === password
      );

      if (!user) {
        Alert.alert("Ошибка", "Неверный логин или пароль");
        return;
      }

      await AsyncStorage.setItem("authToken", "mock-token");
      await AsyncStorage.setItem("userEmail", user.email);
      navigation.reset({
        index: 0,
        routes: [{ name: "Home" }],
      });
      
    } catch (err: any) {
      Alert.alert("Ошибка", err.message || "Произошла ошибка");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Вход</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Пароль"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Button title="Войти" onPress={handleLogin} />

      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text style={styles.link}>Нет аккаунта? Зарегистрироваться</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 30, textAlign: "center" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    marginBottom: 15,
    borderRadius: 8,
  },
  link: {
    marginTop: 20,
    color: "#007bff",
    textAlign: "center",
  },
});
