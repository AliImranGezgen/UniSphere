using FluentAssertions;
using Moq;
using System;
using System.Threading.Tasks;
using UniSphere.API.DTOs;
using UniSphere.API.Services;
using UniSphere.Core.Entities;
using UniSphere.Core.Interfaces;
using Xunit;

namespace UniSphere.Tests.Services
{
    public class EventServiceTests
    {
        private readonly Mock<IEventRepository> _mockEventRepo;
        private readonly Mock<IApplicationRepository> _mockAppRepo;
        private readonly Mock<IClubRepository> _mockClubRepo;
        private readonly EventService _service;

        public EventServiceTests()
        {
            _mockEventRepo = new Mock<IEventRepository>();
            _mockAppRepo = new Mock<IApplicationRepository>();
            _mockClubRepo = new Mock<IClubRepository>();

            _service = new EventService(
                _mockEventRepo.Object,
                _mockAppRepo.Object,
                _mockClubRepo.Object
            );
        }

        [Fact]
        public async Task CreateEventAsync_ShouldThrowException_WhenCapacityIsNegative()
        {
            // Arrange
            var dto = new CreateEventDto { Capacity = -1, EventDate = DateTime.UtcNow.AddDays(1).ToString("yyyy-MM-ddTHH:mm:ssZ") };

            // Act
            Func<Task> act = async () => await _service.CreateEventAsync(dto, 1);

            // Assert
            await act.Should().ThrowAsync<Exception>()
                .WithMessage("Capacity negatif olamaz.");
        }

        [Fact]
        public async Task UpdateEventAsync_ShouldThrowException_WhenCapacityIsNegative()
        {
            // Arrange
            var dto = new EventUpdateDto { EventId = 1, Capacity = -1, EventDate = DateTime.UtcNow.AddDays(1).ToString("yyyy-MM-ddTHH:mm:ssZ") };

            // Act
            Func<Task> act = async () => await _service.UpdateEventAsync(1, dto, 1);

            // Assert
            await act.Should().ThrowAsync<Exception>()
                .WithMessage("Capacity negatif olamaz.");
        }

        [Fact]
        public async Task UpdateEventAsync_ShouldThrowException_WhenUserIsNotClubManager()
        {
            // Arrange
            var dto = new EventUpdateDto { EventId = 1, ClubId = 10, Capacity = 50, EventDate = DateTime.UtcNow.AddDays(1).ToString("yyyy-MM-ddTHH:mm:ssZ") };
            
            _mockClubRepo.Setup(r => r.GetByIdAsync(10))
                .ReturnsAsync(new Club { Id = 10, ManagerId = 99 }); // Manager is 99

            // Act
            Func<Task> act = async () => await _service.UpdateEventAsync(1, dto, 1); // User is 1

            // Assert
            await act.Should().ThrowAsync<Exception>()
                .WithMessage("Sadece ilgili kulübün yöneticisi bu etkinliği yönetebilir.");
        }

        [Fact]
        public async Task DeleteEventAsync_ShouldThrowException_WhenUserIsNotClubManager()
        {
            // Arrange
            var eventId = 1;
            var clubId = 10;
            var existingEvent = new Event { Id = eventId, ClubId = clubId };

            _mockEventRepo.Setup(r => r.GetByEventIdAsync(eventId)).ReturnsAsync(existingEvent);
            _mockClubRepo.Setup(r => r.GetByIdAsync(clubId))
                .ReturnsAsync(new Club { Id = clubId, ManagerId = 99 }); // Manager is 99

            // Act
            Func<Task> act = async () => await _service.DeleteEventAsync(eventId, 1); // User is 1

            // Assert
            await act.Should().ThrowAsync<Exception>()
                .WithMessage("Sadece ilgili kulübün yöneticisi bu etkinliği yönetebilir.");
        }

        [Fact]
        public async Task DeleteEventAsync_ShouldThrowException_WhenEventHasCheckedInUsers()
        {
            // Arrange
            var eventId = 1;
            var clubId = 10;
            var userId = 5;
            var existingEvent = new Event { Id = eventId, ClubId = clubId };

            _mockEventRepo.Setup(r => r.GetByEventIdAsync(eventId)).ReturnsAsync(existingEvent);
            
            _mockClubRepo.Setup(r => r.GetByIdAsync(clubId))
                .ReturnsAsync(new Club { Id = clubId, ManagerId = userId }); // User IS manager

            _mockAppRepo.Setup(r => r.HasCheckedInUsersAsync(eventId)).ReturnsAsync(true); // Has checked-in users!

            // Act
            Func<Task> act = async () => await _service.DeleteEventAsync(eventId, userId);

            // Assert
            await act.Should().ThrowAsync<Exception>()
                .WithMessage("Checked-in alınmış bir etkinlik silinemez.");
        }
    }
}
