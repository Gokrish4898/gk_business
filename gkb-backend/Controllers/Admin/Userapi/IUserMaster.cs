using gkb_service.Models;
using snapdough_api.Data;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace gkb_service.Controllers.Admin
{
    public interface IUserMaster
    {
        public Task<List<UserMaster>> GetUserMaster();
        public Task<UserMaster> EditUserMaster(UserMaster user, CancellationToken cancellationToken);
    }

    public class UserMasterService : IUserMaster
    {
        private readonly AppDbContext _db;
        public UserMasterService(AppDbContext db)
        {
            _db = db;
        }

        public async Task<List<UserMaster>> GetUserMaster()
        {
            return await _db.UserMasters.ToListAsync();
        }

        public async Task<UserMaster> EditUserMaster(UserMaster user, CancellationToken cancellationToken)
        {
            var existing = await _db.UserMasters.FirstOrDefaultAsync(u => u.UserId == user.UserId, cancellationToken);
            if (existing == null)
            {
                return null;
            }
            existing.Username = user.Username;
            existing.Email = user.Email;
            existing.HouseNo = user.HouseNo;
            existing.AddressLine1 = user.AddressLine1;
            existing.AddressLine2 = user.AddressLine2;
            existing.Area = user.Area;
            existing.State = user.State;
            existing.Mobile = user.Mobile;
            existing.RoleId = user.RoleId;
            existing.Active = user.Active;
            existing.UpdatedBy = user.UpdatedBy;
            existing.UpdatedOn = System.DateTime.UtcNow;

            // If a new plain text password is provided, rehash and encrypt it
            if (!string.IsNullOrEmpty(user.Password) && user.Password != existing.Password && user.Password != "DecryptionFailed")
            {
                string salt = Helpers.PasswordHasher.GenerateSalt();
                string hash = Helpers.PasswordHasher.HashPassword(user.Password, salt);
                existing.SaltValue = salt;
                existing.HashValue = hash;
                existing.Password = Helpers.PasswordHasher.EncryptPasswordByUserId(user.Password, existing.UserId);
            }

            _db.Update(existing);
            await _db.SaveChangesAsync(cancellationToken);
            return existing;
        }
    }
}
