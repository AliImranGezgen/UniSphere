using UniSphere.Core.Entities;
namespace UniSphere.Core.Interfaces
{
    public interface IReviewRepository
    {
        Task AddAsync(Review review);
    }
}