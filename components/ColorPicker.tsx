import React from "react";
import { StyleSheet, ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
  TapGestureHandler,
  TapGestureHandlerGestureEvent
} from "react-native-gesture-handler";
import Animated, {
  interpolateColor,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

type ColorsPicker = {
  colors: string[];
  start: React.ComponentProps<typeof LinearGradient>["start"];
  end: React.ComponentProps<typeof LinearGradient>["end"];
  style: ViewStyle;
  PICKER_WIDTH: number;
  onColorChanged: (color: string | number) => void;
};

type PanGestureContext = {
  startX: number;
};

const CIRCLE_PICKER_SIZE = 45;
const INTERNAL_CIRCLE_PICKER_SIZE = CIRCLE_PICKER_SIZE / 2;

function clamp(value: number, min: number, max: number) {
  "worklet";
  return Math.min(Math.max(value, min), max);
}

export function ColorPicker({ colors, PICKER_WIDTH, onColorChanged, ...props }: ColorsPicker) {
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
      // translateY.value = withSpring(-CIRCLE_PICKER_SIZE);
      // scale.value = withSpring(1.2)
    },
    onActive: (event, context) => {
      translateX.value = context.startX + event.translationX;
    },
    onEnd: () => {
      translateY.value = withTiming(0);
      scale.value = withTiming(1)
    },
  });

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: adjustedTranslateX.value }, 
        {scale: scale.value}, 
        {translateY: translateY.value}
      ],
    };
  });

  const rInternalPickerStyle = useAnimatedStyle(() => {
    const inputRange = colors.map((_, index) => ((index + 1) / colors.length) * PICKER_WIDTH );
    const backgroundColor = interpolateColor(translateX.value, inputRange, colors)
    onColorChanged?.(backgroundColor)
    return {
      backgroundColor
    }
  })

  // Tap

  const tapGestureEvent = useAnimatedGestureHandler<TapGestureHandlerGestureEvent>({
    onStart: (event) => {
      translateY.value = withSpring(-CIRCLE_PICKER_SIZE);
      scale.value = withSpring(1.2)
      translateX.value = withSpring(event.absoluteX - CIRCLE_PICKER_SIZE)
    },
    onEnd: (event) => {
      translateY.value = withTiming(0);
      scale.value = withTiming(1)
    }
  })


  return (
    <TapGestureHandler onGestureEvent={tapGestureEvent}>
      <Animated.View>
      <PanGestureHandler onGestureEvent={panGestureEvent}>
        <Animated.View style={styles.container}>
          <LinearGradient colors={colors} {...props} />
          <Animated.View style={[styles.picker, rStyle]}>
            <Animated.View style={[styles.internalPicker, rInternalPickerStyle]} />
          </Animated.View>
        </Animated.View>
      </PanGestureHandler>
      </Animated.View>
    </TapGestureHandler>
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
    alignItems: 'center',
    justifyContent: 'center'
  },
  internalPicker: {
    backgroundColor: "red",
    width: INTERNAL_CIRCLE_PICKER_SIZE,
    height: INTERNAL_CIRCLE_PICKER_SIZE,
    borderRadius: INTERNAL_CIRCLE_PICKER_SIZE / 2,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,.2)'
  }
});
