import { Box, Text } from "@/components";
import { useAvailability, useUpdateAvailability } from "@/hooks/useAvailability";
import { useState, useMemo } from "react";
import {
  ScrollView,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { AvailabilityUpdate } from "@/api/data/availability";

const DEFAULT_WEEKLY_SCHEDULE: Record<number, number> = {
  0: 0,
  1: 6,
  2: 6,
  3: 6,
  4: 6,
  5: 4,
  6: 0,
};

type DayData = {
  date: string;
  dateObj: Date;
  dayName: string;
  dayOfWeek: number;
  defaultHours: number;
  customHours: number | null;
  notes: string;
  isCustom: boolean;
};

export default function AvailabilityScreen() {
  const today = new Date();
  const startDate = today.toISOString().split("T")[0];

  const endDate = new Date(today);
  endDate.setDate(today.getDate() + 13);
  const endDateStr = endDate.toISOString().split("T")[0];

  const { data: availabilityData, isLoading, isError, error } = useAvailability(
    startDate,
    endDateStr
  );
  const updateMutation = useUpdateAvailability();

  const [editedDays, setEditedDays] = useState<
    Record<string, { hours: string; notes: string }>
  >({});

  const daysData = useMemo(() => {
    const days: DayData[] = [];
    const availabilityMap = new Map(
      availabilityData?.map((a) => [a.date, a]) || []
    );

    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dateStr = date.toISOString().split("T")[0];
      const dayOfWeek = date.getDay();
      const defaultHours = DEFAULT_WEEKLY_SCHEDULE[dayOfWeek];

      const customRecord = availabilityMap.get(dateStr);
      const isCustom = !!customRecord;
      const customHours = customRecord?.available_hours ?? null;
      const notes = customRecord?.notes || "";

      days.push({
        date: dateStr,
        dateObj: date,
        dayName: date.toLocaleDateString("en-US", { weekday: "long" }),
        dayOfWeek,
        defaultHours,
        customHours,
        notes,
        isCustom,
      });
    }

    return days;
  }, [availabilityData, today]);

  const hasChanges = Object.keys(editedDays).length > 0;

  const handleHoursChange = (date: string, value: string) => {
    setEditedDays((prev) => ({
      ...prev,
      [date]: {
        hours: value,
        notes: prev[date]?.notes || daysData.find((d) => d.date === date)?.notes || "",
      },
    }));
  };

  const handleNotesChange = (date: string, value: string) => {
    const day = daysData.find((d) => d.date === date);
    const currentHours = editedDays[date]?.hours ||
      (day?.customHours !== null ? day?.customHours.toString() ?? "" : "");

    setEditedDays((prev) => ({
      ...prev,
      [date]: {
        hours: currentHours,
        notes: value,
      },
    }));
  };

  const handleSave = async () => {
    const updates: AvailabilityUpdate[] = Object.entries(editedDays).map(
      ([date, data]) => {
        const hours = parseFloat(data.hours);
        if (isNaN(hours) || hours < 0) {
          throw new Error(`Invalid hours for ${date}`);
        }

        return {
          date,
          available_hours: hours,
          notes: data.notes || undefined,
        };
      }
    );

    try {
      await updateMutation.mutateAsync(updates);
      setEditedDays({});
      Alert.alert("Success", "Availability updated successfully");
    } catch (err) {
      Alert.alert("Error", err instanceof Error ? err.message : "Failed to update availability");
    }
  };

  const handleReset = () => {
    setEditedDays({});
  };

  if (isError) {
    return (
      <Box
        flex={1}
        backgroundColor="primary50"
        justifyContent="center"
        alignItems="center"
        padding="l"
      >
        <Text variant="heading" color="alert600" textAlign="center">
          Error Loading Availability
        </Text>
        <Text variant="body" color="neutral600" marginTop="s" textAlign="center">
          {error instanceof Error ? error.message : "Unknown error"}
        </Text>
      </Box>
    );
  }

  if (isLoading) {
    return (
      <Box
        flex={1}
        backgroundColor="primary50"
        justifyContent="center"
        alignItems="center"
      >
        <ActivityIndicator size="large" color="#3d1900" />
        <Text variant="body" marginTop="m">
          Loading availability...
        </Text>
      </Box>
    );
  }

  return (
    <Box flex={1} backgroundColor="primary50">
      <ScrollView style={{ flex: 1 }}>
        <Box padding="m">
          <Text variant="heading" marginBottom="m">
            Set Your Availability
          </Text>
          <Text variant="body" color="neutral600" marginBottom="l">
            Customize your working hours for the next 2 weeks. Leave blank to use default
            schedule.
          </Text>

          <Box gap="s">
            {daysData.map((day) => {
              const edited = editedDays[day.date];
              const displayHours = edited
                ? edited.hours
                : day.customHours !== null
                ? day.customHours.toString()
                : "";
              const displayNotes = edited
                ? edited.notes
                : day.notes;

              const effectiveHours = edited
                ? parseFloat(edited.hours) || day.defaultHours
                : day.customHours !== null
                ? day.customHours
                : day.defaultHours;

              return (
                <Box
                  key={day.date}
                  backgroundColor="neutral50"
                  padding="m"
                  borderRadius="m"
                  borderWidth={1}
                  borderColor={edited ? "primary900" : "neutral200"}
                >
                  <Box
                    flexDirection="row"
                    justifyContent="space-between"
                    alignItems="center"
                    marginBottom="s"
                  >
                    <Box>
                      <Text variant="heading" fontSize={16}>
                        {day.dayName}
                      </Text>
                      <Text variant="body" color="neutral600" fontSize={12}>
                        {day.dateObj.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </Text>
                    </Box>

                    {!day.isCustom && !edited && (
                      <Box
                        paddingHorizontal="s"
                        paddingVertical="xs"
                        borderRadius="s"
                        backgroundColor="neutral200"
                      >
                        <Text variant="label" fontSize={10} color="neutral600">
                          DEFAULT
                        </Text>
                      </Box>
                    )}

                    {(day.isCustom || edited) && (
                      <Box
                        paddingHorizontal="s"
                        paddingVertical="xs"
                        borderRadius="s"
                        backgroundColor="interactive400"
                      >
                        <Text variant="label" fontSize={10} color="neutral50">
                          CUSTOM
                        </Text>
                      </Box>
                    )}
                  </Box>

                  <Box flexDirection="row" alignItems="center" marginBottom="s">
                    <Text variant="label" fontSize={14} marginRight="s">
                      Hours:
                    </Text>
                    <TextInput
                      style={styles.hoursInput}
                      value={displayHours}
                      onChangeText={(value) => handleHoursChange(day.date, value)}
                      keyboardType="decimal-pad"
                      placeholder={day.defaultHours.toString()}
                      placeholderTextColor="#999"
                    />
                    <Text variant="body" color="neutral600" fontSize={12} marginLeft="s">
                      (Default: {day.defaultHours}h)
                    </Text>
                  </Box>

                  <Text variant="body" color="primary900" fontSize={14} marginBottom="xs">
                    Effective: {effectiveHours}h
                  </Text>

                  <Text variant="label" fontSize={12} marginBottom="xs">
                    Notes (optional):
                  </Text>
                  <TextInput
                    style={styles.notesInput}
                    value={displayNotes}
                    onChangeText={(value) => handleNotesChange(day.date, value)}
                    placeholder="e.g., Doctor appointment, Day off"
                    placeholderTextColor="#999"
                    multiline
                  />
                </Box>
              );
            })}
          </Box>

          <Box height={100} />
        </Box>
      </ScrollView>

      {hasChanges && (
        <Box
          position="absolute"
          bottom={0}
          left={0}
          right={0}
          backgroundColor="neutral50"
          padding="m"
          borderTopWidth={1}
          borderTopColor="neutral200"
          flexDirection="row"
          gap="s"
        >
          <TouchableOpacity
            style={[styles.button, styles.resetButton]}
            onPress={handleReset}
            disabled={updateMutation.isPending}
          >
            <Text variant="button" color="neutral600">
              Reset
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              styles.saveButton,
              updateMutation.isPending && styles.buttonDisabled,
            ]}
            onPress={handleSave}
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text variant="button" color="neutral50">
                Save Changes
              </Text>
            )}
          </TouchableOpacity>
        </Box>
      )}
    </Box>
  );
}

const styles = StyleSheet.create({
  hoursInput: {
    borderWidth: 1,
    borderColor: "#d4d4d4",
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 6,
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    width: 60,
    textAlign: "center",
  },
  notesInput: {
    borderWidth: 1,
    borderColor: "#d4d4d4",
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 6,
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    minHeight: 40,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  resetButton: {
    backgroundColor: "#f5f5f5",
    borderWidth: 1,
    borderColor: "#d4d4d4",
  },
  saveButton: {
    backgroundColor: "#3d1900",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
