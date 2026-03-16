---
name: react-native-testing
description: Helps write unit tests and snapshot tests for a React Native Expo app using Jest and React Native Testing Library. Use this skill when asked to write tests, add test coverage, identify what should be tested, or set up testing for existing components.
---

# React Native Testing Skill

## Stack
- **Framework:** Jest (bundled with Expo)
- **Component testing:** React Native Testing Library (@testing-library/react-native)
- **Snapshots:** Built-in Jest snapshots
- **Language:** TypeScript (mirror the source file's language)

## File placement
- Test files live next to the source file: `components/Button.tsx` → `components/__tests__/Button.test.tsx`
- One test file per source file
- Never put tests in a top-level `__tests__` folder unless the project already does so

## Before writing any test – analyse first
1. Read the component or function fully before writing anything
2. Identify: props, internal state, user interactions, side effects, edge cases
3. Ask yourself: "What would break silently if someone changed this?" — test that
4. Skip testing: third-party library internals, pure style objects, one-line wrappers with no logic

## What to test (priority order)
1. **Logic** – functions that calculate, transform or validate data
2. **Behaviour** – what happens when a user presses a button, submits a form, etc.
3. **Conditional rendering** – components that show/hide content based on props or state
4. **Snapshots** – stable presentational components with no logic (use sparingly)

## Unit test structure
```typescript
import { render, screen, fireEvent } from '@testing-library/react-native';
import { ComponentName } from '../ComponentName';

describe('ComponentName', () => {
  it('renders correctly with required props', () => {
    render(<ComponentName label="Test" />);
    expect(screen.getByText('Test')).toBeTruthy();
  });

  it('calls onPress when tapped', () => {
    const onPress = jest.fn();
    render(<ComponentName label="Tap me" onPress={onPress} />);
    fireEvent.press(screen.getByText('Tap me'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
```

## Snapshot test structure
```typescript
import { render } from '@testing-library/react-native';
import { ComponentName } from '../ComponentName';

it('matches snapshot', () => {
  const { toJSON } = render(<ComponentName label="Hello" />);
  expect(toJSON()).toMatchSnapshot();
});
```

Use snapshots **only** for purely presentational components. Never snapshot a component that contains business logic — test the logic explicitly instead.

## Mocking
- Mock `expo-router` navigation: `jest.mock('expo-router', () => ({ useRouter: () => ({ push: jest.fn() }) }))`
- Mock async storage, APIs or native modules in `jest.setup.js`
- Prefer `jest.fn()` over complex mock implementations — keep mocks simple

## Rules
- Each `it()` block tests exactly one thing
- Test description starts with a verb: "renders", "calls", "shows", "hides", "returns"
- Never test implementation details (internal state variable names, private methods)
- If a test is hard to write, the component probably needs to be split up — say so
- Add a comment `// TODO: test` above any logic you identify as worth testing but skip for now

## When asked "what should I test?"
1. List files/components with untested logic (not just UI)
2. Prioritise by risk: code that runs on every screen > utility functions > pure display components
3. Suggest a concrete starting point: "Start with X because it has Y logic and is used everywhere"
