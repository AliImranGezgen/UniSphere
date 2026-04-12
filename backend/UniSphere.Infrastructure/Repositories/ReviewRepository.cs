using UniSphere.Core;
using UniSphere.Core.Entities;
using UniSphere.Core.Interfaces;
using UniSphere.Infrastructure.Data;

namespace UniSphere.Infrastructure.Repositories
{
    public class ReviewRepository : IReviewRepository
    {
        private readonly AppDbContext _context;

        public ReviewRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(Review review)
        {
            _context.Reviews.Add(review);
            await _context.SaveChangesAsync();
        }
    }
}