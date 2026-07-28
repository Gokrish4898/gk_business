using gkb_service.Models;
using Microsoft.AspNetCore.Mvc;
using snapdough_api.Data;
using System.Threading;
using System.Threading.Tasks;

namespace gkb_service.Controllers.Admin
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoleApiController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly IRole _roleService;

        public RoleApiController(AppDbContext db, IRole roleService)
        {
            _db = db;
            _roleService = roleService;
        }

        [HttpPost]
        [Route("AddRole")]
        public async Task<IActionResult> AddRole([FromBody] Role role)
        {
            var res = await _roleService.AddRole(role);
            if (res == null)
            {
                return BadRequest(new { message = "Failed to add role." });
            }
            return Ok(res);
        }

        [HttpPost]
        [Route("EditRole")]
        public async Task<IActionResult> EditRole([FromBody] Role role)
        {
            var res = await _roleService.EditRole(role, CancellationToken.None);
            if (res == null)
            {
                return BadRequest(new { message = "Failed to edit role." });
            }
            return Ok(res);
        }

        [HttpGet]
        [Route("GetRole")]
        public async Task<IActionResult> GetRole()
        {
            var roles = await _roleService.GetRole();
            return Ok(new
            {
                stocklst = roles
            });
        }
    }
}
