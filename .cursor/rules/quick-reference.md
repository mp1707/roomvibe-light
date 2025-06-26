# Quick Reference - Cursor Refactoring Rules

## Most Common Rules (Use These First)

### 🔄 `refactor-early-returns`

**When to use:** Nested if-else statements, complex conditionals

```typescript
// Select this type of code:
if (condition1) {
  if (condition2) {
    if (condition3) {
      return result;
    }
  }
}
```

### 🏗️ `refactor-decompose-component`

**When to use:** Components over 50 lines, mixed concerns

```typescript
// Select large components with multiple responsibilities
const LargeComponent = () => {
  // State management
  // Data fetching
  // Complex UI rendering
  // Event handling
  return <div>{/* 100+ lines */}</div>;
};
```

### 🧹 `refactor-dry-code`

**When to use:** Repeated JSX patterns, similar components

```jsx
// Select repetitive code like this:
<button className="btn primary">Save</button>
<button className="btn secondary">Cancel</button>
<button className="btn danger">Delete</button>
```

### ⚡ `refactor-extract-hook`

**When to use:** Complex state logic, repeated useState/useEffect patterns

```typescript
// Select components with complex state management
const Component = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Complex fetching logic
  }, []);

  // More state and effects...
};
```

## Advanced Rules (Use When Needed)

### 🔧 `refactor-typescript-optimization`

**When to use:** `any` types, loose typing, missing interfaces

```typescript
// Select code with poor typing:
const handleClick = (e: any) => {
  const data: any = processData(e.target.value);
};
```

### 🎨 `refactor-tailwind-optimization`

**When to use:** Messy class strings, repeated class combinations

```jsx
// Select disorganized Tailwind classes:
<div className="bg-white text-black p-4 rounded shadow-md w-full flex flex-col md:w-1/2 lg:w-1/3 hover:shadow-lg">
```

### ♿ `refactor-accessibility`

**When to use:** Interactive elements without proper ARIA, missing semantic HTML

```jsx
// Select non-accessible code:
<div onClick={handleClick}>Click me</div>
<div className="modal">
  <span onClick={close}>×</span>
</div>
```

### 🚀 `refactor-performance`

**When to use:** Frequent re-renders, expensive calculations, large lists

```typescript
// Select performance-problematic code:
const Component = ({ items }) => {
  const expensiveValue = items.map(process).filter(validate);
  return <div>{expensiveValue.map(render)}</div>;
};
```

## Rule Selection Tips

### 📋 What to Select

1. **Exact code block** - Select only the code you want to refactor
2. **Complete functions** - Include the entire function/component for decomposition
3. **Related patterns** - Select all similar repetitive code for DRY refactoring

### ❌ What NOT to Select

1. **Partial statements** - Don't select incomplete syntax
2. **Mixed concerns** - Don't select unrelated code blocks
3. **Import statements** - Usually not needed in selection

## Workflow Recommendations

### 🔄 Standard Refactoring Flow

1. **Start with early returns** - Clean up conditional logic first
2. **Apply DRY principles** - Remove repetition
3. **Decompose large components** - Break into smaller pieces
4. **Extract hooks and functions** - Separate concerns
5. **Optimize TypeScript** - Improve type safety
6. **Add accessibility** - Ensure inclusive design
7. **Performance optimization** - Final performance tuning

### 🎯 Quick Wins (5-minute refactors)

1. `refactor-early-returns` - Immediate readability improvement
2. `refactor-self-closing` - Clean JSX formatting
3. `refactor-tailwind-optimization` - Better CSS organization

### 🏗️ Deeper Refactors (15-30 minutes)

1. `refactor-decompose-component` - Architectural improvements
2. `refactor-extract-hook` - Logic separation
3. `refactor-accessibility` - Comprehensive a11y

## Common Patterns to Look For

### 🚨 Code Smells That Need Refactoring

```typescript
// Nested conditionals
if (user) {
  if (user.isActive) {
    if (user.hasPermission) {
      // action
    }
  }
}

// Repeated UI patterns
<div className="card primary">...</div>
<div className="card secondary">...</div>
<div className="card warning">...</div>

// Large components
const Dashboard = () => {
  // 200+ lines of mixed logic
};

// Poor TypeScript
const handler = (data: any) => {
  const result: any = process(data);
};

// Non-accessible UI
<div onClick={action}>Button</div>
<div style={{display: showModal ? 'block' : 'none'}}>Modal</div>
```

## Pro Tips

💡 **Combine rules**: Apply multiple rules in sequence for comprehensive refactoring

💡 **Test frequently**: Run tests after each refactoring step

💡 **Use git**: Commit after each successful refactor for easy rollback

💡 **Review generated code**: Always review and adjust the AI-generated code

💡 **Start small**: Begin with simple rules before attempting complex refactors
