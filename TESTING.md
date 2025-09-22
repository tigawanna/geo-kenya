# Testing Strategy for GeoKenya

This document outlines the testing strategy for the GeoKenya application, including the testing framework setup, types of tests to implement, and a game plan for writing comprehensive tests.

## Current State

The GeoKenya application currently has no automated tests. This document serves as both a testing strategy guide and a roadmap for implementing a comprehensive testing suite.

## Testing Frameworks & Tools

Based on the project's technology stack, the following testing frameworks and tools are recommended:

### 1. Jest
- **Purpose**: JavaScript testing framework
- **Use Cases**: Unit tests, snapshot tests, mock functions
- **Integration**: Works seamlessly with React Native and Expo

### 2. React Native Testing Library
- **Purpose**: Test React Native components
- **Use Cases**: Component rendering, user interaction simulation, querying elements
- **Benefits**: Encourages testing from user perspective

### 3. Detox
- **Purpose**: End-to-end (E2E) testing
- **Use Cases**: Integration testing, UI flow testing, device-specific testing
- **Benefits**: Runs on real devices or emulators

## Test Categories

### 1. Unit Tests
Focus on individual functions, hooks, and utilities:
- Data access layer functions
- Utility functions
- Custom hooks
- Store (Zustand) logic

### 2. Component Tests
Test individual UI components in isolation:
- Form components
- List items
- Map components
- Navigation components

### 3. Integration Tests
Test how different parts of the application work together:
- Location services integration
- Database queries
- Navigation flows
- State management

### 4. End-to-End (E2E) Tests
Test complete user workflows:
- Location-based ward discovery
- Map interaction and pin placement
- Coordinate search
- Settings changes

## Testing Game Plan

### Phase 1: Setup & Foundation (Week 1)
1. **Install Testing Dependencies**
   ```bash
   npm install --save-dev jest @testing-library/react-native @testing-library/jest-native
   npm install --save-dev jest-expo
   ```

2. **Configure Jest**
   - Create `jest.config.js`
   - Set up test environment
   - Configure mocks for native modules

3. **Set up Test Scripts**
   ```json
   {
     "scripts": {
       "test": "jest",
       "test:watch": "jest --watch",
       "test:coverage": "jest --coverage"
     }
   }
   ```

### Phase 2: Unit Tests (Weeks 2-3)
1. **Utility Functions**
   - Test coordinate parsing functions
   - Test geometry processing functions
   - Test distance calculation functions

2. **Custom Hooks**
   - Test `useDeviceLocation` hook
   - Test theme store hooks
   - Test debounced state hooks

3. **Data Access Layer**
   - Test query option generators
   - Test database interaction functions

### Phase 3: Component Tests (Weeks 4-5)
1. **Form Components**
   - Test `LatLongForm` component
   - Test input validation
   - Test debounced search functionality

2. **List Components**
   - Test `WardListItem` component
   - Test `KenyaWards` list component
   - Test search and filtering

3. **Location Components**
   - Test `CurrentLocation` component
   - Test `CurrentWard` component
   - Test loading and error states

### Phase 4: Integration Tests (Weeks 6-7)
1. **Location Services**
   - Test location permission handling
   - Test manual location setting
   - Test location validation

2. **Database Integration**
   - Test ward lookup by coordinates
   - Test ward lookup by ID
   - Test proximity calculations

3. **Navigation Flows**
   - Test tab navigation
   - Test ward detail navigation
   - Test coordinate-based navigation

### Phase 5: E2E Tests (Weeks 8-9)
1. **Install Detox**
   ```bash
   npm install --save-dev detox
   ```

2. **Configure Detox**
   - Set up device configurations
   - Create test environment

3. **User Flow Tests**
   - Test complete location discovery flow
   - Test map interaction flow
   - Test coordinate search flow
   - Test settings changes

## Test Coverage Goals

1. **Unit Tests**: 80% coverage for utility functions and data access layer
2. **Component Tests**: 70% coverage for UI components
3. **Integration Tests**: 60% coverage for service integrations
4. **E2E Tests**: 50% coverage for critical user flows

## Mocking Strategy

### Native Modules
- Mock `expo-location` for location services
- Mock `expo-router` for navigation
- Mock `react-native-maps` for map components
- Mock `@react-native-async-storage/async-storage` for persistence

### Network & External Services
- Mock all database interactions
- Mock external API calls (if any are added)

### Geospatial Data
- Create mock GeoJSON data for testing
- Mock Spatialite database queries

## Continuous Integration

### GitHub Actions Workflow
```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm install
      - name: Run unit tests
        run: npm test
      - name: Run linting
        run: npm run lint
```

## Quality Assurance Checklist

Before each release:
- [ ] All unit tests pass
- [ ] All component tests pass
- [ ] All integration tests pass
- [ ] Code coverage meets targets
- [ ] No critical linting issues
- [ ] E2E tests pass on target devices
- [ ] Manual testing of critical flows

## Test Maintenance

1. **Regular Review**
   - Monthly review of test coverage
   - Update tests when features change
   - Remove obsolete tests

2. **Performance Monitoring**
   - Track test execution time
   - Optimize slow tests
   - Parallelize test execution where possible

3. **Documentation**
   - Keep this document updated
   - Document test patterns and conventions
   - Maintain examples of common test scenarios

## Getting Started with Testing

1. **Create a `__tests__` directory** in each component folder
2. **Name test files** with the pattern `*.test.tsx` or `*.test.ts`
3. **Follow the AAA pattern** (Arrange, Act, Assert) in tests
4. **Use descriptive test names** that explain the expected behavior
5. **Mock external dependencies** to isolate the code under test

## Example Test Structure

```
src/
├── components/
│   ├── locations/
│   │   ├── form/
│   │   │   ├── LatLongForm.tsx
│   │   │   └── __tests__/
│   │   │       └── LatLongForm.test.tsx
│   │   └── list/
│   │       ├── WardListItem.tsx
│   │       └── __tests__/
│   │           └── WardListItem.test.tsx
├── hooks/
│   ├── use-device-location.ts
│   └── __tests__/
│       └── use-device-location.test.ts
├── data-access-layer/
│   ├── wards-query-options.ts
│   └── __tests__/
│       └── wards-query-options.test.ts
```

This testing strategy will ensure the GeoKenya application is robust, reliable, and maintainable as new features are added.