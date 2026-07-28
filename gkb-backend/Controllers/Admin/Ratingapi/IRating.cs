using gkb_service.Models;
using snapdough_api.Data;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace gkb_service.Controllers.Admin
{
    public interface IRating
    {
        public Task<Rating> AddRating(Rating rating);
        public Task<List<Rating>> GetRating();
        public Task<Rating> EditRating(Rating rating, CancellationToken cancellationToken);
        public Task<bool> DeleteRating(int ratingId, CancellationToken cancellationToken);
    }

    public class RatingService : IRating
    {
        private readonly AppDbContext _db;
        public RatingService(AppDbContext db)
        {
            _db = db;   
        }

        public async Task<Rating> AddRating(Rating rating)
        {
            try
            {
                await _db.Ratings.AddAsync(rating);
                await _db.SaveChangesAsync();
                return rating;
            }
            catch (System.Exception ex)
            {
                System.Console.WriteLine(ex);
                return null;
            }
        }

        public async Task<List<Rating>> GetRating()
        {
            return await _db.Ratings.ToListAsync();
        }

        public async Task<Rating> EditRating(Rating rating, CancellationToken cancellationToken)
        {
            var existing = await _db.Ratings.FirstOrDefaultAsync(r => r.RatingId == rating.RatingId, cancellationToken);
            if (existing == null)
            {
                return null;
            }
            existing.ProductId = rating.ProductId;
            existing.RatingDetails = rating.RatingDetails;
            existing.UpdatedBy = rating.UpdatedBy;
            existing.UpdatedOn = System.DateTime.UtcNow;
            existing.Active = rating.Active;

            _db.Update(existing);
            await _db.SaveChangesAsync();
            return existing;
        }

        public async Task<bool> DeleteRating(int ratingId, CancellationToken cancellationToken)
        {
            var existing = await _db.Ratings.FirstOrDefaultAsync(r => r.RatingId == ratingId, cancellationToken);
            if (existing == null)
            {
                return false;
            }
            _db.Ratings.Remove(existing);
            await _db.SaveChangesAsync();
            return true;
        }
    }
}
