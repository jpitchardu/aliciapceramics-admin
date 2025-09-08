import React from "react";
import type { ViewProps } from "react-native";
import { View } from "react-native";
import type { SpaceVariant, VariantProps } from "../types";
import { hstackStyle } from "./styles";

type IHStackProps = ViewProps & VariantProps<typeof hstackStyle>;

const HStack = React.forwardRef<React.ComponentRef<typeof View>, IHStackProps>(
  function HStack({ className, space, reversed, ...props }, ref) {
    return (
      <View
        className={hstackStyle({
          space: space as SpaceVariant,
          reversed: reversed as boolean | undefined,
          class: className,
        })}
        {...props}
        ref={ref}
      />
    );
  }
);

HStack.displayName = "HStack";

export { HStack };
