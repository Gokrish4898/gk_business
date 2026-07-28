using gkb_service.Models;
using Microsoft.AspNetCore.Mvc;
using snapdough_api.Data;
using System.Threading;
using System.Threading.Tasks;

namespace gkb_service.Controllers.Admin
{
    [Route("api/[controller]")]
    [ApiController]
    public class DeliveryChargeApiController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly IDeliveryCharge _deliveryService;

        public DeliveryChargeApiController(AppDbContext db, IDeliveryCharge deliveryService)
        {
            _db = db;
            _deliveryService = deliveryService;
        }

        [HttpPost]
        [Route("AddDeliveryCharge")]
        public async Task<IActionResult> AddDeliveryCharge([FromBody] DeliveryCharge charge)
        {
            var res = await _deliveryService.AddDeliveryCharge(charge);
            if (res == null)
            {
                return BadRequest(new { message = "Failed to add delivery charge." });
            }
            return Ok(res);
        }

        [HttpPost]
        [Route("EditDeliveryCharge")]
        public async Task<IActionResult> EditDeliveryCharge([FromBody] DeliveryCharge charge)
        {
            var res = await _deliveryService.EditDeliveryCharge(charge, CancellationToken.None);
            if (res == null)
            {
                return BadRequest(new { message = "Failed to edit delivery charge." });
            }
            return Ok(res);
        }

        [HttpGet]
        [Route("GetDeliveryCharge")]
        public async Task<IActionResult> GetDeliveryCharge()
        {
            var charges = await _deliveryService.GetDeliveryCharge();
            return Ok(new
            {
                stocklst = charges
            });
        }
    }
}
