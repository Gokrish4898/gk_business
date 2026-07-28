using gkb_service.Models;
using Microsoft.AspNetCore.Mvc;
using snapdough_api.Data;
using System.Threading;
using System.Threading.Tasks;

namespace gkb_service.Controllers.Admin
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdditionalChargeApiController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly IAdditionalCharge _chargeService;

        public AdditionalChargeApiController(AppDbContext db, IAdditionalCharge chargeService)
        {
            _db = db;
            _chargeService = chargeService;
        }

        [HttpPost]
        [Route("AddCharge")]
        public async Task<IActionResult> AddCharge([FromBody] AdditionalCharge charge)
        {
            var res = await _chargeService.AddAdditionalCharge(charge);
            if (res == null)
            {
                return BadRequest(new { message = "Failed to add additional charge." });
            }
            return Ok(res);
        }

        [HttpPost]
        [Route("EditCharge")]
        public async Task<IActionResult> EditCharge([FromBody] AdditionalCharge charge)
        {
            var res = await _chargeService.EditAdditionalCharge(charge, CancellationToken.None);
            if (res == null)
            {
                return BadRequest(new { message = "Failed to edit additional charge." });
            }
            return Ok(res);
        }

        [HttpGet]
        [Route("GetCharge")]
        public async Task<IActionResult> GetCharge()
        {
            var charges = await _chargeService.GetAdditionalCharge();
            return Ok(new
            {
                stocklst = charges
            });
        }
    }
}
