# Testing Guide

This document describes the test setup and how to run tests for the Alicia P Ceramics admin app.

## Test Files

### API Tests
- **Location**: `api/data/__tests__/orders.test.ts`
- **Coverage**: Tests for the `updateOrderDetailProgress` function
- **Test Cases**:
  - Updating only status
  - Updating only completed quantity
  - Updating both status and completed quantity
  - Setting status_changed_at timestamp when status changes
  - Not setting status_changed_at when only quantity changes
  - Handling zero completed quantity
  - Error handling from Supabase
  - All valid status values (pending, build, trim, attach, trim_final, bisque, glaze, fire, completed)

### Hook Tests
- **Location**: `hooks/__tests__/useUpdateOrderDetailProgress.test.tsx`
- **Coverage**: Tests for the `useUpdateOrderDetailProgress` React Query hook
- **Test Cases**:
  - Successful mutations with various parameter combinations
  - API error handling
  - Query invalidation on success (order detail and orders list)
  - Pending state during mutations
  - Resetting state after mutations
  - Working with different order IDs

## Setting Up Tests

To run these tests, you'll need to install testing dependencies:

```bash
pnpm add -D jest @testing-library/react @testing-library/react-hooks @testing-library/react-native @types/jest ts-jest react-test-renderer
```

### Jest Configuration

Create a `jest.config.js` file in the project root:

```javascript
module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  testMatch: [
    '**/__tests__/**/*.(test|spec).(ts|tsx)',
    '**/*.(test|spec).(ts|tsx)',
  ],
};
```

### Jest Setup File

Create a `jest.setup.js` file:

```javascript
import '@testing-library/jest-native/extend-expect';

// Mock Expo modules
jest.mock('expo-router', () => ({
  useLocalSearchParams: jest.fn(),
  useNavigation: jest.fn(),
  useRouter: jest.fn(),
}));

jest.mock('expo-clipboard', () => ({
  setStringAsync: jest.fn(),
}));
```

### Package.json Scripts

Add test scripts to your `package.json`:

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

## Running Tests

Once the setup is complete:

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage report
pnpm test:coverage

# Run a specific test file
pnpm test orders.test.ts

# Run tests matching a pattern
pnpm test useUpdateOrderDetailProgress
```

## Test Coverage

Current test coverage includes:

- ✅ `updateOrderDetailProgress` API function (10 test cases)
- ✅ `useUpdateOrderDetailProgress` React hook (9 test cases)

### Coverage Goals

The tests cover:
- ✅ Happy path scenarios
- ✅ Edge cases (zero quantity, undefined parameters)
- ✅ Error handling
- ✅ Query invalidation
- ✅ State management (pending, success, error)
- ✅ All valid status values
- ✅ Timestamp handling

## Writing New Tests

When adding new API functions or hooks, follow these patterns:

### API Function Tests
```typescript
import { yourFunction } from "../yourModule";
import { getAliciapCeramicsSubaseClient } from "../../aliciapCeramicsClient";

jest.mock("../../aliciapCeramicsClient");

describe("yourFunction", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Setup mocks
  });

  it("should do something", async () => {
    // Arrange
    // Act
    // Assert
  });
});
```

### Hook Tests
```typescript
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useYourHook } from "../useYourHook";

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe("useYourHook", () => {
  it("should work", async () => {
    const { result } = renderHook(() => useYourHook(), {
      wrapper: createWrapper(),
    });

    // Test logic
  });
});
```

## Continuous Integration

These tests can be integrated into CI/CD pipelines:

```yaml
# Example GitHub Actions workflow
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - run: pnpm install
      - run: pnpm test
```

## Notes

- Tests use Jest mocking to avoid actual Supabase calls
- React Query hooks are tested with a test QueryClient to avoid side effects
- All async operations use `waitFor` to ensure proper timing
- Tests follow the Arrange-Act-Assert pattern
