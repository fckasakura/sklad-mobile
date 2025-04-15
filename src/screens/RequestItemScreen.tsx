import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  TextInput,
  Modal,
  Button,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface StockItem {
  id: number;
  name: string;
  quantity: number;
  stockId: number;
}

export default function RequestItemScreen() {
  const [items, setItems] = useState<StockItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<StockItem | null>(null);
  const [requestQty, setRequestQty] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const stockId = await AsyncStorage.getItem("selectedStockId");
        if (!stockId) {
          Alert.alert("Ошибка", "Склад не выбран");
          return;
        }

        const res = await fetch("https://89fe7478329a133b.mokky.dev/StockItems");
        const data: StockItem[] = await res.json();
        const filtered = data.filter((i) => i.stockId === parseInt(stockId));
        setItems(filtered);
      } catch (err: any) {
        Alert.alert("Ошибка", err.message || "Не удалось загрузить товары");
      }
    };

    fetchItems();
  }, []);

  const handleOpenModal = (item: StockItem) => {
    setSelectedItem(item);
    setRequestQty("");
    setModalVisible(true);
  };

  const handleSubmit = async () => {
    if (!selectedItem || !requestQty) {
      Alert.alert("Ошибка", "Укажите количество");
      return;
    }

    const qty = parseInt(requestQty);
    if (qty <= 0 || qty > selectedItem.quantity) {
      Alert.alert("Ошибка", `Можно запросить от 1 до ${selectedItem.quantity}`);
      return;
    }

    try {
      const res = await fetch("https://89fe7478329a133b.mokky.dev/IssueRequests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stockItemId: selectedItem.id,
          quantity: qty,
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err);
      }

      Alert.alert("✅ Успешно", "Запрос отправлен");
      setModalVisible(false);
    } catch (err: any) {
      Alert.alert("Ошибка", err.message || "Не удалось отправить запрос");
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={<Text>Нет товаров на складе</Text>}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.title}>{item.name}</Text>
            <Text>Доступно: {item.quantity}</Text>
            <Button title="Запросить" onPress={() => handleOpenModal(item)} />
          </View>
        )}
      />

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>
              Запросить: {selectedItem?.name}
            </Text>
            <Text>Доступно: {selectedItem?.quantity}</Text>

            <TextInput
              placeholder="Сколько штук?"
              keyboardType="numeric"
              value={requestQty}
              onChangeText={setRequestQty}
              style={styles.input}
            />

            <View style={styles.modalButtons}>
              <Button title="Отмена" onPress={() => setModalVisible(false)} />
              <Button title="Отправить" onPress={handleSubmit} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  item: {
    backgroundColor: "#f2f2f2",
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "#000000aa",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 10,
    width: "85%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 12,
    padding: 10,
    borderRadius: 6,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
