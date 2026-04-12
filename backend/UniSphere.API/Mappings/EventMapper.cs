using UniSphere.API.DTOs;
using UniSphere.Core.Entities; // Event entity'sinin olduğu yer

namespace UniSphere.API.Mappings
{
    public static class EventMapping
    {
        // 1. Entity'den DTO'ya Çeviri (Veritabanından Frontend'e giderken)
        public static EventResponseDto ToDto(this Event eventModel)
        {
            return new EventResponseDto
            {
                EventId = eventModel.Id,
                Title = eventModel.Title,
                Capacity = eventModel.Capacity,
                Description = eventModel.Description,
                EventDate = eventModel.EventDate,
                Location = eventModel.Location,
                ClubId = eventModel.ClubId
            };
        }

        // 2. DTO'dan Entity'ye Çeviri (Frontend'den Veritabanına gelirken)
        public static Event ToEntity(this CreateEventDto createDto)
        {
            return new Event
            {
                Title = createDto.Title,
                Capacity = createDto.Capacity,
                Description = createDto.Description,
                EventDate = createDto.EventDate,
                Location = createDto.Location,
                ClubId = createDto.ClubId
            };
        }
    }
}