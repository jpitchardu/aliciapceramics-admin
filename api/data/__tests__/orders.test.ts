import { updateOrderDetailProgress, UpdateOrderDetailProgressParams } from "../orders";
import { getAliciapCeramicsSubaseClient } from "../../aliciapCeramicsClient";

jest.mock("../../aliciapCeramicsClient");

const mockClient = {
  from: jest.fn(),
};

const mockUpdate = jest.fn();
const mockEq = jest.fn();
const mockSelect = jest.fn();
const mockSingle = jest.fn();

describe("updateOrderDetailProgress", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (getAliciapCeramicsSubaseClient as jest.Mock).mockReturnValue(mockClient);

    mockClient.from.mockReturnValue({
      update: mockUpdate,
    });

    mockUpdate.mockReturnValue({
      eq: mockEq,
    });

    mockEq.mockReturnValue({
      select: mockSelect,
    });

    mockSelect.mockReturnValue({
      single: mockSingle,
    });
  });

  it("should update only status when status is provided", async () => {
    const mockOrderDetail = {
      id: "detail-123",
      status: "build",
      completed_quantity: 5,
      quantity: 10,
      type: "mug-with-handle",
      description: "Test mug",
      order_id: "order-123",
      size: "medium",
      created_at: "2025-01-01T00:00:00Z",
      status_changed_at: expect.any(String),
    };

    mockSingle.mockResolvedValue({
      data: mockOrderDetail,
      error: null,
    });

    const params: UpdateOrderDetailProgressParams = {
      orderDetailId: "detail-123",
      status: "build",
    };

    const result = await updateOrderDetailProgress(params);

    expect(mockClient.from).toHaveBeenCalledWith("order_details");
    expect(mockUpdate).toHaveBeenCalledWith({
      status: "build",
      status_changed_at: expect.any(String),
    });
    expect(mockEq).toHaveBeenCalledWith("id", "detail-123");
    expect(result).toEqual(mockOrderDetail);
  });

  it("should update only completed quantity when completedQuantity is provided", async () => {
    const mockOrderDetail = {
      id: "detail-123",
      status: "build",
      completed_quantity: 7,
      quantity: 10,
      type: "mug-with-handle",
      description: "Test mug",
      order_id: "order-123",
      size: "medium",
      created_at: "2025-01-01T00:00:00Z",
      status_changed_at: "2025-01-01T00:00:00Z",
    };

    mockSingle.mockResolvedValue({
      data: mockOrderDetail,
      error: null,
    });

    const params: UpdateOrderDetailProgressParams = {
      orderDetailId: "detail-123",
      completedQuantity: 7,
    };

    const result = await updateOrderDetailProgress(params);

    expect(mockUpdate).toHaveBeenCalledWith({
      completed_quantity: 7,
    });
    expect(mockEq).toHaveBeenCalledWith("id", "detail-123");
    expect(result).toEqual(mockOrderDetail);
  });

  it("should update both status and completed quantity when both are provided", async () => {
    const mockOrderDetail = {
      id: "detail-123",
      status: "trim",
      completed_quantity: 8,
      quantity: 10,
      type: "mug-with-handle",
      description: "Test mug",
      order_id: "order-123",
      size: "medium",
      created_at: "2025-01-01T00:00:00Z",
      status_changed_at: expect.any(String),
    };

    mockSingle.mockResolvedValue({
      data: mockOrderDetail,
      error: null,
    });

    const params: UpdateOrderDetailProgressParams = {
      orderDetailId: "detail-123",
      status: "trim",
      completedQuantity: 8,
    };

    const result = await updateOrderDetailProgress(params);

    expect(mockUpdate).toHaveBeenCalledWith({
      status: "trim",
      completed_quantity: 8,
      status_changed_at: expect.any(String),
    });
    expect(mockEq).toHaveBeenCalledWith("id", "detail-123");
    expect(result).toEqual(mockOrderDetail);
  });

  it("should set status_changed_at timestamp when status changes", async () => {
    const beforeTime = new Date().toISOString();

    const mockOrderDetail = {
      id: "detail-123",
      status: "glaze",
      completed_quantity: 10,
      quantity: 10,
      type: "mug-with-handle",
      description: "Test mug",
      order_id: "order-123",
      size: "medium",
      created_at: "2025-01-01T00:00:00Z",
      status_changed_at: beforeTime,
    };

    mockSingle.mockResolvedValue({
      data: mockOrderDetail,
      error: null,
    });

    const params: UpdateOrderDetailProgressParams = {
      orderDetailId: "detail-123",
      status: "glaze",
    };

    await updateOrderDetailProgress(params);

    const updateCall = mockUpdate.mock.calls[0][0];
    expect(updateCall).toHaveProperty("status_changed_at");
    expect(typeof updateCall.status_changed_at).toBe("string");

    const timestamp = new Date(updateCall.status_changed_at);
    expect(timestamp.getTime()).toBeGreaterThanOrEqual(new Date(beforeTime).getTime());
  });

  it("should not set status_changed_at when only completed quantity changes", async () => {
    const mockOrderDetail = {
      id: "detail-123",
      status: "build",
      completed_quantity: 5,
      quantity: 10,
      type: "mug-with-handle",
      description: "Test mug",
      order_id: "order-123",
      size: "medium",
      created_at: "2025-01-01T00:00:00Z",
      status_changed_at: "2025-01-01T00:00:00Z",
    };

    mockSingle.mockResolvedValue({
      data: mockOrderDetail,
      error: null,
    });

    const params: UpdateOrderDetailProgressParams = {
      orderDetailId: "detail-123",
      completedQuantity: 5,
    };

    await updateOrderDetailProgress(params);

    const updateCall = mockUpdate.mock.calls[0][0];
    expect(updateCall).not.toHaveProperty("status_changed_at");
    expect(updateCall).toEqual({
      completed_quantity: 5,
    });
  });

  it("should handle zero completed quantity", async () => {
    const mockOrderDetail = {
      id: "detail-123",
      status: "pending",
      completed_quantity: 0,
      quantity: 10,
      type: "mug-with-handle",
      description: "Test mug",
      order_id: "order-123",
      size: "medium",
      created_at: "2025-01-01T00:00:00Z",
      status_changed_at: "2025-01-01T00:00:00Z",
    };

    mockSingle.mockResolvedValue({
      data: mockOrderDetail,
      error: null,
    });

    const params: UpdateOrderDetailProgressParams = {
      orderDetailId: "detail-123",
      completedQuantity: 0,
    };

    const result = await updateOrderDetailProgress(params);

    expect(mockUpdate).toHaveBeenCalledWith({
      completed_quantity: 0,
    });
    expect(result.completed_quantity).toBe(0);
  });

  it("should throw error when Supabase returns error", async () => {
    const mockError = { message: "Database error", code: "DB_ERROR" };

    mockSingle.mockResolvedValue({
      data: null,
      error: mockError,
    });

    const params: UpdateOrderDetailProgressParams = {
      orderDetailId: "detail-123",
      status: "build",
    };

    await expect(updateOrderDetailProgress(params)).rejects.toEqual(mockError);
  });

  it("should handle updating to completed status", async () => {
    const mockOrderDetail = {
      id: "detail-123",
      status: "completed",
      completed_quantity: 10,
      quantity: 10,
      type: "mug-with-handle",
      description: "Test mug",
      order_id: "order-123",
      size: "medium",
      created_at: "2025-01-01T00:00:00Z",
      status_changed_at: expect.any(String),
    };

    mockSingle.mockResolvedValue({
      data: mockOrderDetail,
      error: null,
    });

    const params: UpdateOrderDetailProgressParams = {
      orderDetailId: "detail-123",
      status: "completed",
      completedQuantity: 10,
    };

    const result = await updateOrderDetailProgress(params);

    expect(result.status).toBe("completed");
    expect(result.completed_quantity).toBe(10);
  });

  it("should handle all valid status values", async () => {
    const validStatuses = [
      "pending",
      "build",
      "trim",
      "attach",
      "trim_final",
      "bisque",
      "glaze",
      "fire",
      "completed",
    ];

    for (const status of validStatuses) {
      const mockOrderDetail = {
        id: "detail-123",
        status,
        completed_quantity: 5,
        quantity: 10,
        type: "mug-with-handle",
        description: "Test mug",
        order_id: "order-123",
        size: "medium",
        created_at: "2025-01-01T00:00:00Z",
        status_changed_at: expect.any(String),
      };

      mockSingle.mockResolvedValue({
        data: mockOrderDetail,
        error: null,
      });

      const params: UpdateOrderDetailProgressParams = {
        orderDetailId: "detail-123",
        status,
      };

      const result = await updateOrderDetailProgress(params);

      expect(result.status).toBe(status);
    }
  });
});
