import React, { useLayoutEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function HomeScreen({ navigation }: any) {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
          <Text style={styles.headerBtn}>👤</Text>
        </TouchableOpacity>
      ),
      title: "Главное меню",
    });
  }, [navigation]);

  const buttons = [
    { label: "Перемещения", screen: "Movements" },
    { label: "Выдача", screen: "Issue" },
    { label: "Склад", screen: "StockItems" },
    { label: "Поиск товара", screen: "Search" },
    { label: "Запрос на выдачу", screen: "RequestItem" },
    { label: "Настройки", screen: "Profile" },
  ];

  return (
    <View style={styles.container}>
      {buttons.map((btn, index) => (
        <TouchableOpacity
          key={index}
          style={styles.button}
          onPress={() => navigation.navigate(btn.screen)}
        >
          <Text style={styles.buttonText}>{btn.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", gap: 16 },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
    width: "80%",
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "600" },
  headerBtn: { fontSize: 22, marginRight: 12 },
});
