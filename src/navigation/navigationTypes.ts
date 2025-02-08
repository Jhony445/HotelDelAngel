// navigationTypes.ts
export type RootStackParamList = {
  Tabs: undefined;
  AddReservationForm: undefined;
  ReservationDetails: { reservation: any };
  UpdateReservation: { reservation: any }; // Agregado para la pantalla de actualización
};

export type TabParamList = {
  Home: undefined;
  Settings: undefined;
  Store: undefined;
  Calendar: undefined;
};