import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

export default function SelectUserScreen({ navigation, route }: any) {
  const [users, setUsers] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch("https://89fe7478329a133b.mokky.dev/Users");
      const data = await res.json();
      setUsers(data);
      setFiltered(data);
      setLoading(false);
    };

    fetchUsers();
  }, []);

  const handleSearch = (text: string) => {
    setSearch(text);
    const lower = text.toLowerCase();
    setFiltered(
      users.filter(
        (u) =>
          u.email?.toLowerCase().includes(lower) ||
          u.firstName?.toLowerCase().includes(lower) ||
          u.lastName?.toLowerCase().includes(lower)
      )
    );
  };

  const handleSelect = (user: any) => {
    route.params?.onSelect?.(user);
    navigation.goBack();
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Поиск по email, имени..."
        value={search}
        onChangeText={handleSearch}
      />

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.userItem}
            onPress={() => handleSelect(item)}
          >
            <Text style={styles.name}>{item.firstName} {item.lastName}</Text>
            <Text style={styles.email}>{item.email}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
  },
  userItem: {
    padding: 12,
    backgroundColor: "#f2f2f2",
    borderRadius: 10,
    marginBottom: 10,
  },
  name: { fontWeight: "bold", fontSize: 16 },
  email: { color: "#666" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
});
