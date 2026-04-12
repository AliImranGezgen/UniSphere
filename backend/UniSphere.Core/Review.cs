namespace UniSphere.Core
{
    public class Review
    {
        public int Id { get; set; }

        // Yorumu yazan kullanıcı
        public int UserId { get; set; }

        // Hangi etkinlik için yorum bırakıldı
        public int EventId { get; set; }

        // Yorum puanı
        public int Rating { get; set; }

        // Yorum metni
        public string Comment { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}