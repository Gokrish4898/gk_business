using gkb_service.Models;
using snapdough_api.Data;
using Microsoft.EntityFrameworkCore;

namespace gkb_service.Controllers.Admin
{
    public interface IProduct
    {
        public Task<Models.Product> AddProduct(Models.Product product);
        public Task<Models.Product> EditProduct(Models.Product product,CancellationToken cancellationToken);
    }

    public class ProductService : IProduct
    {
        private readonly AppDbContext _db;
        public ProductService(AppDbContext db)
        {
            _db = db;
        }
        public async Task<Models.Product> AddProduct(Models.Product product)
        {
            await _db.Products.AddAsync(product);
            await _db.SaveChangesAsync();
            return product;
        }

        public async Task<Models.Product> EditProduct(Models.Product product,CancellationToken cancellationToken)
        {
            var availableProduct = await _db.Products.FirstOrDefaultAsync(p => p.ProductId == product.ProductId,cancellationToken);
            if (availableProduct == null)
            {
                return null;
            }
            availableProduct.Name = product.Name;
            availableProduct.Delivery = product.Delivery;
            availableProduct.Prices = product.Prices;
            availableProduct.Recipes = product.Recipes;
            availableProduct.UpdatedBy = product.UpdatedBy;
            availableProduct.UpdatedOn = DateTime.UtcNow;
            _db.Update(availableProduct);
            await _db.SaveChangesAsync();
            return availableProduct;
        }
    }
}
