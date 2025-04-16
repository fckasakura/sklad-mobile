import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";

export default function ViewStockItemScreen({ route, navigation }: any) {
  const { item } = route.params;

  if (!item) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>❌ Ошибка: товар не найден</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{item.name || "Без названия"}</Text>
      <Text style={styles.info}>ID продукта: {item.productId}</Text>
      <Text style={styles.info}>Цена: {item.price || 0} ₽</Text>
      <Text style={styles.info}>Количество: {item.quantity}</Text>
      <Text style={styles.info}>Склад ID: {item.stockId}</Text>
      <Text style={styles.info}>Повреждён: {item.isDamaged ? "Да" : "Нет"}</Text>

      <View style={styles.buttonBlock}>
        <Button
          title="Редактировать"
          onPress={() => navigation.navigate("EditStockItem", { item })}
        />
        <Button
          title="Запросить"
          onPress={() => navigation.navigate("RequestItem", { item })}
        />
        <Button
          title="Выдать"
          onPress={() => navigation.navigate("Issue", { item })}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 16 },
  info: { fontSize: 16, marginBottom: 8 },
  buttonBlock: {
    marginTop: 24,
    gap: 12,
  },
  error: {
    fontSize: 18,
    color: "red",
  },
});
