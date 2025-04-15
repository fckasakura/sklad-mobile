// src/navigation/types.ts

export type RootStackParamList = {
    Login: undefined;
    Register: undefined;
    Home: undefined;
    Profile: undefined;
    AddItemScreen: undefined;
    StockItems: undefined;
    Stock: undefined;
    Movements: undefined;
    Issue: { item?: any }; // 👈 или точнее: { item: StockItem }
    Search: undefined;
    RequestItem: { item: any };
    IssueRequests: undefined;
    EditStockItem: { item: any };
    AddStockItem: undefined;
  };
  