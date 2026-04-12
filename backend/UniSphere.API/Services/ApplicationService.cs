using UniSphere.Core;
using UniSphere.Core.Interfaces;

namespace UniSphere.API.Services
{
    public class ApplicationService
    {
        private readonly IApplicationRepository _applicationRepository;
        private readonly IEventRepository _eventRepository;

        public ApplicationService(IApplicationRepository applicationRepository, IEventRepository eventRepository)
        {
            _applicationRepository = applicationRepository;
            _eventRepository = eventRepository;
        }

        public async Task<Application> ApplyToEventAsync(int eventId, int userId)
        {
            // Etkinlik gerçekten var mı kontrol et
            var eventEntity = await _eventRepository.GetByEventIdAsync(eventId);
            if (eventEntity == null)
                throw new Exception("Etkinlik bulunamadı.");

            // Aynı kullanıcı aynı etkinliğe tekrar başvuramasın
            var alreadyApplied = await _applicationRepository.ExistsByUserAndEventAsync(userId, eventId);
            if (alreadyApplied)
                throw new Exception("Bu kullanıcı bu etkinliğe zaten başvurmuş.");

            // Onaylı kişi sayısını al
            var approvedCount = await _applicationRepository.GetApprovedCountByEventAsync(eventId);

            // Kontenjana göre durum belirle
            var status = approvedCount < eventEntity.Capacity
                ? ApplicationStatus.Approved
                : ApplicationStatus.Waitlisted;

            // Yeni başvuruyu oluştur
            var application = new Application
            {
                UserId = userId,
                EventId = eventId,
                Status = status,
                CheckedIn = false,
                CreatedAt = DateTime.UtcNow
            };

            return await _applicationRepository.AddAsync(application);
        }

        public async Task CancelApplicationAsync(int eventId, int userId)
        {
            var application = await _applicationRepository.GetByUserAndEventAsync(userId, eventId);

            if (application == null)
                throw new Exception("İptal edilecek başvuru bulunamadı.");

            application.Status = ApplicationStatus.Cancelled;
            await _applicationRepository.UpdateAsync(application);
        }
    }
}