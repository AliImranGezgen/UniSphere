namespace UniSphere.Core
{
    public class User
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty; // Kullanıcı adı buraya gelecek
        public string Email { get; set; } = string.Empty;
        
        // YENİ EKLEDİĞİMİZ SATIR: Şifreleri hashli şekilde burada saklayacağız
        public string Password { get; set; } = string.Empty; 
    }
}