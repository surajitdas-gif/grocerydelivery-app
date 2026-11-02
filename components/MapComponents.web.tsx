import React from 'react';
import { View, Text } from 'react-native';

const MockComponent = (props: any) => <View {...props} />;

export const MapView = (props: any) => {
  const { children, style, ...rest } = props;
  return (
    <View style={[{ backgroundColor: '#e2e8f0', justifyContent: 'center', alignItems: 'center' }, style]} {...rest}>
      <Text style={{ color: '#64748b', fontWeight: 'bold' }}>Maps are not supported on web preview.</Text>
      <Text style={{ color: '#64748b', marginTop: 10 }}>Please use the mobile app (Android/iOS) to view the map.</Text>
      {/* We don't render children because it might contain markers that expect real map context */}
    </View>
  );
};
export const Marker = MockComponent;
export const Polyline = MockComponent;
export const MapViewDirections = MockComponent;
