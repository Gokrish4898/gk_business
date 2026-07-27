using gkb_service.Models;
using snapdough_api.Data;
using Microsoft.EntityFrameworkCore;

namespace gkb_service.Controllers.Admin
{
    public interface IProduct
    {
        public Task<Models.Product> AddProduct(Models.Product product);
        public Task<List<Models.Product>> GetProduct();
        public Task<Models.Product> EditProduct(Models.Product product, CancellationToken cancellationToken);
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
            try
            {
                await _db.Products.AddAsync(product);
                await _db.SaveChangesAsync();
                return product;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return null;
            }
        }

        public async Task<Models.Product> EditProduct(Models.Product product, CancellationToken cancellationToken)
        {
            var availableproduct = await _db.Products.FirstOrDefaultAsync(s => s.ProductId == product.ProductId, cancellationToken);
            if (availableproduct == null)
            {
                return null;
            }
            availableproduct.Name = product.Name;
            availableproduct.Delivery = product.Delivery;
            availableproduct.Price = product.Price;
            availableproduct.InStock = product.InStock;
            availableproduct.ImageLink = product.ImageLink;
            availableproduct.ReceipeId = product.ReceipeId;
            availableproduct.UpdatedBy = product.UpdatedBy;
            availableproduct.UpdatedOn = DateTime.UtcNow;
            _db.Update(availableproduct);
            await _db.SaveChangesAsync();
            return availableproduct;
        }

        public async Task<List<Models.Product>> GetProduct()
        {
            var products = await _db.Products.ToListAsync();
            return products;
        }
    }
}
