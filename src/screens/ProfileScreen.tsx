import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Button, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ProfileScreen({ navigation }: any) {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      const savedEmail = await AsyncStorage.getItem("userEmail");
      setEmail(savedEmail);
    };
    loadUser();
  }, []);

  const logout = async () => {
    await AsyncStorage.removeItem("authToken");
    await AsyncStorage.removeItem("userEmail");
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Профиль</Text>
      <Text style={styles.label}>Email:</Text>
      <Text style={styles.value}>{email}</Text>

      <View style={{ marginTop: 30 }}>
        <Button title="Выйти из аккаунта" color="red" onPress={logout} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 30, textAlign: "center" },
  label: { fontSize: 16, color: "#555" },
  value: { fontSize: 18, marginBottom: 10 },
});
