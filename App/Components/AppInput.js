import styles from './Styles/AppInputStyles'
import React from 'react'
import {
  View,
  Text,
  TextInput,
} from 'react-native';

export const BaseInput = ({ containerStyle, lableStyle, children, label }) => (
  <View style={[styles.baseInput, containerStyle]}>
    <View style={{ width: '90%' }}>
      <Text style={lableStyle}>{label}</Text>
    </View>
    {children}
  </View>
);

export const AppInput = ({ style, children, value, onChange, ...props }) => (
  <BaseInput {...props}>
    <TextInput autoCapitalize = 'none' style={style} value={value} onChangeText={onChange} />
  </BaseInput>
);