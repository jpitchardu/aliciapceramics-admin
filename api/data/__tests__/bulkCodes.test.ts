import { createBulkCommissionCode, fetchBulkCommissionCodes, fetchOrdersByBulkCode } from "../bulkCodes";
import { getAliciapCeramicsSubaseClient } from "../../aliciapCeramicsClient";

jest.mock("../../aliciapCeramicsClient");

const mockSupabaseClient = {
  from: jest.fn(),
};

describe("bulkCodes data layer", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getAliciapCeramicsSubaseClient as jest.Mock).mockReturnValue(mockSupabaseClient);
  });

  describe("fetchBulkCommissionCodes", () => {
    it("should fetch all bulk codes ordered by created_at desc", async () => {
      const mockCodes = [
        {
          id: "code-1",
          code: "ABC12345",
          name: "Spring Sale 2026",
          earliest_completion_date: "2026-03-01",
          redeemed_at: null,
          created_at: "2026-01-19T00:00:00Z",
        },
        {
          id: "code-2",
          code: "XYZ98765",
          name: "Wedding Order",
          earliest_completion_date: "2026-06-15",
          redeemed_at: "2026-01-20T10:30:00Z",
          created_at: "2026-01-18T00:00:00Z",
        },
      ];

      const mockSelect = jest.fn().mockReturnThis();
      const mockOrder = jest.fn().mockResolvedValue({
        data: mockCodes,
        error: null,
      });

      mockSupabaseClient.from.mockReturnValue({
        select: mockSelect,
        order: mockOrder,
      });

      const result = await fetchBulkCommissionCodes();

      expect(mockSupabaseClient.from).toHaveBeenCalledWith("bulk_commission_codes");
      expect(mockSelect).toHaveBeenCalledWith("*");
      expect(mockOrder).toHaveBeenCalledWith("created_at", { ascending: false });
      expect(result).toEqual(mockCodes);
    });

    it("should throw error if fetch fails", async () => {
      const mockError = new Error("Database error");

      mockSupabaseClient.from.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({
          data: null,
          error: mockError,
        }),
      });

      await expect(fetchBulkCommissionCodes()).rejects.toThrow(mockError);
    });
  });

  describe("createBulkCommissionCode", () => {
    it("should create a new bulk code with auto-generated code", async () => {
      const params = {
        name: "Test Bulk Order",
        earliestCompletionDate: new Date("2026-04-01"),
      };

      const mockCreatedCode = {
        id: "new-code-id",
        code: expect.any(String),
        name: params.name,
        earliest_completion_date: "2026-04-01",
        redeemed_at: null,
        created_at: "2026-01-19T00:00:00Z",
      };

      const mockInsert = jest.fn().mockReturnThis();
      const mockSelect = jest.fn().mockReturnThis();
      const mockSingle = jest.fn().mockResolvedValue({
        data: mockCreatedCode,
        error: null,
      });

      mockSupabaseClient.from.mockReturnValue({
        insert: mockInsert,
        select: mockSelect,
        single: mockSingle,
      });

      const result = await createBulkCommissionCode(params);

      expect(mockSupabaseClient.from).toHaveBeenCalledWith("bulk_commission_codes");
      expect(mockInsert).toHaveBeenCalledWith({
        code: expect.any(String),
        name: params.name,
        earliest_completion_date: "2026-04-01",
      });
      expect(mockSelect).toHaveBeenCalled();
      expect(mockSingle).toHaveBeenCalled();
      expect(result).toHaveProperty("code");
      expect(result).toHaveProperty("name", params.name);
    });

    it("should throw error if creation fails", async () => {
      const params = {
        name: "Test Order",
        earliestCompletionDate: new Date("2026-04-01"),
      };

      const mockError = new Error("Unique constraint violation");

      mockSupabaseClient.from.mockReturnValue({
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: null,
          error: mockError,
        }),
      });

      await expect(createBulkCommissionCode(params)).rejects.toThrow(mockError);
    });
  });

  describe("fetchOrdersByBulkCode", () => {
    it("should fetch orders for a specific bulk code", async () => {
      const bulkCodeId = "code-123";
      const mockOrders = [
        {
          id: "order-1",
          status: "pending",
          name: null,
          type: null,
          due_date: null,
          timeline: "2026-04-01",
          created_at: "2026-01-20T00:00:00Z",
          customers: { name: "John Doe", email: "john@example.com", phone: "+15551234567" },
          order_details: [
            { id: "detail-1", quantity: 12, type: "mug-with-handle" },
          ],
        },
      ];

      const mockSelect = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockReturnThis();
      const mockOrder = jest.fn().mockResolvedValue({
        data: mockOrders,
        error: null,
      });

      mockSupabaseClient.from.mockReturnValue({
        select: mockSelect,
        eq: mockEq,
        order: mockOrder,
      });

      const result = await fetchOrdersByBulkCode(bulkCodeId);

      expect(mockSupabaseClient.from).toHaveBeenCalledWith("orders");
      expect(mockEq).toHaveBeenCalledWith("bulk_commission_code_id", bulkCodeId);
      expect(mockOrder).toHaveBeenCalledWith("created_at", { ascending: false });
      expect(result).toEqual(mockOrders);
    });

    it("should throw error if fetch fails", async () => {
      const mockError = new Error("Database error");

      mockSupabaseClient.from.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({
          data: null,
          error: mockError,
        }),
      });

      await expect(fetchOrdersByBulkCode("code-123")).rejects.toThrow(mockError);
    });
  });
});
