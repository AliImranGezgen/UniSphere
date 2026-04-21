namespace UniSphere.Core.Entities;

// Kulüp içindeki yetki rollerini merkezi olarak tutan statik sınıf
public static class ClubRoles
{
    // Kulübün tam yetkili yöneticisi
    public const string President = "President";
    
    // Başkan yardımcısı - etkinlik vb. işlemleri yönetebilir ancak başkan atayamaz
    public const string VicePresident = "VicePresident";
    
    // Sadece etkinlikleri yönetebilen yetkili
    public const string EventManager = "EventManager";
    
    // Normal kulüp üyesi
    public const string Member = "Member";
}
