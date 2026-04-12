using UniSphere.Core.Entities;
using UniSphere.Core.Interfaces;

namespace UniSphere.API.Services
{
    public class ReviewService
    {
        private readonly IReviewRepository _repository;
        private readonly IApplicationRepository _applicationRepository;

        public ReviewService(IReviewRepository repository, IApplicationRepository applicationRepository)
        {
            _repository = repository;
            _applicationRepository = applicationRepository;
        }

        public async Task AddReviewAsync(int userId, int eventId, int rating, string comment)
        {
            // Check-in olmadan yorum yapılamaz
            var hasCheckedIn = await _applicationRepository.HasCheckedInApplicationAsync(userId, eventId);

            if (!hasCheckedIn)
                throw new Exception("Check-in yapmadan yorum bırakamazsınız.");

            var review = new Review
            {
                UserId = userId,
                EventId = eventId,
                Rating = rating,
                Comment = comment
            };

            await _repository.AddAsync(review);
        }
    }
}