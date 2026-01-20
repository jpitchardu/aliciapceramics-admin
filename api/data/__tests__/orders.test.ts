import { updateOrderDetailProgress, UpdateOrderDetailProgressParams } from "../orders";

global.fetch = jest.fn() as jest.Mock;

describe("updateOrderDetailProgress", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should update only status when status is provided", async () => {
    const mockResponse = {
      success: true,
      data: { id: "detail-123", status: "build" },
    };

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    const params: UpdateOrderDetailProgressParams = {
      orderDetailId: "detail-123",
      status: "build",
    };

    const result = await updateOrderDetailProgress(params);

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/updateOrderDetail"),
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderDetailId: "detail-123",
          status: "build",
          completedQuantity: undefined,
        }),
      })
    );
    expect(result).toEqual(mockResponse);
  });

  it("should update only completed quantity when completedQuantity is provided", async () => {
    const mockResponse = {
      success: true,
      data: { id: "detail-123", completed_quantity: 7 },
    };

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    const params: UpdateOrderDetailProgressParams = {
      orderDetailId: "detail-123",
      completedQuantity: 7,
    };

    const result = await updateOrderDetailProgress(params);

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/updateOrderDetail"),
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          orderDetailId: "detail-123",
          status: undefined,
          completedQuantity: 7,
        }),
      })
    );
    expect(result).toEqual(mockResponse);
  });

  it("should update both status and completed quantity when both are provided", async () => {
    const mockResponse = {
      success: true,
      data: { id: "detail-123", status: "trim", completed_quantity: 8 },
    };

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    const params: UpdateOrderDetailProgressParams = {
      orderDetailId: "detail-123",
      status: "trim",
      completedQuantity: 8,
    };

    const result = await updateOrderDetailProgress(params);

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/updateOrderDetail"),
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          orderDetailId: "detail-123",
          status: "trim",
          completedQuantity: 8,
        }),
      })
    );
    expect(result).toEqual(mockResponse);
  });

  it("should handle zero completed quantity", async () => {
    const mockResponse = {
      success: true,
      data: { id: "detail-123", completed_quantity: 0 },
    };

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    const params: UpdateOrderDetailProgressParams = {
      orderDetailId: "detail-123",
      completedQuantity: 0,
    };

    const result = await updateOrderDetailProgress(params);

    expect(result.data.completed_quantity).toBe(0);
  });

  it("should throw error when API returns non-ok response", async () => {
    const errorResponse = {
      message: "Database error",
    };

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: async () => errorResponse,
    });

    const params: UpdateOrderDetailProgressParams = {
      orderDetailId: "detail-123",
      status: "build",
    };

    await expect(updateOrderDetailProgress(params)).rejects.toThrow("Database error");
  });

  it("should throw error when success is false", async () => {
    const errorResponse = {
      success: false,
      message: "Update failed",
    };

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => errorResponse,
    });

    const params: UpdateOrderDetailProgressParams = {
      orderDetailId: "detail-123",
      status: "build",
    };

    await expect(updateOrderDetailProgress(params)).rejects.toThrow("Update failed");
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
      const mockResponse = {
        success: true,
        data: { id: "detail-123", status },
      };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const params: UpdateOrderDetailProgressParams = {
        orderDetailId: "detail-123",
        status,
      };

      const result = await updateOrderDetailProgress(params);

      expect(result.data.status).toBe(status);
    }
  });
});
