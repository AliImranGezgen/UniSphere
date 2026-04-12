using UniSphere.API.DTOs;
using UniSphere.Core;
using UniSphere.Core.Interfaces;

namespace UniSphere.API.Services
{
    public class ReviewService
    {
        private readonly IReviewRepository _reviewRepository;
        private readonly IApplicationRepository _applicationRepository;

        public ReviewService(IReviewRepository reviewRepository, IApplicationRepository applicationRepository)
        {
            _reviewRepository = reviewRepository;
            _applicationRepository = applicationRepository;
        }

        public async Task<Review> SubmitReviewAsync(int eventId, int userId, CreateReviewDto dto)
        {
            // Sadece checked-in olan kullanıcı yorum bırakabilsin
            var checkedIn = await _applicationRepository.HasCheckedInApplicationAsync(userId, eventId);
            if (!checkedIn)
                throw new Exception("Checked-in olmayan kullanıcı review bırakamaz.");

            var review = new Review
            {
                UserId = userId,
                EventId = eventId,
                Rating = dto.Rating,
                Comment = dto.Comment,
                CreatedAt = DateTime.UtcNow
            };

            return await _reviewRepository.AddAsync(review);
        }
    }
}