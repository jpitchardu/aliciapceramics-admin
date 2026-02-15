import { Box } from "@/components";

export function DragHandle() {
  return (
    <Box alignItems="center" paddingTop="s" paddingBottom="xs">
      <Box width={36} height={4} borderRadius="s" backgroundColor="neutral700" />
    </Box>
  );
}
