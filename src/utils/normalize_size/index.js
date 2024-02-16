import React, { Component } from 'react';
import { View, Text, Dimensions } from 'react-native';

const base_unit_height = 667;
const base_unit_width = 375;
const heigth = Dimensions.get('window').height

const NormalizeSize = {

  normalize: (size) => {
    return (size / base_unit_height) * heigth
  }
}

export default NormalizeSize;

