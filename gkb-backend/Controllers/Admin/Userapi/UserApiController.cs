using gkb_service.Models;
using Microsoft.AspNetCore.Mvc;
using snapdough_api.Data;
using System.Threading;
using System.Threading.Tasks;

namespace gkb_service.Controllers.Admin
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserApiController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly IUserMaster _userService;

        public UserApiController(AppDbContext db, IUserMaster userService)
        {
            _db = db;
            _userService = userService;
        }

        [HttpPost]
        [Route("EditUser")]
        public async Task<IActionResult> EditUser([FromBody] UserMaster user)
        {
            var res = await _userService.EditUserMaster(user, CancellationToken.None);
            if (res == null)
            {
                return BadRequest(new { message = "Failed to edit user." });
            }
            return Ok(res);
        }

        [HttpGet]
        [Route("GetUser")]
        public async Task<IActionResult> GetUser()
        {
            var users = await _userService.GetUserMaster();
            
            // Decrypt password column for "own use" display if needed, or send as is
            foreach(var u in users)
            {
                if (!string.IsNullOrEmpty(u.Password))
                {
                    u.Password = Helpers.PasswordHasher.DecryptPasswordByUserId(u.Password, u.UserId);
                }
            }

            return Ok(new
            {
                stocklst = users
            });
        }
    }
}
