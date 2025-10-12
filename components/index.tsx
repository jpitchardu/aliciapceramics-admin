import { createBox, createText } from "@shopify/restyle";
import { TextInput as RNTextInput } from "react-native";
import { Theme } from "../theme";
import { forwardRef } from "react";

// Base components - these are all we really need for the migration
export const Box = createBox<Theme>();
export const Text = createText<Theme>();

// TextInput component with theme support
interface TextInputProps extends React.ComponentProps<typeof RNTextInput> {
  variant?: string;
}

export const TextInput = forwardRef(
  (props: TextInputProps, ref: React.Ref<RNTextInput>) => {
    const { style, ...rest } = props;
    return (
      <RNTextInput
        ref={ref}
        style={[
          {
            borderRadius: 14,
            paddingVertical: 16,
            paddingHorizontal: 16,
            fontSize: 16,
            minHeight: 44,
            backgroundColor: "rgba(225, 175, 161, 0.4)",
            color: "#3d1900",
            borderWidth: 2,
            borderColor: "#fbfaf9",
          },
          style,
        ]}
        {...rest}
      />
    );
  },
);

TextInput.displayName = "TextInput";

// Export additional components that use Box as base for now
// We can enhance these later if needed
export { Box as Button };
export { Box as Card };
