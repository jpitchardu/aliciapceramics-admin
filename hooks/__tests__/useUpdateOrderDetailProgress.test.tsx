import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useUpdateOrderDetailProgress } from "../useUpdateOrderDetailProgress";
import * as ordersApi from "@/api/data/orders";
import { ReactNode } from "react";

jest.mock("@/api/data/orders");

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useUpdateOrderDetailProgress", () => {
  const orderId = "order-123";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should successfully update order detail progress", async () => {
    const mockUpdatedDetail = {
      id: "detail-123",
      status: "build",
      completed_quantity: 5,
      quantity: 10,
      type: "mug-with-handle",
      description: "Test mug",
      order_id: orderId,
      size: "medium",
      created_at: "2025-01-01T00:00:00Z",
      status_changed_at: "2025-01-01T12:00:00Z",
    };

    (ordersApi.updateOrderDetailProgress as jest.Mock).mockResolvedValue(
      mockUpdatedDetail
    );

    const { result } = renderHook(() => useUpdateOrderDetailProgress(orderId), {
      wrapper: createWrapper(),
    });

    result.current.mutate({
      orderDetailId: "detail-123",
      status: "build",
      completedQuantity: 5,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(ordersApi.updateOrderDetailProgress).toHaveBeenCalledWith(
      expect.objectContaining({
        orderDetailId: "detail-123",
        status: "build",
        completedQuantity: 5,
      }),
      expect.anything()
    );
    expect(result.current.data).toEqual(mockUpdatedDetail);
  });

  it("should update only status when completedQuantity is undefined", async () => {
    const mockUpdatedDetail = {
      id: "detail-123",
      status: "trim",
      completed_quantity: 3,
      quantity: 10,
      type: "mug-with-handle",
      description: "Test mug",
      order_id: orderId,
      size: "medium",
      created_at: "2025-01-01T00:00:00Z",
      status_changed_at: "2025-01-01T12:00:00Z",
    };

    (ordersApi.updateOrderDetailProgress as jest.Mock).mockResolvedValue(
      mockUpdatedDetail
    );

    const { result } = renderHook(() => useUpdateOrderDetailProgress(orderId), {
      wrapper: createWrapper(),
    });

    result.current.mutate({
      orderDetailId: "detail-123",
      status: "trim",
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(ordersApi.updateOrderDetailProgress).toHaveBeenCalledWith(
      expect.objectContaining({
        orderDetailId: "detail-123",
        status: "trim",
      }),
      expect.anything()
    );
  });

  it("should update only completed quantity when status is undefined", async () => {
    const mockUpdatedDetail = {
      id: "detail-123",
      status: "build",
      completed_quantity: 7,
      quantity: 10,
      type: "mug-with-handle",
      description: "Test mug",
      order_id: orderId,
      size: "medium",
      created_at: "2025-01-01T00:00:00Z",
      status_changed_at: "2025-01-01T12:00:00Z",
    };

    (ordersApi.updateOrderDetailProgress as jest.Mock).mockResolvedValue(
      mockUpdatedDetail
    );

    const { result } = renderHook(() => useUpdateOrderDetailProgress(orderId), {
      wrapper: createWrapper(),
    });

    result.current.mutate({
      orderDetailId: "detail-123",
      completedQuantity: 7,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(ordersApi.updateOrderDetailProgress).toHaveBeenCalledWith(
      expect.objectContaining({
        orderDetailId: "detail-123",
        completedQuantity: 7,
      }),
      expect.anything()
    );
  });

  it("should handle API errors", async () => {
    const mockError = new Error("Failed to update order detail");

    (ordersApi.updateOrderDetailProgress as jest.Mock).mockRejectedValue(
      mockError
    );

    const { result } = renderHook(() => useUpdateOrderDetailProgress(orderId), {
      wrapper: createWrapper(),
    });

    result.current.mutate({
      orderDetailId: "detail-123",
      status: "build",
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toEqual(mockError);
  });

  it("should invalidate order queries on success", async () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    const invalidateSpy = jest.spyOn(queryClient, "invalidateQueries");

    const mockUpdatedDetail = {
      id: "detail-123",
      status: "glaze",
      completed_quantity: 10,
      quantity: 10,
      type: "mug-with-handle",
      description: "Test mug",
      order_id: orderId,
      size: "medium",
      created_at: "2025-01-01T00:00:00Z",
      status_changed_at: "2025-01-01T12:00:00Z",
    };

    (ordersApi.updateOrderDetailProgress as jest.Mock).mockResolvedValue(
      mockUpdatedDetail
    );

    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useUpdateOrderDetailProgress(orderId), {
      wrapper,
    });

    result.current.mutate({
      orderDetailId: "detail-123",
      status: "glaze",
      completedQuantity: 10,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["order", orderId] });
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["orders"] });
  });

  it("should handle pending state correctly", async () => {
    let resolveMutation: any;
    (ordersApi.updateOrderDetailProgress as jest.Mock).mockImplementation(
      () => new Promise((resolve) => { resolveMutation = resolve; })
    );

    const { result } = renderHook(() => useUpdateOrderDetailProgress(orderId), {
      wrapper: createWrapper(),
    });

    expect(result.current.isPending).toBe(false);

    result.current.mutate({
      orderDetailId: "detail-123",
      status: "build",
    });

    await waitFor(() => expect(result.current.isPending).toBe(true));

    const mockData = {
      id: "detail-123",
      status: "build",
      completed_quantity: 5,
      quantity: 10,
      type: "mug-with-handle",
      description: "Test",
      order_id: orderId,
      size: null,
      created_at: "2025-01-01",
      status_changed_at: "2025-01-01",
    };
    resolveMutation(mockData);
  });

  it("should reset state after multiple mutations", async () => {
    const mockDetail1 = {
      id: "detail-123",
      status: "build",
      completed_quantity: 5,
      quantity: 10,
      type: "mug-with-handle",
      description: "Test mug",
      order_id: orderId,
      size: "medium",
      created_at: "2025-01-01T00:00:00Z",
      status_changed_at: "2025-01-01T12:00:00Z",
    };

    const mockDetail2 = {
      ...mockDetail1,
      status: "trim",
      completed_quantity: 8,
      status_changed_at: "2025-01-01T13:00:00Z",
    };

    (ordersApi.updateOrderDetailProgress as jest.Mock)
      .mockResolvedValueOnce(mockDetail1)
      .mockResolvedValueOnce(mockDetail2);

    const { result } = renderHook(() => useUpdateOrderDetailProgress(orderId), {
      wrapper: createWrapper(),
    });

    result.current.mutate({
      orderDetailId: "detail-123",
      status: "build",
      completedQuantity: 5,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockDetail1);

    result.current.reset();

    result.current.mutate({
      orderDetailId: "detail-123",
      status: "trim",
      completedQuantity: 8,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockDetail2);
  });

  it("should work with different order IDs", async () => {
    const orderId1 = "order-123";
    const orderId2 = "order-456";

    const mockDetail = {
      id: "detail-789",
      status: "build",
      completed_quantity: 5,
      quantity: 10,
      type: "mug-with-handle",
      description: "Test mug",
      order_id: orderId1,
      size: "medium",
      created_at: "2025-01-01T00:00:00Z",
      status_changed_at: "2025-01-01T12:00:00Z",
    };

    (ordersApi.updateOrderDetailProgress as jest.Mock).mockResolvedValue(
      mockDetail
    );

    const { result: result1 } = renderHook(
      () => useUpdateOrderDetailProgress(orderId1),
      { wrapper: createWrapper() }
    );

    const { result: result2 } = renderHook(
      () => useUpdateOrderDetailProgress(orderId2),
      { wrapper: createWrapper() }
    );

    result1.current.mutate({
      orderDetailId: "detail-789",
      status: "build",
    });

    await waitFor(() => expect(result1.current.isSuccess).toBe(true));

    expect(result1.current.isSuccess).toBe(true);
    expect(result2.current.isSuccess).toBe(false);
  });
});
