import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Button,
  TextInput,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";

const API_BASE = "https://89fe7478329a133b.mokky.dev";

export default function ProfileScreen({ navigation }: any) {
  const [user, setUser] = useState<any>(null);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [selectedProfileId, setSelectedProfileId] = useState<string | undefined>();
  const [profileName, setProfileName] = useState<string>("");
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

      const savedProfileId = await AsyncStorage.getItem("profileId");
      if (savedProfileId) {
        setSelectedProfileId(savedProfileId);
        const current = dataProfiles.find((p: any) => String(p.id) === savedProfileId);
        if (current) setProfileName(current.name);
      }
    } catch (err: any) {
      Alert.alert("Ошибка", err.message || "Не удалось загрузить данные");
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
          name: `Профиль #${profiles.length + 1}`,
        }),
      });

      if (!res.ok) throw new Error("Ошибка при создании профиля");

      Alert.alert("✅ Профиль создан");
      load();
    } catch (err: any) {
      Alert.alert("Ошибка", err.message);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      if (!selectedProfileId) return;
      const res = await fetch(`${API_BASE}/Profiles/${selectedProfileId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: profileName }),
      });

      if (!res.ok) throw new Error("Ошибка при обновлении профиля");

      Alert.alert("✅ Имя профиля обновлено");
      load();
    } catch (err: any) {
      Alert.alert("Ошибка", err.message);
    }
  };

  const handleDeleteProfile = async () => {
    try {
      if (!selectedProfileId) return;

      await AsyncStorage.removeItem("profileId");

      const res = await fetch(`${API_BASE}/Profiles/${selectedProfileId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Ошибка при удалении");

      Alert.alert("✅ Профиль удалён");
      setSelectedProfileId(undefined);
      setProfileName("");
      load();
    } catch (err: any) {
      Alert.alert("Ошибка", err.message);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.clear();
    navigation.replace("Login");
  };

  const handleSelectProfile = async (val: string) => {
    setSelectedProfileId(val);
    await AsyncStorage.setItem("profileId", val);
    const profile = profiles.find((p) => String(p.id) === val);
    setProfileName(profile?.name || "");
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

      <Text style={styles.label}>Ваши профили:</Text>
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

      {selectedProfileId && (
        <>
          <Text style={styles.label}>Редактировать имя профиля:</Text>
          <TextInput
            style={styles.input}
            value={profileName}
            onChangeText={setProfileName}
          />
          <Button title="💾 Сохранить" onPress={handleUpdateProfile} />
          <View style={{ marginTop: 10 }}>
            <Button title="🗑️ Удалить профиль" color="#FF3B30" onPress={handleDeleteProfile} />
          </View>
        </>
      )}

      <View style={{ marginTop: 30 }}>
        <Button title="➕ Создать профиль" onPress={handleCreateProfile} />
      </View>

      <View style={{ marginTop: 40 }}>
        <Button title="🚪 Выйти из аккаунта" color="#888" onPress={handleLogout} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 16 },
  label: { fontSize: 16, marginTop: 10 },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 20,
    backgroundColor: "#f2f2f2",
  },
  input: {
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
});
