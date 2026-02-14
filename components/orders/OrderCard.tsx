import { Order } from "@/hooks/useOrders";
import { ListCard } from "@/ui/ListCard";

type OrderCardProps = {
  order: {
    id: string;
    status: string | null;
    name: string | null;
    type: string | null;
    due_date: string | null;
    timeline: string | null;
    customers: { name: string } | null;
    order_details: { id: string; quantity: number; type: string }[];
  };
  onPress: (id: string) => void;
};

export function OrderCard({ order, onPress }: OrderCardProps) {
  const dateString = order.due_date || order.timeline;
  const meta = dateString
    ? `Due: ${new Date(dateString).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
    : undefined;

  return (
    <ListCard
      title={order.customers?.name || order.name || "Order"}
      badge={order.type?.toUpperCase()}
      badgeBg={order.type === "commissioned" ? "interactive300" : "input300"}
      subtitle={`Status: ${order.status || "pending"}`}
      meta={meta}
      onPress={() => onPress(order.id)}
    />
  );
}
