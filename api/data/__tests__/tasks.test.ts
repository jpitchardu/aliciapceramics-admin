import { regenerateSchedule } from "../tasks";

global.fetch = jest.fn();

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
