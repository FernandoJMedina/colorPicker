import React from "react";
import { useCallback } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { ColorPicker } from "./components/ColorPicker";

const COLORS = [
  "red",
  "purple",
  "blue",
  "cyan",
  "green",
  "yellow",
  "orange",
  "black",
  "white",
];
const BACKGROUND_COLOR = "rgba(0,0,0,0.9)";
const { width } = Dimensions.get("window");
const CIRCLE_SIZE = width * 0.8
const PICKER_WIDTH = width * 0.9;
export default function App() {

  const circleColor = useSharedValue<number | string>(COLORS[0])
 

  const rStyle = useAnimatedStyle(() => {
    return {
      backgroundColor:circleColor.value
    }
  })

  const onColorChanged = useCallback((color: string | number)=> {
    'worklet';
    circleColor.value = color
  }, [])


  return (
    <>
      <View style={styles.topContainer}>
        <Animated.View style={[styles.circle, rStyle]} />
      </View>
      <View style={styles.bottomContainer}>
        <ColorPicker
          colors={COLORS}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.lg}
          PICKER_WIDTH={PICKER_WIDTH}
          onColorChanged={onColorChanged}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  topContainer: {
    flex: 3,
    backgroundColor:BACKGROUND_COLOR,
    justifyContent: 'center',
    alignItems: 'center'
  },
  circle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
  },
  bottomContainer: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
    alignItems: "center",
    justifyContent: "center",
  },
  lg: {
    height: 40,
    width: PICKER_WIDTH,
    borderRadius: 20,
  },
});
