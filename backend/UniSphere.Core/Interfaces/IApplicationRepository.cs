using UniSphere.Core;

namespace UniSphere.Core.Interfaces
{
    public interface IApplicationRepository
    {
        Task<bool> ExistsByUserAndEventAsync(int userId, int eventId);
        Task<int> GetApprovedCountAsync(int eventId);
        Task AddAsync(Application application);
        Task<bool> HasCheckedInApplicationAsync(int userId, int eventId);
        Task<bool> HasCheckedInUsersAsync(int eventId);
    }
}