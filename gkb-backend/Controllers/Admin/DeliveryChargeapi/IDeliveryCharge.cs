using gkb_service.Models;
using snapdough_api.Data;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace gkb_service.Controllers.Admin
{
    public interface IDeliveryCharge
    {
        public Task<DeliveryCharge> AddDeliveryCharge(DeliveryCharge charge);
        public Task<List<DeliveryCharge>> GetDeliveryCharge();
        public Task<DeliveryCharge> EditDeliveryCharge(DeliveryCharge charge, CancellationToken cancellationToken);
    }

    public class DeliveryChargeService : IDeliveryCharge
    {
        private readonly AppDbContext _db;
        public DeliveryChargeService(AppDbContext db)
        {
            _db = db;
        }

        public async Task<DeliveryCharge> AddDeliveryCharge(DeliveryCharge charge)
        {
            charge.CreatedOn = System.DateTime.UtcNow;
            charge.Active = 1;
            await _db.DeliveryCharges.AddAsync(charge);
            await _db.SaveChangesAsync();
            return charge;
        }

        public async Task<DeliveryCharge> EditDeliveryCharge(DeliveryCharge charge, CancellationToken cancellationToken)
        {
            var existing = await _db.DeliveryCharges.FirstOrDefaultAsync(d => d.DeliveryId == charge.DeliveryId, cancellationToken);
            if (existing == null)
            {
                return null;
            }
            existing.City = charge.City;
            existing.Active = charge.Active;
            existing.UpdatedBy = charge.UpdatedBy;
            existing.UpdatedOn = System.DateTime.UtcNow;
            _db.Update(existing);
            await _db.SaveChangesAsync();
            return existing;
        }

        public async Task<List<DeliveryCharge>> GetDeliveryCharge()
        {
            return await _db.DeliveryCharges.ToListAsync();
        }
    }
}
