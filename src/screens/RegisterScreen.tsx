import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";

export default function RegisterScreen({ navigation }: any) {
  const [form, setForm] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
    country: "",
    city: "",
    plan: "",
  });

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleRegister = async () => {
    if (!form.email || !form.password) {
      Alert.alert("Ошибка", "Email и пароль обязательны");
      return;
    }

    try {
      const res = await fetch("https://89fe7478329a133b.mokky.dev/Users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err);
      }

      Alert.alert("✅ Успешно", "Вы зарегистрированы!");
      navigation.replace("Login");
    } catch (err: any) {
      Alert.alert("Ошибка", err.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {[
        { label: "Имя", key: "firstName" },
        { label: "Фамилия", key: "lastName" },
        { label: "Email", key: "email" },
        { label: "Пароль", key: "password" },
        { label: "Телефон", key: "phone" },
        { label: "Страна", key: "country" },
        { label: "Город", key: "city" },
        { label: "План", key: "plan" },
      ].map((item) => (
        <View key={item.key} style={styles.inputWrapper}>
          <Text>{item.label}:</Text>
          <TextInput
            secureTextEntry={item.key === "password"}
            style={styles.input}
            value={(form as any)[item.key]}
            onChangeText={(text) => handleChange(item.key, text)}
          />
        </View>
      ))}

      <Button title="Зарегистрироваться" onPress={handleRegister} />
      <View style={{ marginTop: 10 }}>
        <Button
          title="У меня уже есть аккаунт"
          onPress={() => navigation.replace("Login")}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  inputWrapper: { marginBottom: 15 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
  },
});
