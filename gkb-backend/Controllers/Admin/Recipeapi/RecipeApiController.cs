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
    public class RecipeApiController : ControllerBase
    {
        AppDbContext db;
        IRecipe recipeservice;
        public RecipeApiController(AppDbContext _db, IRecipe _recipeservice)
        {
            db = _db;
            recipeservice = _recipeservice;
        }

        // GET: api/<StockApiController>

        [HttpPost]
        [Route("AddRecipe")]
        public async Task<IActionResult> AddRecipe([FromBody] Models.Recipe recipe)
        {
            var res = await recipeservice.AddRecipe(recipe);
            if (res == null)
            {
                return BadRequest(new { message = "Failed to add recipe. Check server logs." });
            }
            return Ok(res);
        }
        
        [HttpPost]
        [Route("EditRecipe")]
        public async Task<IActionResult> EditRecipe([FromBody] Models.Recipe recipe)
        {
            var res = await recipeservice.EditRecipe(recipe, CancellationToken.None);
            if (res == null)
            {
                return BadRequest(new { message = "Failed to edit recipe. Check server logs." });
            }
            return Ok(res);
        }

        [HttpGet]
        [Route("GetRecipe")]
        public async Task<IActionResult> GetRecipe()
        {
            var stocks = await recipeservice.GetRecipe();
            // Implement logic to create a new stock
            return Ok(new
            {
                stocklst = stocks
            });
        }
    }
}
