import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import EditStockItemScreen from "../screens/EditStockItemScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import StockItemsScreen from "../screens/StockItemsScreen";
import MovementsScreen from "@screens/MovementsScreen";
import IssueScreen from "@screens/IssueScreen";
import SearchScreen from "@screens/SearchScreen";
import StocksScreen from "@screens/StockScreen";
import MovementsHistoryScreen from "../screens/MovementsHistoryScreen";
import SelectUserScreen from "../screens/SelectUserScreen";
import RequestItemScreen from "../screens/RequestItemScreen";
import IssueRequestsScreen from "../screens/IssueRequestsScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const [isAuth, setIsAuth] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem("authToken");
      setIsAuth(!!token);
    };
    checkAuth();
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
<Stack.Screen name="StockItems" component={StockItemsScreen} />
<Stack.Screen name="Profile" component={ProfileScreen} />
<Stack.Screen name="Movements" component={MovementsScreen} />
<Stack.Screen name="MovementsHistory" component={MovementsHistoryScreen} />
<Stack.Screen name="Issue" component={IssueScreen} />
<Stack.Screen name="Search" component={SearchScreen} />
<Stack.Screen name="Stocks" component={StocksScreen} />
<Stack.Screen name="SelectUser" component={SelectUserScreen} />
<Stack.Screen name="RequestItem" component={RequestItemScreen} />
<Stack.Screen name="IssueRequests" component={IssueRequestsScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
