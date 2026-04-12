using FluentAssertions;
using Moq;
using System;
using System.Threading.Tasks;
using UniSphere.API.Services;
using UniSphere.Core;
using UniSphere.Core.Entities;
using UniSphere.Core.Interfaces;
using Xunit;

namespace UniSphere.Tests.Services
{
    public class ApplicationServiceTests
    {
        private readonly Mock<IApplicationRepository> _mockAppRepo;
        private readonly Mock<IEventRepository> _mockEventRepo;
        private readonly ApplicationService _service;

        public ApplicationServiceTests()
        {
            _mockAppRepo = new Mock<IApplicationRepository>();
            _mockEventRepo = new Mock<IEventRepository>();

            _service = new ApplicationService(_mockAppRepo.Object, _mockEventRepo.Object);
        }

        [Fact]
        public async Task ApplyToEventAsync_ShouldThrowException_WhenApplicationAlreadyExists()
        {
            // Arrange
            var userId = 1;
            var eventId = 10;
            
            _mockAppRepo.Setup(r => r.ExistsByUserAndEventAsync(userId, eventId))
                .ReturnsAsync(true);

            // Act
            Func<Task> act = async () => await _service.ApplyToEventAsync(userId, eventId);

            // Assert
            await act.Should().ThrowAsync<Exception>()
                .WithMessage("Aynı etkinliğe tekrar başvuramazsınız.");
        }

        [Fact]
        public async Task ApplyToEventAsync_ShouldReturnWaitlisted_WhenCapacityIsExceeded()
        {
            // Arrange
            var userId = 1;
            var eventId = 10;
            
            _mockAppRepo.Setup(r => r.ExistsByUserAndEventAsync(userId, eventId)).ReturnsAsync(false);
            
            _mockEventRepo.Setup(r => r.GetByEventIdAsync(eventId))
                .ReturnsAsync(new Event { Id = eventId, Capacity = 50 }); // Capacity is 50
                
            _mockAppRepo.Setup(r => r.GetApprovedCountAsync(eventId))
                .ReturnsAsync(50); // Currently 50 approved (Capacity reached)

            // Setup AddAsync to just return since it's a void or task
            _mockAppRepo.Setup(r => r.AddAsync(It.IsAny<Application>())).Returns(Task.CompletedTask);

            // Act
            var result = await _service.ApplyToEventAsync(userId, eventId);

            // Assert
            result.Should().Be(ApplicationStatus.Waitlisted.ToString());
        }

        [Fact]
        public async Task ApplyToEventAsync_ShouldReturnApproved_WhenUnderCapacity()
        {
            // Arrange
            var userId = 1;
            var eventId = 10;

            _mockAppRepo.Setup(r => r.ExistsByUserAndEventAsync(userId, eventId)).ReturnsAsync(false);
            
            _mockEventRepo.Setup(r => r.GetByEventIdAsync(eventId))
                .ReturnsAsync(new Event { Id = eventId, Capacity = 50 }); // Capacity is 50
                
            _mockAppRepo.Setup(r => r.GetApprovedCountAsync(eventId))
                .ReturnsAsync(49); // Currently 49 approved (Has 1 spot left)

            _mockAppRepo.Setup(r => r.AddAsync(It.IsAny<Application>())).Returns(Task.CompletedTask);

            // Act
            var result = await _service.ApplyToEventAsync(userId, eventId);

            // Assert
            result.Should().Be(ApplicationStatus.Approved.ToString());
        }
    }
}
