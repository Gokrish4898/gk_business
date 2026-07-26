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
    public class ProductApiController : ControllerBase
    {
        AppDbContext db;
        IProduct productService;
        public ProductApiController(AppDbContext _db, IProduct _productService)
        {
            db = _db;
            productService = _productService;
        }

        // GET: api/<ProductApiController>


        [HttpPost]
        [Route("AddProduct")]
        public async Task<IActionResult> AddProduct([FromBody] Models.Product product)
        {
            var res = await productService.AddProduct(product);
            return Ok();
        }
        
        [HttpPost]
        [Route("EditProduct")]
        public async Task<IActionResult> EditProduct([FromBody] Models.Product product)
        {
            var res = await productService.EditProduct(product, CancellationToken.None);
            // Implement logic to create a new product
            return Ok();
        }

        [HttpGet]
        [Route("GetProduct")]
        public async Task<IActionResult> GetProduct(CancellationToken cancellationToken)
        {
            var products = await db.Products.ToListAsync(cancellationToken);
            // Implement logic to create a new product
            return Ok(new
            {
                productlst = products
            });
        }
    }
}
