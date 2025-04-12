import React, useLayoutEffect } from "react";
import { View, Text, StyleSheet, Button } from "react-native";

export default function HomeScreen({ navigation }: any) {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button title="👤" onPress={() => navigation.navigate("Profile")} />
      ),
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Главное меню</Text>

      <View style={styles.buttonWrapper}>
        <Button title="Остатки товаров" onPress={() => navigation.navigate("Stock")} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { fontSize: 24, marginBottom: 20 },
  buttonWrapper: { width: "80%" },
});
