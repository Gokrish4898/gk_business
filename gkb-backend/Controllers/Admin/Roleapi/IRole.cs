using gkb_service.Models;
using snapdough_api.Data;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace gkb_service.Controllers.Admin
{
    public interface IRole
    {
        public Task<Role> AddRole(Role role);
        public Task<List<Role>> GetRole();
        public Task<Role> EditRole(Role role, CancellationToken cancellationToken);
    }

    public class RoleService : IRole
    {
        private readonly AppDbContext _db;
        public RoleService(AppDbContext db)
        {
            _db = db;
        }

        public async Task<Role> AddRole(Role role)
        {
            role.CreatedOn = System.DateTime.UtcNow;
            role.Active = 1;
            await _db.Roles.AddAsync(role);
            await _db.SaveChangesAsync();
            return role;
        }

        public async Task<Role> EditRole(Role role, CancellationToken cancellationToken)
        {
            var existing = await _db.Roles.FirstOrDefaultAsync(r => r.RoleId == role.RoleId, cancellationToken);
            if (existing == null)
            {
                return null;
            }
            existing.RoleName = role.RoleName;
            existing.Active = role.Active;
            existing.UpdatedBy = role.UpdatedBy;
            existing.UpdatedOn = System.DateTime.UtcNow;
            _db.Update(existing);
            await _db.SaveChangesAsync();
            return existing;
        }

        public async Task<List<Role>> GetRole()
        {
            return await _db.Roles.ToListAsync();
        }
    }
}
