import { useMutation } from "@tanstack/react-query";
import { sendMessage as sendMessageApi } from "@/api/data/messages";

export function useSendMessage() {
  return useMutation({
    mutationFn: sendMessageApi,
  });
}
