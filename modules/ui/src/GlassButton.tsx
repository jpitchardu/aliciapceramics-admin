import { requireNativeViewManager } from "expo-modules-core";
import { ViewProps } from "react-native";

type GlassButtonProps = ViewProps & {
  label: string;
  icon?: string;
  variant?: "regular" | "prominent";
  onPress: () => void;
};

const NativeGlassButton = requireNativeViewManager("UI");

export function GlassButton({
  label,
  icon,
  variant,
  onPress,
  style,
}: GlassButtonProps) {
  return (
    <NativeGlassButton
      label={label}
      icon={icon}
      variant={variant}
      onPress={onPress}
      style={style}
    />
  );
}
