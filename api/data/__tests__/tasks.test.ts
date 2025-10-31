import { regenerateSchedule, fetchWeekTasks } from "../tasks";
import { getAliciapCeramicsSubaseClient } from "../../aliciapCeramicsClient";

global.fetch = jest.fn();

jest.mock("../../aliciapCeramicsClient", () => ({
  getAliciapCeramicsSubaseClient: jest.fn(),
}));

describe("regenerateSchedule", () => {
  const mockApiUrl = "https://aliciapceramics.com";

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.EXPO_PUBLIC_API_URL = mockApiUrl;
  });

  afterEach(() => {
    delete process.env.EXPO_PUBLIC_API_URL;
  });

  it("should successfully regenerate schedule", async () => {
    const mockResponse = {
      success: true,
      message: "Schedule regenerated successfully",
    };

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await regenerateSchedule();

    expect(global.fetch).toHaveBeenCalledWith(
      `${mockApiUrl}/api/scheduleTasks`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    expect(result).toEqual(mockResponse);
  });

  it("should use default API URL when env variable is not set", async () => {
    delete process.env.EXPO_PUBLIC_API_URL;

    const mockResponse = {
      success: true,
      message: "Schedule regenerated successfully",
    };

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    await regenerateSchedule();

    expect(global.fetch).toHaveBeenCalledWith(
      "https://aliciapceramics.com/api/scheduleTasks",
      expect.objectContaining({
        method: "POST",
      })
    );
  });

  it("should throw error when response is not ok", async () => {
    const mockError = {
      message: "Failed to regenerate schedule",
    };

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: async () => mockError,
    });

    await expect(regenerateSchedule()).rejects.toThrow(
      "Failed to regenerate schedule"
    );
  });

  it("should handle error response without json body", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: async () => {
        throw new Error("Invalid JSON");
      },
    });

    await expect(regenerateSchedule()).rejects.toThrow(
      "Failed to regenerate schedule"
    );
  });

  it("should throw error with custom message from server", async () => {
    const mockError = {
      message: "Database connection failed",
    };

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: async () => mockError,
    });

    await expect(regenerateSchedule()).rejects.toThrow(
      "Database connection failed"
    );
  });

  it("should handle network errors", async () => {
    (global.fetch as jest.Mock).mockRejectedValue(
      new Error("Network error")
    );

    await expect(regenerateSchedule()).rejects.toThrow("Network error");
  });
});

describe("fetchWeekTasks", () => {
  let mockClient: any;

  beforeEach(() => {
    jest.clearAllMocks();

    mockClient = {
      from: jest.fn(),
      select: jest.fn(),
      gte: jest.fn(),
      lte: jest.fn(),
      eq: jest.fn(),
      order: jest.fn(),
    };

    mockClient.from.mockImplementation(() => mockClient);
    mockClient.select.mockImplementation(() => mockClient);
    mockClient.gte.mockImplementation(() => mockClient);
    mockClient.lte.mockImplementation(() => mockClient);
    mockClient.eq.mockImplementation(() => mockClient);
    mockClient.order.mockImplementation(() => mockClient);

    (getAliciapCeramicsSubaseClient as jest.Mock).mockReturnValue(mockClient);
  });

  it("should fetch week tasks successfully", async () => {
    const mockTasks = [
      {
        id: "task-1",
        date: "2025-10-27",
        estimated_hours: 3,
        status: "pending",
        order_details: {
          type: "mug",
          quantity: 2,
          completed_quantity: 0,
          description: "Custom mugs",
          order_id: "order-1",
          status: "build",
        },
      },
      {
        id: "task-2",
        date: "2025-10-28",
        estimated_hours: 5,
        status: "pending",
        order_details: {
          type: "bowl",
          quantity: 1,
          completed_quantity: 0,
          description: "Large bowl",
          order_id: "order-2",
          status: "build",
        },
      },
    ];

    mockClient.order
      .mockImplementationOnce(() => mockClient)
      .mockImplementationOnce(() => mockClient)
      .mockResolvedValueOnce({
        data: mockTasks,
        error: null,
      });

    const result = await fetchWeekTasks();

    expect(getAliciapCeramicsSubaseClient).toHaveBeenCalled();
    expect(mockClient.from).toHaveBeenCalledWith("tasks");
    expect(mockClient.select).toHaveBeenCalledWith(expect.stringContaining("order_details"));
    expect(mockClient.eq).toHaveBeenCalledWith("status", "pending");
    expect(result).toEqual(mockTasks);
  });

  it("should return empty array when no tasks found", async () => {
    mockClient.order
      .mockImplementationOnce(() => mockClient)
      .mockImplementationOnce(() => mockClient)
      .mockResolvedValueOnce({
        data: [],
        error: null,
      });

    const result = await fetchWeekTasks();

    expect(result).toEqual([]);
  });

  it("should return empty array when data is null", async () => {
    mockClient.order
      .mockImplementationOnce(() => mockClient)
      .mockImplementationOnce(() => mockClient)
      .mockResolvedValueOnce({
        data: null,
        error: null,
      });

    const result = await fetchWeekTasks();

    expect(result).toEqual([]);
  });

  it("should throw error when query fails", async () => {
    const mockError = {
      message: "Database error",
      code: "500",
    };

    mockClient.order
      .mockImplementationOnce(() => mockClient)
      .mockImplementationOnce(() => mockClient)
      .mockResolvedValueOnce({
        data: null,
        error: mockError,
      });

    await expect(fetchWeekTasks()).rejects.toEqual(mockError);
  });

  it("should query for current week date range", async () => {
    mockClient.order
      .mockImplementationOnce(() => mockClient)
      .mockImplementationOnce(() => mockClient)
      .mockResolvedValueOnce({
        data: [],
        error: null,
      });

    await fetchWeekTasks();

    const gteCall = mockClient.gte.mock.calls[0];
    const lteCall = mockClient.lte.mock.calls[0];

    expect(gteCall[0]).toBe("date");
    expect(lteCall[0]).toBe("date");

    expect(gteCall[1]).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(lteCall[1]).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("should order tasks by date, is_late, and estimated_hours", async () => {
    mockClient.order
      .mockImplementationOnce(() => mockClient)
      .mockImplementationOnce(() => mockClient)
      .mockResolvedValueOnce({
        data: [],
        error: null,
      });

    await fetchWeekTasks();

    expect(mockClient.order).toHaveBeenCalledWith("date", { ascending: true });
    expect(mockClient.order).toHaveBeenCalledWith("is_late", { ascending: false });
    expect(mockClient.order).toHaveBeenCalledWith("estimated_hours", { ascending: false });
  });
});
