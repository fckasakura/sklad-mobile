import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Button,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";

const API_BASE = "https://89fe7478329a133b.mokky.dev";

export default function ProfileScreen({ navigation }: any) {
  const [user, setUser] = useState<any>(null);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [selectedProfileId, setSelectedProfileId] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const savedUserId = await AsyncStorage.getItem("userId");
      if (!savedUserId) throw new Error("Нет userId");

      // Загружаем пользователя
      const resUser = await fetch(`${API_BASE}/Users/${savedUserId}`);
      const dataUser = await resUser.json();
      setUser(dataUser);

      // Загружаем профили
      const resProfiles = await fetch(`${API_BASE}/Profiles?userId=${savedUserId}`);
      const dataProfiles = await resProfiles.json();
      setProfiles(dataProfiles);

      // Сохраняем выбранный профиль
      const savedProfileId = await AsyncStorage.getItem("profileId");
      if (savedProfileId) setSelectedProfileId(savedProfileId);
    } catch (err: any) {
      Alert.alert("Ошибка", err.message || "Не удалось загрузить профиль");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreateProfile = async () => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      if (!userId) return;

      const res = await fetch(`${API_BASE}/Profiles`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: Number(userId),
          name: "Новый профиль",
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err);
      }

      Alert.alert("✅ Профиль создан");
      load();
    } catch (err: any) {
      Alert.alert("Ошибка", err.message);
    }
  };

  const handleSelectProfile = async (val: string) => {
    setSelectedProfileId(val);
    await AsyncStorage.setItem("profileId", val);
  };

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
      <Text style={styles.header}>Профиль</Text>
      <Text style={styles.label}>Email: {user?.email || "неизвестен"}</Text>

      <Text style={styles.label}>Выбор профиля:</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={selectedProfileId}
          onValueChange={(val) => handleSelectProfile(val)}
        >
          <Picker.Item label="-- Выбрать профиль --" value={undefined} />
          {profiles.map((p) => (
            <Picker.Item key={p.id} label={p.name} value={String(p.id)} />
          ))}
        </Picker>
      </View>

      {profiles.length === 0 && (
        <Button title="Создать профиль" onPress={handleCreateProfile} />
      )}

      <View style={{ marginTop: 30 }}>
        <Button title="Выйти из аккаунта" color="#FF3B30" onPress={handleLogout} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 16 },
  label: { fontSize: 16, marginBottom: 8 },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 20,
    backgroundColor: "#f2f2f2",
  },
});
