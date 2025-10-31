export type AvailabilityUpdate = {
  date: string;
  available_hours: number;
  notes?: string;
};

export type AvailabilityRecord = {
  date: string;
  available_hours: number;
  notes: string | null;
};

export async function fetchAvailability(startDate: string, endDate: string): Promise<AvailabilityRecord[]> {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL || "https://aliciapceramics.com";

  const response = await fetch(
    `${apiUrl}/api/availability?start_date=${startDate}&end_date=${endDate}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to fetch availability");
  }

  const data = await response.json();
  return data.availability || [];
}

export async function updateAvailability(updates: AvailabilityUpdate[]): Promise<void> {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL || "https://aliciapceramics.com";

  const response = await fetch(`${apiUrl}/api/availability`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ updates }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to update availability");
  }
}
