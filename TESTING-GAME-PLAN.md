# GeoKenya Test Implementation Game Plan

This document provides a detailed, actionable game plan for implementing tests in the GeoKenya application. It breaks down the testing approach into specific, manageable tasks with clear objectives and timelines.

## Phase 1: Environment Setup (Days 1-2)

### Task 1.1: Install Testing Dependencies
**Objective**: Set up the testing environment with all required tools

**Actions**:
1. Install core testing libraries:
   ```bash
   npm install --save-dev jest @testing-library/react-native @testing-library/jest-native jest-expo
   ```

2. Install additional utilities:
   ```bash
   npm install --save-dev react-test-renderer
   ```

3. Install type definitions:
   ```bash
   npm install --save-dev @types/jest
   ```

### Task 1.2: Configure Jest
**Objective**: Create a comprehensive Jest configuration

**Actions**:
1. Create `jest.config.js` in the project root:
   ```javascript
   module.exports = {
     preset: 'jest-expo',
     transformIgnorePatterns: [
       'node_modules/(?!(@react-native|react-clone-referenced-element|@react-native-community|expo(nent)?|@expo(nent)?/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg))'
     ],
     setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
     collectCoverageFrom: [
       'src/**/*.{ts,tsx}',
       '!src/**/*.d.ts',
       '!src/app/**/*', // Expo Router files
     ],
     coverageThreshold: {
       global: {
         branches: 80,
         functions: 80,
         lines: 80,
         statements: 80,
       },
     },
   };
   ```

2. Create `jest.setup.js` for global mocks:
   ```javascript
   import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';
   
   jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);
   
   // Mock Expo modules
   jest.mock('expo-router', () => ({
     useRouter: () => ({
       push: jest.fn(),
       back: jest.fn(),
     }),
     usePathname: () => '/',
     useLocalSearchParams: () => ({}),
   }));
   
   jest.mock('expo-location', () => ({
     requestForegroundPermissionsAsync: jest.fn(),
     getCurrentPositionAsync: jest.fn(),
   }));
   ```

### Task 1.3: Update Package.json
**Objective**: Add test scripts for easy execution

**Actions**:
1. Add test-related scripts to `package.json`:
   ```json
   {
     "scripts": {
       "test": "jest",
       "test:watch": "jest --watch",
       "test:coverage": "jest --coverage",
       "test:debug": "jest --debug"
     }
   }
   ```

## Phase 2: Unit Testing Foundation (Days 3-7)

### Task 2.1: Test Utility Functions
**Objective**: Achieve 90% coverage for utility functions

**Target Files**:
- `src/utils/logger.ts`
- `src/lib/map-libre/geom-parse.ts`
- Any other utility files

**Actions**:
1. Create `src/utils/__tests__/logger.test.ts`
2. Test all log levels (info, warn, error)
3. Verify logger behavior in different environments
4. Create `src/lib/map-libre/__tests__/geom-parse.test.ts`
5. Test `geomParse` with valid and invalid inputs
6. Test `isValidGeoJSONGeometry` with various geometries
7. Test `calculateBBox` with different coordinate sets

### Task 2.2: Test Custom Hooks
**Objective**: Ensure all custom hooks are properly tested

**Target Files**:
- `src/hooks/use-device-location.ts`

**Actions**:
1. Create `src/hooks/__tests__/use-device-location.test.ts`
2. Mock `expo-location` module
3. Test permission granted flow
4. Test permission denied flow
5. Test location retrieval
6. Test manual location setting
7. Test loading and error states

### Task 2.3: Test Data Access Layer
**Objective**: Validate all database query functions

**Target Files**:
- `src/data-access-layer/wards-query-options.ts`
- `src/data-access-layer/location-query.ts`

**Actions**:
1. Create `src/data-access-layer/__tests__/wards-query-options.test.ts`
2. Test query option generation functions
3. Mock database responses
4. Verify query keys are correctly formed
5. Create `src/data-access-layer/__tests__/location-query.test.ts`
6. Test location validation functions
7. Test point-in-kenya verification

## Phase 3: Component Testing (Days 8-14)

### Task 3.1: Test Form Components
**Objective**: Ensure all form components work correctly

**Target Files**:
- `src/components/locations/form/LatLongForm.tsx`

**Actions**:
1. Create `src/components/locations/form/__tests__/LatLongForm.test.tsx`
2. Test initial rendering with default values
3. Test input change handling
4. Test debounced state updates
5. Test validation for coordinate inputs
6. Test loading states during debouncing

### Task 3.2: Test List Components
**Objective**: Validate ward listing functionality

**Target Files**:
- `src/components/locations/list/WardListItem.tsx`
- `src/components/locations/list/KenyaWards.tsx`

**Actions**:
1. Create `src/components/locations/list/__tests__/WardListItem.test.tsx`
2. Test rendering with ward data
3. Test navigation on press
4. Test distance display formatting
5. Create `src/components/locations/list/__tests__/KenyaWards.test.tsx`
6. Test list rendering with data
7. Test empty state handling
8. Test search functionality
9. Test loading states

### Task 3.3: Test Location Components
**Objective**: Verify location-based components work correctly

**Target Files**:
- `src/components/locations/CurrentLocation.tsx`
- `src/components/locations/CurrentWard.tsx`

**Actions**:
1. Create `src/components/locations/__tests__/CurrentLocation.test.tsx`
2. Test rendering with location data
3. Test error state handling
4. Test loading states
5. Test action button functionality
6. Create `src/components/locations/__tests__/CurrentWard.test.tsx`
7. Test ward display with valid data
8. Test no ward found state
9. Test retry functionality

