using UniSphere.Core;
namespace UniSphere.Core.Interfaces
{
    public interface IReviewRepository
    {
        Task AddAsync(Review review);
    }
}