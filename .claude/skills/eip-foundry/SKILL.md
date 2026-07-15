```markdown
# eip-foundry Development Patterns

> Auto-generated skill from repository analysis

## Overview
This skill teaches the core development patterns and conventions used in the `eip-foundry` JavaScript codebase. You'll learn how to structure files, write and organize code, follow commit message standards, and run tests in alignment with the repository's established practices.

## Coding Conventions

### File Naming
- Use **snake_case** for all file names.
  - Example:  
    ```
    user_profile.js
    data_utils.js
    ```

### Imports
- Use **relative imports** for modules within the project.
  - Example:
    ```javascript
    import { fetchData } from './data_utils.js';
    ```

### Exports
- Use **named exports** rather than default exports.
  - Example:
    ```javascript
    // In data_utils.js
    export function fetchData() { ... }
    export const API_URL = '...';

    // In another file
    import { fetchData, API_URL } from './data_utils.js';
    ```

### Commit Messages
- Follow **conventional commit** format.
- Use the `feat` prefix for new features.
- Keep commit messages concise (average ~72 characters).
  - Example:
    ```
    feat: add user authentication middleware
    ```

## Workflows

### Feature Development
**Trigger:** When adding a new feature  
**Command:** `/feature-development`

1. Create a new branch for your feature.
2. Implement the feature in snake_case files.
3. Use relative imports and named exports.
4. Write or update corresponding test files (`*.test.*`).
5. Commit changes using the `feat` prefix and a concise message.
6. Open a pull request for review.

### Testing
**Trigger:** Before merging or releasing code  
**Command:** `/run-tests`

1. Locate or create test files matching the `*.test.*` pattern.
2. Run the test suite using the project's test runner (framework unknown; check project scripts).
3. Ensure all tests pass before merging changes.

## Testing Patterns

- Test files use the `*.test.*` naming convention (e.g., `user_profile.test.js`).
- The specific testing framework is not detected; check the repository for test scripts or documentation.
- Place test files alongside the modules they test or in a dedicated test directory.

  Example test file:
  ```javascript
  // user_profile.test.js
  import { fetchData } from './user_profile.js';

  test('fetchData returns expected result', () => {
    // ...test implementation
  });
  ```

## Commands
| Command               | Purpose                                   |
|-----------------------|-------------------------------------------|
| /feature-development  | Start the workflow for adding a new feature|
| /run-tests            | Run the test suite                        |
```
