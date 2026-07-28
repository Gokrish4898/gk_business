using gkb_service.Models;
using snapdough_api.Data;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace gkb_service.Controllers.Admin
{
    public interface IAdditionalCharge
    {
        public Task<AdditionalCharge> AddAdditionalCharge(AdditionalCharge charge);
        public Task<List<AdditionalCharge>> GetAdditionalCharge();
        public Task<AdditionalCharge> EditAdditionalCharge(AdditionalCharge charge, CancellationToken cancellationToken);
    }

    public class AdditionalChargeService : IAdditionalCharge
    {
        private readonly AppDbContext _db;
        public AdditionalChargeService(AppDbContext db)
        {
            _db = db;
        }

        public async Task<AdditionalCharge> AddAdditionalCharge(AdditionalCharge charge)
        {
            charge.CreatedOn = System.DateTime.UtcNow;
            charge.Active = 1;
            await _db.AdditionalCharges.AddAsync(charge);
            await _db.SaveChangesAsync();
            return charge;
        }

        public async Task<AdditionalCharge> EditAdditionalCharge(AdditionalCharge charge, CancellationToken cancellationToken)
        {
            var existing = await _db.AdditionalCharges.FirstOrDefaultAsync(c => c.ChargeId == charge.ChargeId, cancellationToken);
            if (existing == null)
            {
                return null;
            }
            existing.ChargeName = charge.ChargeName;
            existing.Amount = charge.Amount;
            existing.Active = charge.Active;
            existing.UpdatedBy = charge.UpdatedBy;
            existing.UpdatedOn = System.DateTime.UtcNow;
            _db.Update(existing);
            await _db.SaveChangesAsync();
            return existing;
        }

        public async Task<List<AdditionalCharge>> GetAdditionalCharge()
        {
            return await _db.AdditionalCharges.ToListAsync();
        }
    }
}
