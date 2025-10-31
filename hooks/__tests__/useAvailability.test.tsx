import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAvailability, useUpdateAvailability } from "../useAvailability";
import * as availabilityApi from "@/api/data/availability";
import { ReactNode } from "react";

jest.mock("@/api/data/availability");

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

describe("useAvailability", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should successfully fetch availability data", async () => {
    const mockData = [
      { date: "2025-11-01", available_hours: 8, notes: "Extra hours" },
      { date: "2025-11-02", available_hours: 4, notes: null },
    ];

    (availabilityApi.fetchAvailability as jest.Mock).mockResolvedValue(mockData);

    const { result } = renderHook(
      () => useAvailability("2025-11-01", "2025-11-07"),
      {
        wrapper: createWrapper(),
      }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(availabilityApi.fetchAvailability).toHaveBeenCalledWith(
      "2025-11-01",
      "2025-11-07"
    );
    expect(result.current.data).toEqual(mockData);
  });

  it("should handle empty availability data", async () => {
    (availabilityApi.fetchAvailability as jest.Mock).mockResolvedValue([]);

    const { result } = renderHook(
      () => useAvailability("2025-11-01", "2025-11-07"),
      {
        wrapper: createWrapper(),
      }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual([]);
  });

  it("should handle API errors", async () => {
    const mockError = new Error("Failed to fetch availability");

    (availabilityApi.fetchAvailability as jest.Mock).mockRejectedValue(mockError);

    const { result } = renderHook(
      () => useAvailability("2025-11-01", "2025-11-07"),
      {
        wrapper: createWrapper(),
      }
    );

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toEqual(mockError);
  });

  it("should show loading state initially", () => {
    (availabilityApi.fetchAvailability as jest.Mock).mockImplementation(
      () => new Promise(() => {})
    );

    const { result } = renderHook(
      () => useAvailability("2025-11-01", "2025-11-07"),
      {
        wrapper: createWrapper(),
      }
    );

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
  });

  it("should refetch on manual refetch call", async () => {
    const mockData1 = [
      { date: "2025-11-01", available_hours: 8, notes: null },
    ];

    const mockData2 = [
      { date: "2025-11-01", available_hours: 6, notes: "Updated" },
    ];

    (availabilityApi.fetchAvailability as jest.Mock)
      .mockResolvedValueOnce(mockData1)
      .mockResolvedValueOnce(mockData2);

    const { result } = renderHook(
      () => useAvailability("2025-11-01", "2025-11-07"),
      {
        wrapper: createWrapper(),
      }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockData1);

    result.current.refetch();

    await waitFor(() => expect(result.current.data).toEqual(mockData2));

    expect(availabilityApi.fetchAvailability).toHaveBeenCalledTimes(2);
  });
});

describe("useUpdateAvailability", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should successfully update availability", async () => {
    const updates = [
      { date: "2025-11-01", available_hours: 8, notes: "Extra hours" },
      { date: "2025-11-02", available_hours: 4 },
    ];

    (availabilityApi.updateAvailability as jest.Mock).mockResolvedValue(undefined);

    const { result } = renderHook(() => useUpdateAvailability(), {
      wrapper: createWrapper(),
    });

    result.current.mutate(updates);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(availabilityApi.updateAvailability).toHaveBeenCalledWith(updates);
  });

  it("should handle API errors", async () => {
    const updates = [{ date: "2025-11-01", available_hours: 8 }];
    const mockError = new Error("Failed to update availability");

    (availabilityApi.updateAvailability as jest.Mock).mockRejectedValue(mockError);

    const { result } = renderHook(() => useUpdateAvailability(), {
      wrapper: createWrapper(),
    });

    result.current.mutate(updates);

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toEqual(mockError);
  });

  it("should invalidate availability queries on success", async () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    const invalidateSpy = jest.spyOn(queryClient, "invalidateQueries");

    const updates = [{ date: "2025-11-01", available_hours: 8 }];

    (availabilityApi.updateAvailability as jest.Mock).mockResolvedValue(undefined);

    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useUpdateAvailability(), {
      wrapper,
    });

    result.current.mutate(updates);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["availability"] });
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["weekTasks"] });
  });

  it("should handle pending state correctly", async () => {
    let resolveMutation: any;
    (availabilityApi.updateAvailability as jest.Mock).mockImplementation(
      () => new Promise((resolve) => { resolveMutation = resolve; })
    );

    const { result } = renderHook(() => useUpdateAvailability(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isPending).toBe(false);

    const updates = [{ date: "2025-11-01", available_hours: 8 }];
    result.current.mutate(updates);

    await waitFor(() => expect(result.current.isPending).toBe(true));

    resolveMutation();
  });

  it("should reset state after mutation", async () => {
    const updates = [{ date: "2025-11-01", available_hours: 8 }];

    (availabilityApi.updateAvailability as jest.Mock).mockResolvedValue(undefined);

    const { result } = renderHook(() => useUpdateAvailability(), {
      wrapper: createWrapper(),
    });

    result.current.mutate(updates);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    result.current.reset();

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(false);
      expect(result.current.isError).toBe(false);
    });
  });

  it("should allow multiple updates", async () => {
    const updates1 = [{ date: "2025-11-01", available_hours: 8 }];
    const updates2 = [{ date: "2025-11-02", available_hours: 6 }];

    (availabilityApi.updateAvailability as jest.Mock).mockResolvedValue(undefined);

    const { result } = renderHook(() => useUpdateAvailability(), {
      wrapper: createWrapper(),
    });

    result.current.mutate(updates1);
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    result.current.reset();

    result.current.mutate(updates2);
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(availabilityApi.updateAvailability).toHaveBeenCalledTimes(2);
    expect(availabilityApi.updateAvailability).toHaveBeenCalledWith(updates1);
    expect(availabilityApi.updateAvailability).toHaveBeenCalledWith(updates2);
  });
});
