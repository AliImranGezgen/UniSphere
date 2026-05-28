using UniSphere.Core.Entities;
using UniSphere.Infrastructure.Data;

namespace UniSphere.API.Data;

public static class DevelopmentDataSeeder
{
    private const string TestPassword = "Test123!";

    public static void Seed(AppDbContext db)
    {
        var now = DateTime.UtcNow;
        var passwordHash = BCrypt.Net.BCrypt.HashPassword(TestPassword);

        var student = EnsureUser(db, "Ayse Demir", "student@unisphere.test", UserRoles.Student, passwordHash, now.AddDays(-80));
        var secondStudent = EnsureUser(db, "Mehmet Kaya", "student2@unisphere.test", UserRoles.Student, passwordHash, now.AddDays(-70));
        var clubAdmin = EnsureUser(db, "Ece Yilmaz", "clubadmin@unisphere.test", UserRoles.ClubAdmin, passwordHash, now.AddDays(-90));
        EnsureUser(db, "Admin User", "admin@unisphere.test", UserRoles.SystemAdmin, passwordHash, now.AddDays(-100));
        db.SaveChanges();

        var techClub = EnsureClub(
            db,
            clubAdmin.Id,
            "Teknoloji ve Inovasyon Kulubu",
            "Yazilim, yapay zeka ve urun gelistirme odakli kampus toplulugu.",
            "Yazilim ve AI etkinlikleri.",
            "Atolyeler, zirveler ve uygulamali teknik bulusmalar duzenler.",
            2020,
            "tech@unisphere.test",
            "https://tech.unisphere.test",
            now.AddDays(-60));
        var careerClub = EnsureClub(
            db,
            clubAdmin.Id,
            "Kariyer Kulubu",
            "Ogrencileri sektor profesyonelleriyle bulusturan kulup.",
            "Kariyer ve mulakat etkinlikleri.",
            "CV, mulakat, networking ve sirket bulusmalari organize eder.",
            2018,
            "career@unisphere.test",
            "https://career.unisphere.test",
            now.AddDays(-55));
        db.SaveChanges();

        EnsureClubRole(db, techClub.Id, clubAdmin.Id, ClubRoles.President, now.AddDays(-50));
        EnsureClubRole(db, careerClub.Id, clubAdmin.Id, ClubRoles.EventManager, now.AddDays(-45));
        EnsureMembership(db, techClub.Id, student.Id, now.AddDays(-35));
        EnsureMembership(db, careerClub.Id, secondStudent.Id, now.AddDays(-30));

        var aiSummit = EnsureEvent(db, techClub.Id, "AI ve Gelecek Zirvesi", "Yapay zeka trendleri, urun gelistirme ve kampus projeleri uzerine interaktif zirve.", "2026-06-10", "14:00", "Ana Konferans Salonu", 120, "tech");
        EnsureEvent(db, techClub.Id, "Uygulamali React Atolyesi", "React ve TypeScript ile kampus uygulamasi gelistirme atolyesi.", "2026-06-18", "13:30", "Bilgisayar Laboratuvari", 40, "tech");
        var careerDay = EnsureEvent(db, careerClub.Id, "Kariyer ve Mulakat Gunu", "CV hazirlama, teknik mulakat ve sektor bulusmalari.", "2026-06-22", "10:00", "Kultur Merkezi", 80, "career");
        var pastTech = EnsureEvent(db, techClub.Id, "Python ile Veri Analizi", "Veri analizi temelleri ve mini proje calismasi.", "2026-04-10", "15:00", "Seminer Salonu B", 50, "tech");
        var pastCareer = EnsureEvent(db, careerClub.Id, "LinkedIn Profil Atolyesi", "Profesyonel profil hazirlama ve networking ipuclari.", "2026-04-18", "11:00", "Kariyer Merkezi", 60, "career");
        db.SaveChanges();

        EnsureApplication(db, student.Id, pastTech.Id, ApplicationStatus.CheckedIn, now.AddDays(-50), checkedInAt: new DateTime(2026, 4, 10, 15, 5, 0, DateTimeKind.Utc));
        EnsureApplication(db, student.Id, pastCareer.Id, ApplicationStatus.CheckedIn, now.AddDays(-45), checkedInAt: new DateTime(2026, 4, 18, 11, 7, 0, DateTimeKind.Utc));
        EnsureApplication(db, secondStudent.Id, pastTech.Id, ApplicationStatus.Approved, now.AddDays(-42));
        EnsureApplication(db, secondStudent.Id, aiSummit.Id, ApplicationStatus.Approved, now.AddDays(-3));
        EnsureApplication(db, student.Id, careerDay.Id, ApplicationStatus.Cancelled, now.AddDays(-12), cancelledAt: now.AddDays(-10));

        EnsureReview(db, student.Id, pastTech.Id, 5, "Atolye cok verimliydi, ornekler uygulanabilirdi.", new DateTime(2026, 4, 11, 9, 0, 0, DateTimeKind.Utc));
        EnsureReview(db, student.Id, pastCareer.Id, 4, "CV bolumu ozellikle faydaliydi.", new DateTime(2026, 4, 19, 12, 0, 0, DateTimeKind.Utc));

        EnsureNotification(db, student.Id, "AI ve Gelecek Zirvesi icin sana uygun oneriler hazir.", "Recommendation", now.AddDays(-1));
        EnsureNotification(db, clubAdmin.Id, "No-show risk ekrani test verileriyle kullanima hazir.", "System", now.AddHours(-8));
        db.SaveChanges();
    }