## Phase 4: Integration Testing (Days 15-21)

### Task 4.1: Test Location Services Integration
**Objective**: Ensure location services work end-to-end

**Actions**:
1. Create `src/integration-tests/location-services.test.ts`
2. Test full location permission flow
3. Test location retrieval and validation
4. Test manual location override
5. Test location persistence

### Task 4.2: Test Database Integration
**Objective**: Validate database queries work correctly

**Actions**:
1. Create `src/integration-tests/database-queries.test.ts`
2. Test ward lookup by coordinates
3. Test ward lookup by ID
4. Test proximity calculations
5. Test county and constituency lookups

### Task 4.3: Test State Management
**Objective**: Ensure global state works correctly

**Target Files**:
- `src/store/settings-store.ts`

**Actions**:
1. Create `src/store/__tests__/settings-store.test.ts`
2. Test theme toggling
3. Test dynamic color settings
4. Test persistence to AsyncStorage
5. Test state hydration

## Phase 5: End-to-End Testing Setup (Days 22-25)

### Task 5.1: Install and Configure Detox
**Objective**: Set up Detox for E2E testing

**Actions**:
1. Install Detox:
   ```bash
   npm install --save-dev detox
   ```

2. Initialize Detox configuration:
   ```bash
   npx detox init -r jest
   ```

3. Configure `detox.config.js`:
   ```javascript
   module.exports = {
     testRunner: 'jest',
     runnerConfig: 'e2e/config.json',
     configurations: {
       'android.emu.debug': {
         type: 'android.emulator',
         binaryPath: 'android/app/build/outputs/apk/debug/app-debug.apk',
         build: 'cd android && ./gradlew assembleDebug assembleAndroidTest -DtestBuildType=debug',
         device: {
           avdName: 'Pixel_4_API_30'
         }
       }
     }
   };
   ```

### Task 5.2: Create First E2E Tests
**Objective**: Implement basic E2E tests for core flows

**Actions**:
1. Create `e2e/config.json`
2. Create `e2e/firstTest.e2e.js`
3. Test app launch and initial screen
4. Test navigation between tabs
5. Test basic ward listing

## Phase 6: Advanced Testing (Days 26-30)

### Task 6.1: Test Map Functionality
**Objective**: Validate map interactions and rendering

**Target Files**:
- `src/components/locations/maps/WardWithNeighborsMap.tsx.tsx`

**Actions**:
1. Create `src/components/locations/maps/__tests__/WardWithNeighborsMap.test.tsx`
2. Test map rendering with ward data
3. Test camera positioning
4. Test feature styling
5. Test map press handling

### Task 6.2: Test Search Functionality
**Objective**: Ensure all search methods work correctly

**Actions**:
1. Create `src/integration-tests/search-functionality.test.ts`
2. Test coordinate-based search
3. Test text-based search
4. Test map-based search (pin placement)
5. Test search result validation

### Task 6.3: Test Theme and Appearance
**Objective**: Verify theme switching and appearance settings

**Actions**:
1. Create `src/integration-tests/theme-settings.test.ts`
2. Test light/dark mode switching
3. Test dynamic color settings
4. Test system preference detection
5. Test theme persistence

## Phase 7: CI/CD Integration (Days 31-32)

### Task 7.1: Set up GitHub Actions
**Objective**: Automate testing in CI environment

**Actions**:
1. Create `.github/workflows/test.yml`:
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
         - name: Generate coverage report
           run: npm run test:coverage
   ```

### Task 7.2: Configure Test Reporting
**Objective**: Ensure test results are properly reported

**Actions**:
1. Configure Jest to output JUnit reports
2. Set up coverage reporting
3. Integrate with GitHub Actions

## Phase 8: Documentation and Maintenance (Days 33-35)

### Task 8.1: Update Documentation
**Objective**: Ensure testing documentation is comprehensive

**Actions**:
1. Update `TESTING.md` with actual implementation details
2. Add examples of common test patterns
3. Document troubleshooting tips
4. Create a test writing guide

### Task 8.2: Establish Maintenance Procedures
**Objective**: Create processes for ongoing test maintenance

**Actions**:
1. Define test review procedures
2. Set up coverage monitoring
3. Create test update guidelines
4. Establish performance monitoring

## Success Metrics

By the end of this 5-week game plan, we should have:

1. **80%+ Unit Test Coverage** of utility functions and data access layer
2. **70%+ Component Test Coverage** of UI components
3. **60%+ Integration Test Coverage** of service integrations
4. **At least 10 E2E Tests** covering critical user flows
5. **Automated CI/CD Pipeline** running tests on every commit
6. **Comprehensive Documentation** for test maintenance

## Risk Mitigation

1. **Complex Native Dependencies**: Some components may be difficult to mock. Solution: Use Detox for end-to-end testing where unit testing is insufficient.

2. **Geospatial Data Complexity**: GeoJSON and coordinate calculations may be challenging to test. Solution: Create comprehensive mock data sets and validate against known values.

3. **Time Constraints**: The plan may need adjustment based on implementation speed. Solution: Prioritize critical paths and adjust scope as needed.

4. **Team Learning Curve**: Team members may need time to learn testing frameworks. Solution: Schedule regular knowledge sharing sessions and pair programming.

This game plan provides a structured approach to implementing comprehensive testing for the GeoKenya application, ensuring quality and maintainability as the project grows.