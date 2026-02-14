import { BulkCommissionCode } from "@/hooks/useBulkCodes";
import { ListCard } from "@/ui/ListCard";

interface BulkCodeCardProps {
  bulkCode: BulkCommissionCode;
  onPress?: (codeId: string) => void;
}

export function BulkCodeCard({ bulkCode, onPress }: BulkCodeCardProps) {
  const isRedeemed = !!bulkCode.redeemed_at;

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const subtitle = `Code: ${bulkCode.code}`;
  const meta = isRedeemed
    ? `Earliest: ${formatDate(bulkCode.earliest_completion_date)} • Redeemed: ${formatDate(bulkCode.redeemed_at!)}`
    : `Earliest: ${formatDate(bulkCode.earliest_completion_date)}`;

  return (
    <ListCard
      title={bulkCode.name}
      badge={isRedeemed ? "REDEEMED" : undefined}
      badgeBg="interactive300"
      subtitle={subtitle}
      meta={meta}
      onPress={onPress ? () => onPress(bulkCode.id) : undefined}
    />
  );
}
