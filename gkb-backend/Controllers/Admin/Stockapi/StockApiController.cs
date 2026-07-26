using gkb_service.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using snapdough_api.Data;
using System.Linq;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace gkb_service.Controllers.Admin
{
    [Route("api/[controller]")]
    [ApiController]
    public class StockApiController : ControllerBase
    {
        AppDbContext db;
        IStock stockService;
        public StockApiController(AppDbContext _db, IStock _stockService)
        {
            db = _db;
            stockService = _stockService;
        }

        // GET: api/<StockApiController>

        [HttpPost]
        [Route("AddStock")]
        public async Task<IActionResult> AddStock([FromBody] Models.Stock stock)
        {
            var res = await stockService.AddStock(stock);
            return Ok();
        }
        
        [HttpPost]
        [Route("EditStock")]
        public async Task<IActionResult> EditStock([FromBody] Models.Stock stock)
        {
            var res = await stockService.EditStock(stock, CancellationToken.None);
            // Implement logic to create a new stock
            return Ok();
        }

        [HttpGet]
        [Route("GetStock")]
        public async Task<IActionResult> GetStock()
        {
            try
            {
                var stocks = await stockService.GetStock();
                // Implement logic to create a new stock
                return Ok(new
                {
                    stocklst = stocks
                });
            }catch(Exception ex)
            {
                return BadRequest(new
                {
                    error = ex.Message.ToString(),
                    stacktrace = ex.StackTrace
                });
            }
        }
    }
}
