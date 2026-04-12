using UniSphere.Core;

namespace UniSphere.Core.Interfaces
{
    public interface IReviewRepository
    {
        Task<Review> AddAsync(Review review);
    }
}