namespace UniSphere.Core
{
    public class Application
    {
        public int Id { get; set; }

        // Kim başvurdu
        public int UserId { get; set; }

        // Hangi etkinliğe başvurdu
        public int EventId { get; set; }

        // Başvuru durumu
        public string Status { get; set; } = "Pending";
        // Approved / Waitlisted / Cancelled

        // Etkinliğe katıldı mı
        public bool CheckedIn { get; set; } = false;

        // Başvurunun oluşturulma zamanı
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Başvuruyu yapan kullanıcıya erişim
        public User? User { get; set; }

        // Başvurunun ait olduğu etkinliğe erişim
        public Event? Event { get; set; }
    }
}