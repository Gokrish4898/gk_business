# LINQ & Entity Framework Core Practice Guide

This guide is designed for interview preparation, focusing on how **LINQ (Language Integrated Query)** is utilized in **Entity Framework Core (EF Core)** to query databases. All concepts are illustrated with real patterns and code snippets from the `GKB Business` backend project.

---

## 1. Core Interview Concepts

### IQueryable<T> vs. IEnumerable<T>
* **`IQueryable<T>`**: Represents a query that has *not yet executed* and is intended for a specific data source (like a SQL database). The query execution is deferred, allowing EF Core to build a single SQL query incorporating filters (`Where`), pagination (`Skip`/`Take`), and sorting (`OrderBy`) before executing it on the server.
* **`IEnumerable<T>`**: Represents an in-memory collection. Querying an `IEnumerable<T>` pulls the entire dataset into memory first, and subsequent filtering or pagination is processed locally in the application's RAM (causing performance bottlenecks).

### Deferred Execution
Queries in LINQ are not executed when they are declared. They execute only when:
1. You enumerate over them (e.g., using a `foreach` loop).
2. You call execution operators such as `.ToListAsync()`, `.CountAsync()`, `.FirstOrDefaultAsync()`, or `.ToDictionaryAsync()`.

---

## 2. LINQ Query Patterns in this Project

Here are the key LINQ operators utilized in `AdminOrderApiController` and `CartApiController`:

### 1. Filtering with `.Where()`
Filters rows using a predicate. This maps to the SQL `WHERE` clause.
```csharp
// Example: Soft delete check
var items = await _context.CartItems
    .Where(ci => ci.CartId == cart.CartId && ci.Active == 1)
    .ToListAsync();
```

### 2. Projections with `.Select()`
Transforms data into a new shape. Can project into standard classes or dynamic anonymous objects.
```csharp
// Projects OrderItems to get a distinct list of Order IDs that contain recipes
var orderItemHasRecipe = await _context.OrderItems
    .Where(oi => orderIds.Contains(oi.OrderId) && oi.Active == 1 && !string.IsNullOrEmpty(oi.RecipeDetails))
    .Select(oi => oi.OrderId)
    .Distinct()
    .ToListAsync();
```

### 3. Pagination with `.Skip()` and `.Take()`
Essential for performance. 
* `.Skip(N)` skips the first `N` rows.
* `.Take(M)` retrieves the next `M` rows.
```csharp
// Maps to OFFSET & FETCH / LIMIT in SQL
var list = await query
    .Skip(pageIndex * pageSize)
    .Take(pageSize)
    .ToListAsync();
```

### 4. Lookups with `.ToDictionaryAsync()`
Loads records into an in-memory dictionary for high-performance `O(1)` local lookups during mapping.
```csharp
// Load products into a dictionary keyed by ProductId
var products = await _context.Products.ToDictionaryAsync(p => p.ProductId);

// Local mapping
products.TryGetValue(item.ProductId, out var product);
```

---

## 3. Real-World Query Breakdown

Let's look at a complete query from `AdminOrderApiController.cs`'s `ListOrders` endpoint:

```csharp
// 1. Build the base query (IQueryable - nothing executed yet)
var query = _context.Orders.Where(o => o.Active == 1);

// 2. Add dynamic filters conditionally
if (orderStatusId > 0)
{
    query = query.Where(o => o.OrderStatus == statusName);
}
if (!string.IsNullOrEmpty(searchTerm))
{
    query = query.Where(o => o.OrderNumber.Contains(searchTerm));
}

// 3. Execute count query (fires SELECT COUNT(...) FROM Orders)
int totalCount = await query.CountAsync();

// 4. Apply pagination and sorting, then retrieve list (fires SQL SELECT OFFSET/LIMIT)
var list = await query
    .Skip(pageIndex * pageSize)
    .Take(pageSize)
    .ToListAsync();
```

---

## 4. Top Interview Questions & Answers

### Q1: What is the difference between `First()`, `FirstOrDefault()`, `Single()`, and `SingleOrDefault()`?
* **`First()`**: Returns the first element in a sequence. Throws an exception if empty.
* **`FirstOrDefault()`**: Returns the first element, or `null` (default value) if empty.
* **`Single()`**: Returns the *only* element. Throws an exception if sequence has 0 or >1 elements.
* **`SingleOrDefault()`**: Returns the only element, `null` if empty. Throws an exception if >1 elements.

### Q2: What is the N+1 Query Problem, and how do you prevent it in Entity Framework?
* **Problem**: Occurs when you fetch a list of parent records and then execute a separate query to fetch related child records for each individual parent (resulting in 1 query for parents + N queries for children).
* **Prevention**:
  1. **Eager Loading**: Use `.Include(o => o.OrderItems)` to fetch child data in a single SQL join.
  2. **Batch Loading**: Query details in a batch (e.g. using `.ToDictionaryAsync()`) as done in this project.

### Q3: Why should we use `AsNoTracking()` in EF Core queries?
* **Answer**: By default, EF Core tracks queries in its change tracker so it can detect updates when saving. For read-only actions (like displaying lists or lookup dictionaries), tracking is unnecessary overhead. Adding `.AsNoTracking()` disables tracking, saving memory and processing time.

### Q4: How does EF Core translate LINQ to SQL?
* **Answer**: When you write a query against `DbSet`, the LINQ provider parses the Expression Tree of the query. When an execution command (like `.ToListAsync()`) is invoked, the provider compiles that Expression Tree into a database-specific SQL string and sends it to the server.

---

## 5. Practice Exercises

Try writing queries to solve the following requirements:
1. **Find total spend**: Get the sum of all orders placed by user with ID `5`.
   * *Answer*: `_context.Orders.Where(o => o.UserId == 5 && o.Active == 1).SumAsync(o => o.GrandTotal);`
2. **Find top selling products**: Retrieve the top 5 products ordered most frequently.
   * *Answer*: Group `OrderItems` by `ProductId`, order by count descending, and take 5.
