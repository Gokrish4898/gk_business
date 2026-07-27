using gkb_service.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using snapdough_api.Data;
using System.Linq;

namespace gkb_service.Controllers.Admin
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductApiController : ControllerBase
    {
        AppDbContext db;
        IProduct productservice;
        public ProductApiController(AppDbContext _db, IProduct _productservice)
        {
            db = _db;
            productservice = _productservice;
        }

        [HttpPost]
        [Route("AddProduct")]
        public async Task<IActionResult> AddProduct([FromBody] Models.Product product)
        {
            var res = await productservice.AddProduct(product);
            if (res == null)
            {
                return BadRequest(new { message = "Failed to add product. Check server logs." });
            }
            return Ok(res);
        }

        [HttpPost]
        [Route("EditProduct")]
        public async Task<IActionResult> EditProduct([FromBody] Models.Product product)
        {
            var res = await productservice.EditProduct(product, CancellationToken.None);
            if (res == null)
            {
                return BadRequest(new { message = "Failed to edit product. Check server logs." });
            }
            return Ok(res);
        }

        [HttpGet]
        [Route("GetProduct")]
        public async Task<IActionResult> GetProduct()
        {
            var products = await productservice.GetProduct();
            return Ok(new
            {
                stocklst = products
            });
        }
    }
}
