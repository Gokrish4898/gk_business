namespace gkb_service.Model
{
    public class RecipeIngredient
    {
        public int StockId { get; set; }
        public string? StackName { get; set; }
        public decimal Quantity { get; set; }
        public string? UnitOfMeasure { get; set; } // e.g., "grams", "ml", "pieces"

    }
}
