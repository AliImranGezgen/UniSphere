using UniSphere.Core.Entities;
using UniSphere.Infrastructure.Data;

namespace UniSphere.API.Data;

public static class DevelopmentDataSeeder
{
    public static void Seed(AppDbContext db)
    {
        if (db.Users.Any(u => u.Email == "student@unisphere.test"))
        {
            return;
        }

        var now = DateTime.UtcNow;
        const string password = "Test123!";

        var student = new User { Name = "Ayse Demir", Email = "student@unisphere.test", PasswordHash = BCrypt.Net.BCrypt.HashPassword(password), Role = UserRoles.Student, CreatedAt = now.AddDays(-80) };
        var secondStudent = new User { Name = "Mehmet Kaya", Email = "student2@unisphere.test", PasswordHash = BCrypt.Net.BCrypt.HashPassword(password), Role = UserRoles.Student, CreatedAt = now.AddDays(-70) };
        var clubAdmin = new User { Name = "Ece Yilmaz", Email = "clubadmin@unisphere.test", PasswordHash = BCrypt.Net.BCrypt.HashPassword(password), Role = UserRoles.ClubAdmin, CreatedAt = now.AddDays(-90) };
        var systemAdmin = new User { Name = "Admin User", Email = "admin@unisphere.test", PasswordHash = BCrypt.Net.BCrypt.HashPassword(password), Role = UserRoles.SystemAdmin, CreatedAt = now.AddDays(-100) };

        db.Users.AddRange(student, secondStudent, clubAdmin, systemAdmin);
        db.SaveChanges();

        var techClub = new Club
        {
            ManagerId = clubAdmin.Id,
            Name = "Teknoloji ve Inovasyon Kulubu",
            Description = "Yazilim, yapay zeka ve urun gelistirme odakli kampus toplulugu.",
            ShortDescription = "Yazilim ve AI etkinlikleri.",
            AboutText = "Atolyeler, zirveler ve uygulamali teknik bulusmalar duzenler.",
            FoundedYear = 2020,
            ContactEmail = "tech@unisphere.test",
            Website = "https://tech.unisphere.test",
            CreatedAt = now.AddDays(-60)
        };

        var careerClub = new Club
        {
            ManagerId = clubAdmin.Id,
            Name = "Kariyer Kulubu",
            Description = "Ogrencileri sektor profesyonelleriyle bulusturan kulup.",
            ShortDescription = "Kariyer ve mulakat etkinlikleri.",
            AboutText = "CV, mulakat, networking ve sirket bulusmalari organize eder.",
            FoundedYear = 2018,
            ContactEmail = "career@unisphere.test",
            Website = "https://career.unisphere.test",
            CreatedAt = now.AddDays(-55)
        };

        db.Clubs.AddRange(techClub, careerClub);
        db.SaveChanges();

        db.ClubRoleAssignments.AddRange(
            new ClubRoleAssignment { ClubId = techClub.Id, UserId = clubAdmin.Id, Role = ClubRoles.President, AssignedAt = now.AddDays(-50) },
            new ClubRoleAssignment { ClubId = careerClub.Id, UserId = clubAdmin.Id, Role = ClubRoles.EventManager, AssignedAt = now.AddDays(-45) });

        db.ClubMemberships.AddRange(
            new ClubMembership { ClubId = techClub.Id, UserId = student.Id, Status = "Active", CreatedAt = now.AddDays(-35) },
            new ClubMembership { ClubId = careerClub.Id, UserId = secondStudent.Id, Status = "Active", CreatedAt = now.AddDays(-30) });

        var aiSummit = new Event { Name = "AI ve Gelecek Zirvesi", Description = "Yapay zeka trendleri, urun gelistirme ve kampus projeleri uzerine interaktif zirve.", Date = "2026-06-10", Time = "14:00", MaxParticipants = 120, ClubId = techClub.Id, Category = "tech" };
        var workshop = new Event { Name = "Uygulamali React Atolyesi", Description = "React ve TypeScript ile kampus uygulamasi gelistirme atolyesi.", Date = "2026-06-18", Time = "13:30", MaxParticipants = 40, ClubId = techClub.Id, Category = "tech" };
        var careerDay = new Event { Name = "Kariyer ve Mulakat Gunu", Description = "CV hazirlama, teknik mulakat ve sektor bulusmalari.", Date = "2026-06-22", Time = "10:00", MaxParticipants = 80, ClubId = careerClub.Id, Category = "career" };
        var pastTech = new Event { Name = "Python ile Veri Analizi", Description = "Veri analizi temelleri ve mini proje calismasi.", Date = "2026-04-10", Time = "15:00", MaxParticipants = 50, ClubId = techClub.Id, Category = "tech" };
        var pastCareer = new Event { Name = "LinkedIn Profil Atolyesi", Description = "Profesyonel profil hazirlama ve networking ipuclari.", Date = "2026-04-18", Time = "11:00", MaxParticipants = 60, ClubId = careerClub.Id, Category = "career" };

        db.Events.AddRange(aiSummit, workshop, careerDay, pastTech, pastCareer);
        db.SaveChanges();

        db.Applications.AddRange(
            new Application { UserId = student.Id, EventId = pastTech.Id, Status = ApplicationStatus.CheckedIn, CreatedAt = now.AddDays(-50), CheckedInAt = new DateTime(2026, 4, 10, 15, 5, 0, DateTimeKind.Utc) },
            new Application { UserId = student.Id, EventId = pastCareer.Id, Status = ApplicationStatus.CheckedIn, CreatedAt = now.AddDays(-45), CheckedInAt = new DateTime(2026, 4, 18, 11, 7, 0, DateTimeKind.Utc) },
            new Application { UserId = secondStudent.Id, EventId = pastTech.Id, Status = ApplicationStatus.Approved, CreatedAt = now.AddDays(-42) },
            new Application { UserId = secondStudent.Id, EventId = aiSummit.Id, Status = ApplicationStatus.Approved, CreatedAt = now.AddDays(-3) },
            new Application { UserId = student.Id, EventId = careerDay.Id, Status = ApplicationStatus.Cancelled, CreatedAt = now.AddDays(-12), CancelledAt = now.AddDays(-10) });

        db.Reviews.AddRange(
            new Review { UserId = student.Id, EventId = pastTech.Id, Rating = 5, Comment = "Atolye cok verimliydi, ornekler uygulanabilirdi.", CreatedAt = new DateTime(2026, 4, 11, 9, 0, 0, DateTimeKind.Utc) },
            new Review { UserId = student.Id, EventId = pastCareer.Id, Rating = 4, Comment = "CV bolumu ozellikle faydaliydi.", CreatedAt = new DateTime(2026, 4, 19, 12, 0, 0, DateTimeKind.Utc) });

        db.Notifications.AddRange(
            new Notification { UserId = student.Id, Message = "AI ve Gelecek Zirvesi icin sana uygun oneriler hazir.", Type = "Recommendation", IsRead = false, CreatedAt = now.AddDays(-1) },
            new Notification { UserId = clubAdmin.Id, Message = "No-show risk ekrani test verileriyle kullanima hazir.", Type = "System", IsRead = false, CreatedAt = now.AddHours(-8) });

        db.SaveChanges();
    }
}
