namespace UniSphere.Core.Entities
{
    public enum ApplicationStatus //Eventlere başvuru yapan kişilerin durumlarını enum olarak tutar.
    {
        Pending, //Başvuru yapıldı ama karar verilmedi.
        Approved, //Başvuru yapıldı ve üye listesine eklendi.
        Waitlisted, //Başvuru yapıldı ve bekleme listesine alındı.
        Cancelled, //Başvuru yapıldı ama iptal edildi.
        CheckedIn //Başvuru yapıldı checkinde yapıldı.
    }

    public class Application
    {
        public int Id { get; set; } //Başvuru ID'sini tutar.

        public int UserId { get; set; } //Başvuru yapan üyenin ID'sini tutar.
        public int EventId { get; set; } //Başvuru yapılan eventin ID'sini tutar.

        public ApplicationStatus Status { get; set; } //Başvurunun durumunu belirler.

        public DateTime CreatedAt { get; set; } //Başvurunun oluşturdulduğu saati belirler
        public DateTime? CancelledAt { get; set; } //Başvuru iptal edildiyse iptal edildiği saati belirler.
        public DateTime? CheckedInAt { get; set; } //Checkinin yapıldığı saati belirler

        public User User { get; set; } = null!; //Başvuru yapan üyenin bilgilerini tutar
        public Event Event { get; set; } = null!; //Başvuru yapılan eventin bilgisini tutar.
    }
}