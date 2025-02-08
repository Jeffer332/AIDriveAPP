// src/components/ProvinceDropdown.js
import React from 'react';
import { View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import RegisterScreenStyles from '../styles/RegisterScreenStyles';
import { Ionicons } from '@expo/vector-icons';

const provinces = [
  { label: 'Azuay', value: 'Azuay' },
  { label: 'Bolívar', value: 'Bolívar' },
  { label: 'Cañar', value: 'Cañar' },
  { label: 'Carchi', value: 'Carchi' },
  { label: 'Chimborazo', value: 'Chimborazo' },
  { label: 'Cotopaxi', value: 'Cotopaxi' },
  { label: 'El Oro', value: 'El Oro' },
  { label: 'Esmeraldas', value: 'Esmeraldas' },
  { label: 'Galápagos', value: 'Galápagos' },
  { label: 'Guayas', value: 'Guayas' },
  { label: 'Imbabura', value: 'Imbabura' },
  { label: 'Loja', value: 'Loja' },
  { label: 'Los Ríos', value: 'Los Ríos' },
  { label: 'Manabí', value: 'Manabí' },
  { label: 'Morona Santiago', value: 'Morona Santiago' },
  { label: 'Napo', value: 'Napo' },
  { label: 'Orellana', value: 'Orellana' },
  { label: 'Pastaza', value: 'Pastaza' },
  { label: 'Pichincha', value: 'Pichincha' },
  { label: 'Santa Elena', value: 'Santa Elena' },
  { label: 'Santo Domingo', value: 'Santo Domingo' },
  { label: 'Sucumbíos', value: 'Sucumbíos' },
  { label: 'Tungurahua', value: 'Tungurahua' },
  { label: 'Zamora-Chinchipe', value: 'Zamora-Chinchipe' },
];

const ProvinceDropdown = ({ value, onChange }) => {
  return (
    <View style={RegisterScreenStyles.dropdownContainer}>
      <Ionicons
        name="location-outline"
        size={20}
        color="#BCC1CAFF"
        style={RegisterScreenStyles.iconLeft}
      />
      <Dropdown
        style={RegisterScreenStyles.dropdown}
        data={provinces}
        labelField="label"
        valueField="value"
        placeholder="Selecciona una provincia"
        placeholderStyle={RegisterScreenStyles.dropdownPlaceholder}
        selectedTextStyle={RegisterScreenStyles.dropdownText} //
        value={value}
        maxHeight={200}
        itemTextStyle={RegisterScreenStyles.dropdownItemText}
        onChange={item => {
          onChange(item.value);
        }}
      />
    </View>
  );
};

export default ProvinceDropdown;
