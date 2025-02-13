import React, { useState } from "react";
import { View, Text, TextInput, Button } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/navigationTypes";

type Props = NativeStackScreenProps<RootStackParamList, "AddEditProduct">;