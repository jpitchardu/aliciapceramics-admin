import { fetchAvailability, updateAvailability } from "../availability";

global.fetch = jest.fn();

describe("fetchAvailability", () => {
  const mockApiUrl = "https://aliciapceramics.com";

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.EXPO_PUBLIC_API_URL = mockApiUrl;
  });

  afterEach(() => {
    delete process.env.EXPO_PUBLIC_API_URL;
  });

  it("should fetch availability successfully", async () => {
    const mockData = {
      availability: [
        { date: "2025-11-01", available_hours: 8, notes: "Extra hours" },
        { date: "2025-11-02", available_hours: 4, notes: null },
      ],
    };

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockData,
    });

    const result = await fetchAvailability("2025-11-01", "2025-11-07");

    expect(global.fetch).toHaveBeenCalledWith(
      `${mockApiUrl}/api/availability?start_date=2025-11-01&end_date=2025-11-07`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    expect(result).toEqual(mockData.availability);
  });

  it("should return empty array when no availability data", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({}),
    });

    const result = await fetchAvailability("2025-11-01", "2025-11-07");

    expect(result).toEqual([]);
  });

  it("should use default API URL when env variable is not set", async () => {
    delete process.env.EXPO_PUBLIC_API_URL;

    const mockData = { availability: [] };

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockData,
    });

    await fetchAvailability("2025-11-01", "2025-11-07");

    expect(global.fetch).toHaveBeenCalledWith(
      "https://aliciapceramics.com/api/availability?start_date=2025-11-01&end_date=2025-11-07",
      expect.objectContaining({
        method: "GET",
      })
    );
  });

  it("should throw error when response is not ok", async () => {
    const mockError = {
      message: "Failed to fetch availability",
    };

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: async () => mockError,
    });

    await expect(
      fetchAvailability("2025-11-01", "2025-11-07")
    ).rejects.toThrow("Failed to fetch availability");
  });

  it("should handle error response without json body", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: async () => {
        throw new Error("Invalid JSON");
      },
    });

    await expect(
      fetchAvailability("2025-11-01", "2025-11-07")
    ).rejects.toThrow("Failed to fetch availability");
  });

  it("should handle network errors", async () => {
    (global.fetch as jest.Mock).mockRejectedValue(
      new Error("Network error")
    );

    await expect(
      fetchAvailability("2025-11-01", "2025-11-07")
    ).rejects.toThrow("Network error");
  });
});

describe("updateAvailability", () => {
  const mockApiUrl = "https://aliciapceramics.com";

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.EXPO_PUBLIC_API_URL = mockApiUrl;
  });

  afterEach(() => {
    delete process.env.EXPO_PUBLIC_API_URL;
  });

  it("should update availability successfully", async () => {
    const updates = [
      { date: "2025-11-01", available_hours: 8, notes: "Extra hours" },
      { date: "2025-11-02", available_hours: 4 },
    ];

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    });

    await updateAvailability(updates);

    expect(global.fetch).toHaveBeenCalledWith(
      `${mockApiUrl}/api/availability`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ updates }),
      }
    );
  });

  it("should use default API URL when env variable is not set", async () => {
    delete process.env.EXPO_PUBLIC_API_URL;

    const updates = [{ date: "2025-11-01", available_hours: 8 }];

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    });

    await updateAvailability(updates);

    expect(global.fetch).toHaveBeenCalledWith(
      "https://aliciapceramics.com/api/availability",
      expect.objectContaining({
        method: "PATCH",
      })
    );
  });

  it("should throw error when response is not ok", async () => {
    const updates = [{ date: "2025-11-01", available_hours: 8 }];
    const mockError = {
      message: "Failed to update availability",
    };

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: async () => mockError,
    });

    await expect(updateAvailability(updates)).rejects.toThrow(
      "Failed to update availability"
    );
  });

  it("should handle error response without json body", async () => {
    const updates = [{ date: "2025-11-01", available_hours: 8 }];

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: async () => {
        throw new Error("Invalid JSON");
      },
    });

    await expect(updateAvailability(updates)).rejects.toThrow(
      "Failed to update availability"
    );
  });

  it("should handle network errors", async () => {
    const updates = [{ date: "2025-11-01", available_hours: 8 }];

    (global.fetch as jest.Mock).mockRejectedValue(
      new Error("Network error")
    );

    await expect(updateAvailability(updates)).rejects.toThrow("Network error");
  });

  it("should handle empty updates array", async () => {
    const updates: any[] = [];

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    });

    await updateAvailability(updates);

    expect(global.fetch).toHaveBeenCalledWith(
      `${mockApiUrl}/api/availability`,
      expect.objectContaining({
        body: JSON.stringify({ updates: [] }),
      })
    );
  });
});
