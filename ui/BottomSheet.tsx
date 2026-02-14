import { Box, Text } from "@/components";
import { theme } from "@/theme";
import { ReactNode } from "react";
import {
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  height?: number;
  children: ReactNode;
}

function BottomSheetRoot({ visible, onClose, height, children }: BottomSheetProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity activeOpacity={1}>
          <Box
            backgroundColor="primary50"
            borderTopLeftRadius="xl"
            borderTopRightRadius="xl"
            style={height ? { height } : undefined}
          >
            <Box alignItems="center" paddingTop="s" paddingBottom="xs">
              <Box
                width={36}
                height={4}
                borderRadius="s"
                backgroundColor="neutral700"
              />
            </Box>
            {children}
          </Box>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

function Header({ children }: { children: ReactNode }) {
  return (
    <Box paddingHorizontal="m" paddingBottom="s">
      <Text variant="heading" textAlign="center">
        {children}
      </Text>
    </Box>
  );
}

function Body({ children, scrollable = false }: { children: ReactNode; scrollable?: boolean }) {
  if (scrollable) {
    return (
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: theme.spacing.m, paddingBottom: theme.spacing.xl }}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    );
  }
  return (
    <Box paddingHorizontal="m" flex={1}>
      {children}
    </Box>
  );
}

function Footer({ children }: { children: ReactNode }) {
  return (
    <Box paddingHorizontal="m" paddingBottom="xl" gap="s">
      {children}
    </Box>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
});

export const BottomSheet = Object.assign(BottomSheetRoot, { Header, Body, Footer });
