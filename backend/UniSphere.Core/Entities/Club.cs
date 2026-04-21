using Microsoft.VisualBasic;
//Sisteme kaydolan kulüplerin entityleri
namespace UniSphere.Core.Entities
{
    public class Club
    {
        public int Id { get; set; }
        public int ManagerId { get; set; } // Bu kulübün yöneticisi olan kullanıcının Id'si
        public string Name { get; set; } = string.Empty;
        public string Description{get; set;} = string.Empty;
        public DateTime CreatedAt{get; set;} = DateTime.UtcNow;
        public ICollection<Event> Events {get; set;}= new List<Event>();
        
        // Kulüp içi rol atamalarının listesi (Başkan, Üye, vb.)
        public ICollection<ClubRoleAssignment> RoleAssignments { get; set; } = new List<ClubRoleAssignment>();

        // 3. Faz: Kulüp üyelikleri
        public ICollection<ClubMembership> Memberships { get; set; } = new List<ClubMembership>();

        // 3. Faz: Topluluk vitrini için ek alanlar
        public string Logo { get; set; } = string.Empty; // Kulüp logosu URL'si
        public string ShortDescription { get; set; } = string.Empty; // Kısa açıklama (vitrin için)
        public string AboutText { get; set; } = string.Empty; // Detaylı hakkında metni
        public int? FoundedYear { get; set; } // Kuruluş yılı
        public string ContactEmail { get; set; } = string.Empty; // İletişim e-postası
        public string SocialLinks { get; set; } = string.Empty; // Sosyal medya linkleri (JSON veya comma separated)
        public string Website { get; set; } = string.Empty; // Kulüp web sitesi
    }
}