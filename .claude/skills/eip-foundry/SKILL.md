```markdown
# eip-foundry Development Patterns

> Auto-generated skill from repository analysis

## Overview
This skill teaches the core development patterns and conventions used in the `eip-foundry` Python codebase. You'll learn about file naming, import/export styles, commit conventions, and how to write and run tests. While no explicit workflows were detected, this guide provides best practices and suggested commands for common development tasks.

## Coding Conventions

### File Naming
- **Style:** PascalCase
- **Example:**  
  ```plaintext
  MyModule.py
  AnotherComponent.py
  ```

### Import Style
- **Style:** Relative imports  
- **Example:**
  ```python
  from .MyModule import MyClass
  from .AnotherComponent import AnotherFunction
  ```

### Export Style
- **Style:** Named exports  
- **Example:**
  ```python
  # In MyModule.py
  class MyClass:
      pass

  def my_function():
      pass

  # Usage in another file
  from .MyModule import MyClass, my_function
  ```

### Commit Patterns
- **Type:** Conventional commits
- **Prefix:** `docs`
- **Example:**
  ```
  docs: update README with installation instructions
  ```

## Workflows

### Writing Documentation Commits
**Trigger:** When updating or adding documentation  
**Command:** `/commit-docs`

1. Make your documentation changes.
2. Stage the changes:
   ```bash
   git add .
   ```
3. Commit using the conventional format:
   ```bash
   git commit -m "docs: <your message here>"
   ```
4. Push your changes:
   ```bash
   git push
   ```

### Adding a New Module
**Trigger:** When creating a new Python module  
**Command:** `/add-module`

1. Create a new file using PascalCase:
   ```plaintext
   NewFeature.py
   ```
2. Define your classes or functions with named exports.
3. Use relative imports in other modules to use your new code.

### Running Tests
**Trigger:** When you want to verify code correctness  
**Command:** `/run-tests`

1. Locate test files matching the pattern `*.test.*`
2. Use your preferred Python test runner (e.g., `pytest`) to run tests:
   ```bash
   pytest
   ```
   *(Adjust command if a different test runner is used.)*

## Testing Patterns

- **Test file naming:** Files follow the pattern `*.test.*` (e.g., `MyModule.test.py`)
- **Framework:** Unknown (use standard Python test runners like `pytest` or `unittest`)
- **Example:**
  ```python
  # MyModule.test.py
  from .MyModule import MyClass

  def test_my_class_behavior():
      obj = MyClass()
      assert obj.some_method() == expected_value
  ```

## Commands
| Command        | Purpose                                  |
|----------------|------------------------------------------|
| /commit-docs   | Commit documentation changes              |
| /add-module    | Add a new module following conventions    |
| /run-tests     | Run all tests in the codebase             |
```