import React, { useState } from "react";
import { View, TextInput, Button, Text, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { loginUser } from "../utils/api";

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await loginUser( email, password );

      if (response.token) {
        await AsyncStorage.setItem("authToken", response.token);
        navigation.navigate("Home");
      } else {
        Alert.alert("Ошибка", "Неверные учетные данные");
      }
    } catch (error) {
      Alert.alert("Ошибка", "Не удалось выполнить вход");
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Email:</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Введите email"
        style={{ borderWidth: 1, marginBottom: 10 }}
      />
      <Text>Пароль:</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Введите пароль"
        secureTextEntry
        style={{ borderWidth: 1, marginBottom: 10 }}
      />
      <Button title="Войти" onPress={handleLogin} />
      <Button title="Нет аккаунта? Регистрация" onPress={() => navigation.navigate("Register")} />
    </View>
  );
}
