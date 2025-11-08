import { Box } from "@/components";
import { PieceConfig, PieceDetail, SizeOption } from "@/constants/pieces";
import { useState } from "react";
import { Image, TouchableOpacity } from "react-native";

type PieceTypeCardProps = {
  config: PieceConfig;
  onAddToOrder: (piece: PieceDetail) => void;
};

export function PieceTypeCard({ config, onAddToOrder }: PieceTypeCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [quantity, setQuantity] = useState("1");
  const [size, setSize] = useState<SizeOption | undefined>(
    config.sizes[0] || undefined
  );
  const [description, setDescription] = useState("");

  const handleAddToOrder = () => {
    const pieceDetail: PieceDetail = {
      type: config.type,
      quantity: parseInt(quantity) || 1,
      description,
    };

    if (config.sizes.length > 0 && size) {
      pieceDetail.size = size;
    }

    onAddToOrder(pieceDetail);

    setQuantity("1");
    setDescription("");
    setSize(config.sizes[0] || undefined);
    setIsExpanded(false);
  };

  const isValid = quantity && parseInt(quantity) > 0 && description.trim();

  return (
    <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)}>
      <Box alignItems="center" padding="s">
        <Image
          source={{ uri: config.icon }}
          style={{ width: 90, height: 90 }}
          resizeMode="contain"
        />
      </Box>
    </TouchableOpacity>
  );
}
