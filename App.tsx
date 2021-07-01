import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
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
const PICKER_WIDTH = width * 0.9;
export default function App() {
  return (
    <>
      <View style={styles.topContainer}></View>
      <View style={styles.bottomContainer}>
        <ColorPicker
          colors={COLORS}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.lg}
          PICKER_WIDTH={PICKER_WIDTH}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  topContainer: {
    flex: 3,
    backgroundColor: "#FFFFFF",
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
