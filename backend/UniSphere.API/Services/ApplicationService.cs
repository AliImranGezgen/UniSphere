using UniSphere.Core;
using UniSphere.Core.Entities;
using UniSphere.Core.Interfaces;

namespace UniSphere.API.Services
{
    public class ApplicationService
    {
        private readonly IApplicationRepository _repository;
        private readonly IEventRepository _eventRepository;

        public ApplicationService(IApplicationRepository repository, IEventRepository eventRepository)
        {
            _repository = repository;
            _eventRepository = eventRepository;
        }

        public async Task<string> ApplyToEventAsync(int userId, int eventId)
        {
            var alreadyExists = await _repository.ExistsByUserAndEventAsync(userId, eventId);
            if (alreadyExists)
                throw new Exception("Aynı etkinliğe tekrar başvuramazsınız.");

            var eventEntity = await _eventRepository.GetByEventIdAsync(eventId);
            if (eventEntity == null)
                throw new Exception("Etkinlik bulunamadı.");

            var application = new Application
            {
                UserId = userId,
                EventId = eventId
            };

            var approvedCount = await _repository.GetApprovedCountAsync(eventId);

            if (approvedCount < eventEntity.MaxParticipants) // 3. Faz: MaxParticipants olarak güncellendi
                application.Status = ApplicationStatus.Approved;
            else
                application.Status = ApplicationStatus.Waitlisted;

            await _repository.AddAsync(application);

            return application.Status.ToString();
        }
    }
}