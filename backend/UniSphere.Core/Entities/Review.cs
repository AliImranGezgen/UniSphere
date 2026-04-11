namespace UniSphere.Core
{
    public class Review //evente yapılan yorumları tutan entity
    {
        public int Id { get; set; } //yapılan yorumun IDsini tutar
        public int UserId { get; set; } //yorum yapan userin IDisini tutar
        public int EventId { get; set; } //yorum yapılan eventin IDsini tutar
        public int Rating { get; set; } //Evente verilen puanı belirler
        public string Comment { get; set; } = string.Empty; //evente yapılan yorumu tutar.
        public DateTime CreatedAt { get; set; } //yorum yapılan saati tutar.
    }
}