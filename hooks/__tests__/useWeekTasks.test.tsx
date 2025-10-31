import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useWeekTasks } from "../useWeekTasks";
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

describe("useWeekTasks", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should successfully fetch week tasks", async () => {
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

    (tasksApi.fetchWeekTasks as jest.Mock).mockResolvedValue(mockTasks);

    const { result } = renderHook(() => useWeekTasks(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(tasksApi.fetchWeekTasks).toHaveBeenCalled();
    expect(result.current.data).toEqual(mockTasks);
  });

  it("should handle empty task list", async () => {
    (tasksApi.fetchWeekTasks as jest.Mock).mockResolvedValue([]);

    const { result } = renderHook(() => useWeekTasks(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual([]);
  });

  it("should handle API errors", async () => {
    const mockError = new Error("Failed to fetch week tasks");

    (tasksApi.fetchWeekTasks as jest.Mock).mockRejectedValue(mockError);

    const { result } = renderHook(() => useWeekTasks(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toEqual(mockError);
  });

  it("should show loading state initially", () => {
    (tasksApi.fetchWeekTasks as jest.Mock).mockImplementation(
      () => new Promise(() => {})
    );

    const { result } = renderHook(() => useWeekTasks(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
  });

  it("should refetch on manual refetch call", async () => {
    const mockTasks1 = [
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
    ];

    const mockTasks2 = [
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

    (tasksApi.fetchWeekTasks as jest.Mock)
      .mockResolvedValueOnce(mockTasks1)
      .mockResolvedValueOnce(mockTasks2);

    const { result } = renderHook(() => useWeekTasks(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockTasks1);

    result.current.refetch();

    await waitFor(() => expect(result.current.data).toEqual(mockTasks2));

    expect(tasksApi.fetchWeekTasks).toHaveBeenCalledTimes(2);
  });
});
