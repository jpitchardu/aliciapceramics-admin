import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRegenerateSchedule } from "../useRegenerateSchedule";
import * as tasksApi from "@/api/data/tasks";
import { ReactNode } from "react";

jest.mock("@/api/data/tasks");

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

describe("useRegenerateSchedule", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should successfully regenerate schedule", async () => {
    const mockResponse = {
      success: true,
      message: "Schedule regenerated successfully",
    };

    (tasksApi.regenerateSchedule as jest.Mock).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useRegenerateSchedule(), {
      wrapper: createWrapper(),
    });

    result.current.mutate();

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(tasksApi.regenerateSchedule).toHaveBeenCalled();
    expect(result.current.data).toEqual(mockResponse);
  });

  it("should handle API errors", async () => {
    const mockError = new Error("Failed to regenerate schedule");

    (tasksApi.regenerateSchedule as jest.Mock).mockRejectedValue(mockError);

    const { result } = renderHook(() => useRegenerateSchedule(), {
      wrapper: createWrapper(),
    });

    result.current.mutate();

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toEqual(mockError);
  });

  it("should invalidate todaysTasks query on success", async () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    const invalidateSpy = jest.spyOn(queryClient, "invalidateQueries");

    const mockResponse = {
      success: true,
      message: "Schedule regenerated successfully",
    };

    (tasksApi.regenerateSchedule as jest.Mock).mockResolvedValue(mockResponse);

    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useRegenerateSchedule(), {
      wrapper,
    });

    result.current.mutate();

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["todaysTasks"] });
  });

  it("should handle pending state correctly", async () => {
    let resolveMutation: any;
    (tasksApi.regenerateSchedule as jest.Mock).mockImplementation(
      () => new Promise((resolve) => { resolveMutation = resolve; })
    );

    const { result } = renderHook(() => useRegenerateSchedule(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isPending).toBe(false);

    result.current.mutate();

    await waitFor(() => expect(result.current.isPending).toBe(true));

    const mockData = {
      success: true,
      message: "Schedule regenerated successfully",
    };
    resolveMutation(mockData);
  });

  it("should reset state after mutation", async () => {
    const mockResponse = {
      success: true,
      message: "Schedule regenerated successfully",
    };

    (tasksApi.regenerateSchedule as jest.Mock).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useRegenerateSchedule(), {
      wrapper: createWrapper(),
    });

    result.current.mutate();

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockResponse);

    result.current.reset();

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(false);
      expect(result.current.isError).toBe(false);
      expect(result.current.data).toBeUndefined();
    });
  });

  it("should allow multiple regenerations", async () => {
    const mockResponse1 = {
      success: true,
      message: "First regeneration",
    };

    const mockResponse2 = {
      success: true,
      message: "Second regeneration",
    };

    (tasksApi.regenerateSchedule as jest.Mock)
      .mockResolvedValueOnce(mockResponse1)
      .mockResolvedValueOnce(mockResponse2);

    const { result } = renderHook(() => useRegenerateSchedule(), {
      wrapper: createWrapper(),
    });

    result.current.mutate();
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockResponse1);

    result.current.reset();

    result.current.mutate();
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockResponse2);

    expect(tasksApi.regenerateSchedule).toHaveBeenCalledTimes(2);
  });

  it("should handle errors from server", async () => {
    const mockError = new Error("Server error");

    (tasksApi.regenerateSchedule as jest.Mock).mockRejectedValue(mockError);

    const { result } = renderHook(() => useRegenerateSchedule(), {
      wrapper: createWrapper(),
    });

    result.current.mutate();

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toEqual(mockError);
    expect(result.current.isSuccess).toBe(false);
  });
});
