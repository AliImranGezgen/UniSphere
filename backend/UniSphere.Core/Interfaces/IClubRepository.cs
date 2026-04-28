using UniSphere.Core.Entities;
using System.Threading.Tasks;

namespace UniSphere.Core.Interfaces
{
    public interface IClubRepository
    {
        Task<IEnumerable<Club>> GetAllClubAsync();
        Task DeleteClubAsync(int Id);
        Task<Club?> GetByIdAsync(int Id);
        Task<Club> AddAsync(Club club);
        Task<Club> UpdateAsync(Club club);

    }
}
