type DatePickerCallback = (date: Date | null) => void;

let pendingCallback: DatePickerCallback | null = null;

export function registerDatePickerCallback(cb: DatePickerCallback) {
  pendingCallback = cb;
}

export function resolveDatePicker(date: Date | null) {
  pendingCallback?.(date);
  pendingCallback = null;
}
