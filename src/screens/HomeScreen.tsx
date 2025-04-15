import React, { useLayoutEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

export default function HomeScreen({ navigation }: any) {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
          <Ionicons name="person-circle-outline" size={28} color="#007AFF" style={{ marginRight: 12 }} />
        </TouchableOpacity>
      ),
      title: "Главное меню",
    });
  }, [navigation]);

  const buttons = [
    { label: "Перемещения", screen: "Movements", icon: "swap-horizontal" },
    { label: "Выдача", screen: "Issue", icon: "exit-outline" },
    { label: "Склад", screen: "StockItems", icon: "cube-outline" },
    { label: "Поиск товара", screen: "Search", icon: "search-outline" },
    { label: "Настройки", screen: "Profile", icon: "settings-outline" },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {buttons.map((btn, index) => (
        <TouchableOpacity
          key={index}
          style={styles.button}
          onPress={() => navigation.navigate(btn.screen)}
        >
          <Ionicons name={btn.icon as any} size={32} color="#fff" />
          <Text style={styles.buttonText}>{btn.label}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
  button: {
    backgroundColor: "#007AFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingVertical: 18,
    paddingHorizontal: 20,
    width: "100%",
    borderRadius: 12,
    gap: 16,
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
