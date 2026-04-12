using Microsoft.VisualBasic;
//Sisteme kaydolan kulüplerin entityleri
namespace UniSphere.Core
{
    public class Club
    {
        public int ManagerId { get; set; } // Bu kulübün yöneticisi olan kullanıcının Id'si
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public ICollection<Event> Events { get; set; } = new List<Event>();
    }
}