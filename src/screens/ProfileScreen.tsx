import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ProfileScreen({ navigation }: any) {
  const [user, setUser] = useState<{ email: string; userId: number; userType: string } | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      const email = await AsyncStorage.getItem("userEmail");
      const userId = await AsyncStorage.getItem("userId");
      const userType = await AsyncStorage.getItem("userType");

      if (email && userId && userType) {
        setUser({ email, userId: parseInt(userId), userType });
      }
    };

    loadUser();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.multiRemove(["authToken", "refreshToken", "userEmail", "userId", "userType"]);
    navigation.replace("Login");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Профиль</Text>

      {user ? (
        <>
          <Text>Email: {user.email}</Text>
          <Text>ID: {user.userId}</Text>
          <Text>Тип: {user.userType}</Text>
        </>
      ) : (
        <Text>Загрузка данных...</Text>
      )}

      <View style={styles.logoutBtn}>
        <Button title="Выйти из аккаунта" color="red" onPress={handleLogout} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  title: { fontSize: 24, textAlign: "center", marginBottom: 20, fontWeight: "bold" },
  logoutBtn: { marginTop: 40 },
});
