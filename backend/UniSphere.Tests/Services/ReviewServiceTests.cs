using FluentAssertions;
using Moq;
using System;
using System.Threading.Tasks;
using UniSphere.API.Services;
using UniSphere.Core.Entities;
using UniSphere.Core.Interfaces;
using Xunit;

namespace UniSphere.Tests.Services
{
    public class ReviewServiceTests
    {
        private readonly Mock<IReviewRepository> _mockReviewRepo;
        private readonly Mock<IApplicationRepository> _mockAppRepo;
        private readonly ReviewService _service;

        public ReviewServiceTests()
        {
            _mockReviewRepo = new Mock<IReviewRepository>();
            _mockAppRepo = new Mock<IApplicationRepository>();

            _service = new ReviewService(_mockReviewRepo.Object, _mockAppRepo.Object);
        }

        [Fact]
        public async Task AddReviewAsync_ShouldThrowException_WhenUserHasNotCheckedIn()
        {
            // Arrange
            var userId = 1;
            var eventId = 10;
            var rating = 5;
            var comment = "Great event!";

            _mockAppRepo.Setup(r => r.HasCheckedInApplicationAsync(userId, eventId))
                .ReturnsAsync(false); // User did not check in

            // Act
            Func<Task> act = async () => await _service.AddReviewAsync(userId, eventId, rating, comment);

            // Assert
            await act.Should().ThrowAsync<Exception>()
                .WithMessage("Check-in yapmadan yorum bırakamazsınız.");
        }

        [Fact]
        public async Task AddReviewAsync_ShouldAddReview_WhenUserHasCheckedIn()
        {
            // Arrange
            var userId = 1;
            var eventId = 10;
            var rating = 5;
            var comment = "Great event!";

            _mockAppRepo.Setup(r => r.HasCheckedInApplicationAsync(userId, eventId))
                .ReturnsAsync(true); // User did check in

            _mockReviewRepo.Setup(r => r.AddAsync(It.IsAny<Review>())).Returns(Task.CompletedTask);

            // Act
            await _service.AddReviewAsync(userId, eventId, rating, comment);

            // Assert
            _mockReviewRepo.Verify(r => r.AddAsync(It.Is<Review>(rev => 
                rev.UserId == userId && 
                rev.EventId == eventId && 
                rev.Rating == rating && 
                rev.Comment == comment)), Times.Once);
        }
    }
}
