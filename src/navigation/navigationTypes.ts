export type RootStackParamList = {
  Tabs: undefined;
  AddReservationForm: undefined;
  ReservationDetails: { reservation: any };
  UpdateReservation: { reservation: any };
  AgendaSettings: undefined;
  StoreSettings: undefined;
  AlertsSettings: undefined;

  // Navegación de la tienda
  AddEditProduct: { 
    product?: { 
      id: string; 
      name: string; 
      description?: string;  // Hacer opcional
      price: number; 
      stock: number; 
    } 
  };
  ProductDetail: { productId: string };
  SalesHistory: undefined;
};

export type TabParamList = {
  Home: undefined;
  Settings: undefined;
  Store: undefined;
  Calendar: undefined;
};