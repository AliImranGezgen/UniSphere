using UniSphere.API.DTOs;
using UniSphere.API.Mappings;
using UniSphere.Core.Interfaces;

namespace UniSphere.API.Services
{
    public class EventService
    {
        private readonly IEventRepository _repository;
        private readonly IApplicationRepository _applicationRepository;
        private readonly IClubRepository _clubRepository;

        public EventService(
            IEventRepository repository,
            IApplicationRepository applicationRepository,
            IClubRepository clubRepository)
        {
            _repository = repository;
            _applicationRepository = applicationRepository;
            _clubRepository = clubRepository;
        }

        public async Task<IEnumerable<EventResponseDto>> GetAllEventsAsync()
        {
            var entities = await _repository.GetAllEventsAsync();
            return entities.Select(x => x.ToDto());
        }

        public async Task<EventResponseDto?> GetByIdAsync(int id)
        {
            var entity = await _repository.GetByEventIdAsync(id);
            if (entity == null)
                return null;

            return entity.ToDto();
        }

        private async Task CheckIfManagerOwnsClubAsync(int clubId, int userId)
        {
            var club = await _clubRepository.GetByIdAsync(clubId);

            if (club == null)
                throw new Exception("Kulüp bulunamadı.");

            if (club.ManagerId != userId)
                throw new Exception("Sadece ilgili kulübün yöneticisi bu etkinliği yönetebilir.");
        }

        public async Task<EventResponseDto> CreateEventAsync(CreateEventDto dto, int userId)
        {
            if (dto.Capacity < 0)
                throw new Exception("Capacity negatif olamaz.");

            var parsedDate = EventMapping.ParseEventDate(dto.EventDate);
            if (parsedDate < DateTime.UtcNow)
                throw new Exception("Geçmiş tarihli etkinlik oluşturulamaz.");

            await CheckIfManagerOwnsClubAsync(dto.ClubId, userId);

            var eventEntity = dto.ToEntity();
            var createdEvent = await _repository.AddEventAsync(eventEntity);

            return createdEvent.ToDto();
        }

        public async Task<EventResponseDto?> UpdateEventAsync(int id, EventUpdateDto dto, int userId)
        {
            if (id != dto.EventId)
                throw new Exception("URL'deki ID ile DTO içindeki ID uyuşmuyor.");

            if (dto.Capacity < 0)
                throw new Exception("Capacity negatif olamaz.");

            var parsedDate = EventMapping.ParseEventDate(dto.EventDate);
            if (parsedDate < DateTime.UtcNow)
                throw new Exception("Geçmiş tarihli etkinlik güncellenemez.");

            await CheckIfManagerOwnsClubAsync(dto.ClubId, userId);

            var existingEvent = await _repository.GetByEventIdAsync(id);
            if (existingEvent == null)
                return null;

            existingEvent.Name = dto.Title; // 3. Faz: Name olarak güncellendi
            existingEvent.Description = dto.Description;
            existingEvent.Date = parsedDate.ToString("yyyy-MM-dd"); // 3. Faz: Date string
            existingEvent.Time = parsedDate.ToString("HH:mm"); // 3. Faz: Time string
            existingEvent.MaxParticipants = dto.Capacity; // 3. Faz: MaxParticipants olarak
            existingEvent.ClubId = dto.ClubId;
            existingEvent.Category = dto.Category ?? string.Empty; // 3. Faz: Category eklendi

            await _repository.UpdateEventAsync(existingEvent);

            return existingEvent.ToDto();
        }

        public async Task<bool> DeleteEventAsync(int id, int userId)
        {
            var existingEvent = await _repository.GetByEventIdAsync(id);
            if (existingEvent == null)
                return false;

            await CheckIfManagerOwnsClubAsync(existingEvent.ClubId, userId);

            var hasCheckedInUsers = await _applicationRepository.HasCheckedInUsersAsync(id);
            if (hasCheckedInUsers)
                throw new Exception("Checked-in alınmış bir etkinlik silinemez.");

            await _repository.DeleteAsync(id);
            return true;
        }
    }
}