using gkb_service.Models;
using Microsoft.AspNetCore.Mvc;
using System.Threading;
using System.Threading.Tasks;

namespace gkb_service.Controllers.Admin
{
    [Route("api/[controller]")]
    [ApiController]
    public class WishlistApiController : ControllerBase
    {
        private readonly IWishlist _wishlistService;
        public WishlistApiController(IWishlist wishlistService)
        {
            _wishlistService = wishlistService;
        }

        [HttpGet]
        [Route("GetWishlist")]
        public async Task<IActionResult> GetWishlist()
        {
            var list = await _wishlistService.GetWishlist();
            return Ok(new { stocklst = list }); // Matches frontend response naming expectation
        }

        [HttpPost]
        [Route("AddWishlist")]
        public async Task<IActionResult> AddWishlist([FromBody] Wishlist wishlist)
        {
            var res = await _wishlistService.AddWishlist(wishlist);
            if (res == null)
            {
                return BadRequest(new { message = "Failed to add wishlist." });
            }
            return Ok(res);
        }

        [HttpPost]
        [Route("EditWishlist")]
        public async Task<IActionResult> EditWishlist([FromBody] Wishlist wishlist)
        {
            var res = await _wishlistService.EditWishlist(wishlist, CancellationToken.None);
            if (res == null)
            {
                return BadRequest(new { message = "Failed to edit wishlist." });
            }
            return Ok(res);
        }

        [HttpDelete]
        [Route("DeleteWishlist/{id}")]
        public async Task<IActionResult> DeleteWishlist(int id)
        {
            var success = await _wishlistService.DeleteWishlist(id, CancellationToken.None);
            if (!success)
            {
                return BadRequest(new { message = "Failed to delete wishlist or not found." });
            }
            return Ok(new { message = "Wishlist deleted successfully." });
        }
    }
}
