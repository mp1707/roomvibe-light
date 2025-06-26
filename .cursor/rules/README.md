# Cursor Refactoring Rules

This directory contains specialized cursor rules for refactoring your Next.js/React/TypeScript/TailwindCSS codebase.

## How to Use

1. **Select the code** you want to refactor in your editor
2. **Open the command palette** with `Cmd+K` (Mac) or `Ctrl+K` (Windows)
3. **Type the rule name** (e.g., "refactor-early-returns") to apply that specific refactoring pattern

## Available Rules

### Core Refactoring Rules

- **`refactor-early-returns`** - Convert nested conditionals to early returns and guard clauses
- **`refactor-self-closing`** - Convert empty elements to self-closing tags and optimize JSX
- **`refactor-decompose-component`** - Break large components into smaller, focused components
- **`refactor-extract-pure-function`** - Extract complex logic into pure utility functions
- **`refactor-extract-hook`** - Extract component logic into reusable custom hooks
- **`refactor-dry-code`** - Eliminate repetition using DRY principles

### Advanced Optimization Rules

- **`refactor-typescript-optimization`** - Improve TypeScript usage and type safety
- **`refactor-tailwind-optimization`** - Optimize TailwindCSS usage and responsive design
- **`refactor-accessibility`** - Add comprehensive accessibility improvements (WCAG 2.1 AA)
- **`refactor-performance`** - Optimize React performance and bundle size
- **`refactor-nextjs-patterns`** - Optimize for Next.js App Router and modern patterns

## Rule Examples

### Early Returns

```typescript
// Before
const Component = ({ data, isLoading, error }) => {
  if (!isLoading) {
    if (!error) {
      if (data) {
        return <div>{data.title}</div>;
      }
    }
  }
  return <div>Loading...</div>;
};

// After
const Component = ({ data, isLoading, error }) => {
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data) return <div>No data</div>;

  return <div>{data.title}</div>;
};
```

### Component Decomposition

```typescript
// Before: Large component
const UserDashboard = () => {
  // 100+ lines of mixed logic and UI
};

// After: Decomposed components
const UserProfile = ({ user, onEdit }) => {
  /* focused component */
};
const PostList = ({ posts, onPostClick }) => {
  /* focused component */
};

const UserDashboard = ({ userId }) => {
  return (
    <div>
      <UserProfile user={user} onEdit={handleUserEdit} />
      <PostList posts={posts} onPostClick={handlePostClick} />
    </div>
  );
};
```

### DRY Principles

```typescript
// Before: Repetitive buttons
<button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">Save</button>
<button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">Cancel</button>

// After: Reusable component
const Button = ({ variant, children, onClick }) => {
  const variants = {
    primary: "bg-blue-500 hover:bg-blue-600",
    danger: "bg-red-500 hover:bg-red-600"
  };
  return (
    <button className={`${variants[variant]} text-white px-4 py-2 rounded`} onClick={onClick}>
      {children}
    </button>
  );
};
```

## Best Practices

1. **Use specific rules** - Choose the most specific rule for your refactoring task
2. **Select appropriate code** - Select the exact code block you want to refactor
3. **Review results** - Always review the generated code before applying
4. **Combine rules** - You can apply multiple rules sequentially for comprehensive refactoring
5. **Test after refactoring** - Ensure functionality remains intact after refactoring

## Stack-Specific Guidelines

### Next.js

- Prefer Server Components over Client Components
- Use proper data fetching patterns
- Implement loading.tsx and error.tsx files
- Add proper metadata for SEO

### TypeScript

- Use strict typing with proper interfaces
- Prefer specific types over `any`
- Use discriminated unions for complex state
- Add proper generic constraints

### TailwindCSS

- Group utilities logically (layout → spacing → colors → typography → effects)
- Use responsive prefixes consistently
- Implement proper dark mode support
- Create reusable component variants

### React

- Use early returns for loading/error states
- Extract complex logic into custom hooks
- Implement proper memoization for performance
- Follow component composition patterns

## Troubleshooting

If a rule doesn't work as expected:

1. Ensure you've selected the appropriate code block
2. Check that the code follows the expected patterns
3. Review the rule description for specific requirements
4. Try selecting a larger or smaller code block

## Contributing

To add new rules or improve existing ones, edit the `.cursorrules` file in the project root. Follow the established pattern:

```
# Rule: rule-name
# Brief description
You are an expert in [domain].

[Detailed instructions]

[Examples]

Provide [expected output format].
```
