import React from "react";
import { StyleSheet, ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";

type ColorsPicker = {
  colors: string[];
  start: React.ComponentProps<typeof LinearGradient>["start"];
  end: React.ComponentProps<typeof LinearGradient>["end"];
  style: ViewStyle;
  PICKER_WIDTH: number;
};

type PanGestureContext = {
  startX: number;
};

const CIRCLE_PICKER_SIZE = 45;

function clamp(value: number, min: number, max: number) {
  "worklet";
  return Math.min(Math.max(value, min), max);
}

export function ColorPicker({ colors, PICKER_WIDTH, ...props }: ColorsPicker) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);

  // Clean way
  const adjustedTranslateX = useDerivedValue(() =>
    clamp(translateX.value, 0, PICKER_WIDTH - CIRCLE_PICKER_SIZE)
  );

  // Legible way

  // const adjustedTranslateX = useDerivedValue(() => {
  //   console.log(translateX.value);
  //   return Math.min(
  //     Math.max(translateX.value, 0),
  //     PICKER_WIDTH - CIRCLE_PICKER_SIZE
  //   );
  // });

  const panGestureEvent = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    PanGestureContext
  >({
    onStart: (_, context) => {
      context.startX = adjustedTranslateX.value;
    },
    onActive: (event, context) => {
      translateX.value = context.startX + event.translationX;
    },
    onEnd: () => {},
  });

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: adjustedTranslateX.value }],
    };
  });

  return (
    <PanGestureHandler onGestureEvent={panGestureEvent}>
      <Animated.View style={styles.container}>
        <LinearGradient colors={colors} {...props} />
        <Animated.View style={[styles.picker, rStyle]} />
      </Animated.View>
    </PanGestureHandler>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
  },
  picker: {
    position: "absolute",
    backgroundColor: "white",
    width: CIRCLE_PICKER_SIZE,
    height: CIRCLE_PICKER_SIZE,
    borderRadius: CIRCLE_PICKER_SIZE / 2,
  },
});
