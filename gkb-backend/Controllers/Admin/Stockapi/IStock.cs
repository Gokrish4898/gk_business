using gkb_service.Models;
using snapdough_api.Data;
using Microsoft.EntityFrameworkCore;

namespace gkb_service.Controllers.Admin
{
    public interface IStock
    {
        public Task<Models.Stock> AddStock(Models.Stock stock);
        public Task<List<Models.Stock>> GetStock();
        public Task<Models.Stock> EditStock(Models.Stock stock, CancellationToken cancellationToken);
    }

    public class StockService : IStock
    {
        private readonly AppDbContext _db;
        public StockService(AppDbContext db)
        {
            _db = db;
        }
        public async Task<Models.Stock> AddStock(Models.Stock stock)
        {
            await _db.Stocks.AddAsync(stock);
            await _db.SaveChangesAsync();
            return stock;
        }

        public async Task<Models.Stock> EditStock(Models.Stock stock, CancellationToken cancellationToken)
        {
            var availableStock = await _db.Stocks.FirstOrDefaultAsync(s => s.StockId == stock.StockId, cancellationToken);
            if (availableStock == null)
            {
                return null;
            }
            availableStock.StockName = stock.StockName;
            availableStock.UnitPrice = stock.UnitPrice;
            availableStock.Unit = stock.Unit;
            availableStock.Availability = stock.Availability;
            availableStock.ImageLink = stock.ImageLink;
            availableStock.UpdatedBy = stock.UpdatedBy;
            availableStock.UpdatedOn = DateTime.UtcNow;
            _db.Update(availableStock);
            await _db.SaveChangesAsync();
            return availableStock;
        }

        public async Task<List<Stock>> GetStock()
        {
            var stocks = await _db.Stocks.ToListAsync();
            return stocks;
        }
    }
}