    private static User EnsureUser(
        AppDbContext db,
        string name,
        string email,
        string role,
        string passwordHash,
        DateTime createdAt)
    {
        var user = db.Users.FirstOrDefault(item => item.Email == email);
        if (user is null)
        {
            user = new User { Name = name, Email = email, Role = role, PasswordHash = passwordHash, CreatedAt = createdAt };
            db.Users.Add(user);
            return user;
        }

        user.Name = name;
        user.Role = role;
        user.PasswordHash = passwordHash;
        return user;
    }

    private static Club EnsureClub(
        AppDbContext db,
        int managerId,
        string name,
        string description,
        string shortDescription,
        string aboutText,
        int foundedYear,
        string contactEmail,
        string website,
        DateTime createdAt)
    {
        var club = db.Clubs.FirstOrDefault(item => item.Name == name);
        if (club is not null)
        {
            return club;
        }

        club = new Club
        {
            ManagerId = managerId,
            Name = name,
            Description = description,
            ShortDescription = shortDescription,
            AboutText = aboutText,
            FoundedYear = foundedYear,
            ContactEmail = contactEmail,
            Website = website,
            CreatedAt = createdAt
        };
        db.Clubs.Add(club);
        return club;
    }

    private static Event EnsureEvent(
        AppDbContext db,
        int clubId,
        string name,
        string description,
        string date,
        string time,
        string location,
        int maxParticipants,
        string category)
    {
        var eventEntity = db.Events.FirstOrDefault(item => item.ClubId == clubId && item.Name == name);
        if (eventEntity is not null)
        {
            if (string.IsNullOrWhiteSpace(eventEntity.Location))
            {
                eventEntity.Location = location;
            }

            return eventEntity;
        }

        eventEntity = new Event
        {
            ClubId = clubId,
            Name = name,
            Description = description,
            Date = date,
            Time = time,
            Location = location,
            MaxParticipants = maxParticipants,
            Category = category
        };
        db.Events.Add(eventEntity);
        return eventEntity;
    }

    private static void EnsureClubRole(AppDbContext db, int clubId, int userId, string role, DateTime assignedAt)
    {
        if (db.ClubRoleAssignments.Any(item => item.ClubId == clubId && item.UserId == userId))
        {
            return;
        }

        db.ClubRoleAssignments.Add(new ClubRoleAssignment { ClubId = clubId, UserId = userId, Role = role, AssignedAt = assignedAt });
    }

    private static void EnsureMembership(AppDbContext db, int clubId, int userId, DateTime createdAt)
    {
        if (db.ClubMemberships.Any(item => item.ClubId == clubId && item.UserId == userId))
        {
            return;
        }

        db.ClubMemberships.Add(new ClubMembership { ClubId = clubId, UserId = userId, Status = "Active", CreatedAt = createdAt });
    }

    private static void EnsureApplication(
        AppDbContext db,
        int userId,
        int eventId,
        ApplicationStatus status,
        DateTime createdAt,
        DateTime? cancelledAt = null,
        DateTime? checkedInAt = null)
    {
        if (db.Applications.Any(item => item.UserId == userId && item.EventId == eventId))
        {
            return;
        }

        db.Applications.Add(new Application
        {
            UserId = userId,
            EventId = eventId,
            Status = status,
            CreatedAt = createdAt,
            CancelledAt = cancelledAt,
            CheckedInAt = checkedInAt
        });
    }

    private static void EnsureReview(AppDbContext db, int userId, int eventId, int rating, string comment, DateTime createdAt)
    {
        if (db.Reviews.Any(item => item.UserId == userId && item.EventId == eventId))
        {
            return;
        }

        db.Reviews.Add(new Review { UserId = userId, EventId = eventId, Rating = rating, Comment = comment, CreatedAt = createdAt });
    }

    private static void EnsureNotification(AppDbContext db, int userId, string message, string type, DateTime createdAt)
    {
        if (db.Notifications.Any(item => item.UserId == userId && item.Message == message))
        {
            return;
        }

        db.Notifications.Add(new Notification { UserId = userId, Message = message, Type = type, IsRead = false, CreatedAt = createdAt });
    }
}
