# Recipe Master and JSONB Migration Notes

This document summarizes the database schema refactoring, backend entity configuration updates, and frontend alignment implemented for the Recipe Master module.

---

## 1. Database Model and Controller Cleanup
We simplified the backend system to focus exclusively on Recipe and Stock management:
* **Models Removed**: Deleted unused entities from `Models/` including:
  * `Deliverycharge.cs`, `Discount.cs`, `ExtraTopping.cs`, `Order.cs`, `Paymenttype.cs`, `Price.cs`, `Product.cs`, `Role.cs`, `Tax.cs`, `UserDetails.cs`, and `Wishlist.cs`.
* **DbContext Configuration**: Cleaned up [AppDbContext.cs](file:///d:/Project/Git/gk_business/gkb-backend/Models/AppDbContext.cs) to retain only the `Recipes` and `Stocks` DbSets and removed the corresponding model mapping configurations inside `OnModelCreating`.
* **Controllers & Services**: Deleted the unused `ProductApiController.cs` and its corresponding interface/service implementation `IProduct.cs`.

---

## 2. PostgreSQL JSONB Integration
Instead of storing ingredients as serialized plain text in the database (which required client-side stringification and manual database parsing), we transitioned the schema to a native PostgreSQL `jsonb` column:
* **Model Type**: Mapped `Ingredients` as a typed list of structures:
  ```csharp
  [Column("ingredients", TypeName = "jsonb")] 
  public List<RecipeIngredient>? Ingredients { get; set; }
  ```
* **Migration Safeguards**: Scaffolded the EF Core migration `RemoveUnusedModelsAndUseJsonb` and updated it to include constraint checks (`DROP INDEX IF EXISTS` / `DROP CONSTRAINT IF EXISTS`) and raw SQL column casting to prevent errors with pre-existing database definitions:
  ```sql
  ALTER TABLE recipe ALTER COLUMN ingredients TYPE jsonb USING (CASE WHEN ingredients IS NULL OR ingredients = '' THEN '[]'::jsonb ELSE ingredients::jsonb END);
  ```

---

## 3. EF Core Value Conversion (Npgsql 8.0+)
Npgsql v8.0+ disables dynamic serialization by default for typed database JSON mappings, which causes runtime `NotSupportedExceptions` during inserts. 

We bypassed this driver restriction elegantly at the ORM layer using an EF Core **Value Converter** in [AppDbContext.cs](file:///d:/Project/Git/gk_business/gkb-backend/Models/AppDbContext.cs):
```csharp
private static readonly JsonSerializerOptions _jsonOptions = new JsonSerializerOptions
{
    PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
    WriteIndented = false
};

// ... inside OnModelCreating:
modelBuilder.Entity<Recipe>(e => {
    e.ToTable("recipe");
    e.HasKey(r => r.RecipeId);
    e.Property(r => r.RecipeId).HasColumnName("recipeid");
    e.Property(r => r.RecipeName).HasColumnName("recipe_name");
    
    e.Property(r => r.Ingredients)
     .HasColumnName("ingredients")
     .HasColumnType("jsonb")
     .HasConversion(
         v => v == null ? null : JsonSerializer.Serialize(v, _jsonOptions),
         v => string.IsNullOrEmpty(v) ? new List<RecipeIngredient>() : JsonSerializer.Deserialize<List<RecipeIngredient>>(v, _jsonOptions) ?? new List<RecipeIngredient>()
     );

    MapAuditColumns(e);
});
```

---

## 4. Frontend Recipe Component Integration
We updated [recipe.ts](file:///d:/Project/Git/gk_business/gkb-ui/src/app/Admin/master/recipe/recipe.ts) and [recipe.html](file:///d:/Project/Git/gk_business/gkb-ui/src/app/Admin/master/recipe/recipe.html) to interact with the new backend changes:
* **Object Array Transmission**: Stopped using `JSON.stringify()` when submitting recipes; instead, we pass the raw object list directly.
* **Auto-Generated Identifiers**: Passed `recipeid: 0` during new recipe creation to delegate identity generation to PostgreSQL.
* **Data Normalization**: Mapped and normalized incoming keys (casing like `recipeId` vs `recipeid`, and checking types) so the component remains backward-compatible.
* **Editing Backend API Integration**: Wired up the submission modal to trigger `_editrecipe(editedRecipe)` to save changes correctly to the database.
* **Template Updates**: Updated the table loop in `recipe.html` to display the actual ingredient/stock name (`ing.StackName`) rather than duplicating the unit of measure.
