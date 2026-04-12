using UniSphere.Core;

namespace UniSphere.Core.Interfaces
{
    public interface IApplicationRepository
    {
        Task<bool> ExistsByUserAndEventAsync(int userId, int eventId);
        Task<int> GetApprovedCountByEventAsync(int eventId);
        Task<Application> AddAsync(Application application);
        Task<Application?> GetByUserAndEventAsync(int userId, int eventId);
        Task UpdateAsync(Application application);
        Task<bool> HasCheckedInApplicationAsync(int userId, int eventId);
        Task<bool> HasCheckedInUsersAsync(int eventId);
    }
}