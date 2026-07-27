using gkb_service.Models;
using Microsoft.AspNetCore.Mvc;
using System.Threading;
using System.Threading.Tasks;

namespace gkb_service.Controllers.Admin
{
    [Route("api/[controller]")]
    [ApiController]
    public class RatingApiController : ControllerBase
    {
        private readonly IRating _ratingService;
        public RatingApiController(IRating ratingService)
        {
            _ratingService = ratingService;
        }

        [HttpGet]
        [Route("GetRating")]
        public async Task<IActionResult> GetRating()
        {
            var list = await _ratingService.GetRating();
            return Ok(new { stocklst = list }); // Matches frontend response naming expectation
        }

        [HttpPost]
        [Route("AddRating")]
        public async Task<IActionResult> AddRating([FromBody] Rating rating)
        {
            var res = await _ratingService.AddRating(rating);
            if (res == null)
            {
                return BadRequest(new { message = "Failed to add rating." });
            }
            return Ok(res);
        }

        [HttpPost]
        [Route("EditRating")]
        public async Task<IActionResult> EditRating([FromBody] Rating rating)
        {
            var res = await _ratingService.EditRating(rating, CancellationToken.None);
            if (res == null)
            {
                return BadRequest(new { message = "Failed to edit rating." });
            }
            return Ok(res);
        }

        [HttpDelete]
        [Route("DeleteRating/{id}")]
        public async Task<IActionResult> DeleteRating(int id)
        {
            var success = await _ratingService.DeleteRating(id, CancellationToken.None);
            if (!success)
            {
                return BadRequest(new { message = "Failed to delete rating or not found." });
            }
            return Ok(new { message = "Rating deleted successfully." });
        }
    }
}
