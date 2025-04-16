import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RootStackParamList } from "./types";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import AddItemScreen from "../screens/AddStockItemScreen";
import StockItemsScreen from "../screens/StockItemsScreen";
import StockScreen from "../screens/StockScreen";
import MovementsScreen from "../screens/MovementsScreen";
import IssueScreen from "../screens/IssueScreen";
import SearchScreen from "../screens/SearchScreen";
import RequestItemScreen from "../screens/RequestItemScreen";
import IssueRequestsScreen from "../screens/IssueRequestsScreen";
import EditStockItemScreen from "../screens/EditStockItemScreen";
import AddStockItemScreen from "../screens/AddStockItemScreen";
import ViewStockItemScreen from "../screens/ViewStockItemScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const [isAuth, setIsAuth] = useState<boolean | null>(null);

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem("authToken");
      setIsAuth(!!token);
    };
    checkToken();
  }, []);

  if (isAuth === null) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerTitleAlign: "center" }}>
        {!isAuth ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="AddItemScreen" component={AddItemScreen} />
            <Stack.Screen name="StockItems" component={StockItemsScreen} />
            <Stack.Screen name="Stock" component={StockScreen} />
            <Stack.Screen name="Movements" component={MovementsScreen} />
            <Stack.Screen name="Issue" component={IssueScreen} />
            <Stack.Screen name="Search" component={SearchScreen} />
            <Stack.Screen name="RequestItem" component={RequestItemScreen} />
            <Stack.Screen name="IssueRequests" component={IssueRequestsScreen} />
            <Stack.Screen name="EditStockItem" component={EditStockItemScreen} />
            <Stack.Screen name="AddStockItem" component={AddStockItemScreen} />
            <Stack.Screen name="ViewStockItem" component={ViewStockItemScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
