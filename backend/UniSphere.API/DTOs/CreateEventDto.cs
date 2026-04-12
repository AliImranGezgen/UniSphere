using UniSphere.Core.Entities;
namespace UniSphere.API.DTOs
{
    public class CreateEventDto
    {
        public string Title {get; set;} = string.Empty;
        public int Capacity {get; set;}
        public string Description {get; set;} = string.Empty;
        public string Location{get; set;} =string.Empty;
        public int ClubId{get;set;}
        public DateTime EventDate{get; set;} = DateTime.UtcNow;
    }
}