using gkb_service.Models;
using snapdough_api.Data;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace gkb_service.Controllers.Admin
{
    public interface IWishlist
    {
        public Task<Wishlist> AddWishlist(Wishlist wishlist);
        public Task<List<Wishlist>> GetWishlist();
        public Task<Wishlist> EditWishlist(Wishlist wishlist, CancellationToken cancellationToken);
        public Task<bool> DeleteWishlist(int wishlistId, CancellationToken cancellationToken);
    }

    public class WishlistService : IWishlist
    {
        private readonly AppDbContext _db;
        public WishlistService(AppDbContext db)
        {
            _db = db;
        }

        public async Task<Wishlist> AddWishlist(Wishlist wishlist)
        {
            try
            {
                await _db.Wishlists.AddAsync(wishlist);
                await _db.SaveChangesAsync();
                return wishlist;
            }
            catch (System.Exception ex)
            {
                System.Console.WriteLine(ex);
                return null;
            }
        }

        public async Task<List<Wishlist>> GetWishlist()
        {
            return await _db.Wishlists.ToListAsync();
        }

        public async Task<Wishlist> EditWishlist(Wishlist wishlist, CancellationToken cancellationToken)
        {
            var existing = await _db.Wishlists.FirstOrDefaultAsync(w => w.WishlistId == wishlist.WishlistId, cancellationToken);
            if (existing == null)
            {
                return null;
            }
            existing.UserId = wishlist.UserId;
            existing.WishlistDetails = wishlist.WishlistDetails;
            existing.UpdatedBy = wishlist.UpdatedBy;
            existing.UpdatedOn = System.DateTime.UtcNow;
            existing.Active = wishlist.Active;
            
            _db.Update(existing);
            await _db.SaveChangesAsync();
            return existing;
        }

        public async Task<bool> DeleteWishlist(int wishlistId, CancellationToken cancellationToken)
        {
            var existing = await _db.Wishlists.FirstOrDefaultAsync(w => w.WishlistId == wishlistId, cancellationToken);
            if (existing == null)
            {
                return false;
            }
            _db.Wishlists.Remove(existing);
            await _db.SaveChangesAsync();
            return true;
        }
    }
}
