import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Button,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

interface StockItem {
  id: number;
  name: string;
  quantity: number;
  productId: number;
  isDamaged?: boolean;
  stockId?: number;
  price?: number;
}

export default function SearchScreen() {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<StockItem[]>([]);
  const [filtered, setFiltered] = useState<StockItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<StockItem | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    const fetchItems = async () => {
      const res = await fetch("https://89fe7478329a133b.mokky.dev/StockItems");
      const data = await res.json();
      setItems(data);
      setFiltered(data);
    };

    fetchItems();
  }, []);

  const handleSearch = (text: string) => {
    setQuery(text);
    const filteredData = items.filter((item) =>
      item.name?.toLowerCase().includes(text.toLowerCase())
    );
    setFiltered(filteredData);
  };

  const openModal = (item: StockItem) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedItem(null);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Поиск по названию"
        value={query}
        onChangeText={handleSearch}
      />

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => openModal(item)}>
            <View style={styles.item}>
              <Text style={styles.title}>{item.name || "Без названия"}</Text>
              <Text>ID продукта: {item.productId}</Text>
              <Text>Количество: {item.quantity}</Text>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* Модалка с действиями */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {selectedItem?.name || "Товар"}
            </Text>

            <Button
              title="👁 Посмотреть"
              onPress={() => {
                closeModal();
                navigation.navigate("EditStockItem", { item: selectedItem });
              }}
            />

            <View style={styles.spacer} />

            <Button
              title="📦 Запросить"
              onPress={() => {
                closeModal();
                navigation.navigate("RequestItem", { item: selectedItem });
              }}
            />

            <View style={styles.spacer} />

            <Button
              title="✅ Выдать"
              onPress={() => {
                closeModal();
                navigation.navigate("Issue", { item: selectedItem });
              }}
            />

            <View style={styles.spacer} />
            <Button title="Отмена" color="#999" onPress={closeModal} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 20,
    padding: 10,
    borderRadius: 8,
  },
  item: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 8,
    marginBottom: 12,
  },
  title: { fontWeight: "bold", fontSize: 16, marginBottom: 4 },

  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
    paddingHorizontal: 30,
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 10,
    gap: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  spacer: { height: 10 },
});
