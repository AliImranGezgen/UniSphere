using Microsoft.EntityFrameworkCore;
using UniSphere.Core;
using UniSphere.Core.Entities;

namespace UniSphere.Infrastructure.Data;

// Uygulama ile veritabanı arasındaki EF Core bağlantısını yöneten DbContext
public class AppDbContext : DbContext
{
    // Constructor
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    // Veritabanı tablolarını temsil eden DbSet'ler
    public DbSet<User> Users { get; set; }
    public DbSet<Event> Events { get; set; }
    public DbSet<Club> Clubs { get; set; }
    public DbSet<Application> Applications { get; set; }
    public DbSet<Review> Reviews { get; set; }
    public DbSet<Notification> Notifications { get; set; } // Kullanıcı bildirimlerini tutan tablo
    public DbSet<ClubRoleAssignment> ClubRoleAssignments { get; set; } // Kulüp rol atamalarını tutan tablo

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Application (Başvuru) Tablosu Yapılandırması
        modelBuilder.Entity<Application>(entity =>
        {
            // Unique Constraint: Bir kullanıcı bir etkinliğe sadece bir kez başvurabilir
            entity.HasIndex(a => new { a.UserId, a.EventId }).IsUnique();

            // Status (Durum) alanını veritabanında okunabilirlik için string olarak saklar (Enum mapping)
            entity.Property(a => a.Status)
                .HasConversion<string>();

            // İlişkiler
            entity.HasOne(a => a.User)
                .WithMany(u => u.Applications)
                .HasForeignKey(a => a.UserId);

            entity.HasOne(a => a.Event)
                .WithMany(e => e.Applications)
                .HasForeignKey(a => a.EventId);

            // Performans için Index tanımları
            entity.HasIndex(a => a.UserId);
            entity.HasIndex(a => a.EventId);
            entity.HasIndex(a => a.Status);
        });

        // Review (Yorum/Puan) Tablosu Yapılandırması
        modelBuilder.Entity<Review>(entity =>
        {
            // Unique Constraint: Bir kullanıcı bir etkinliğe sadece bir yorum bırakabilir
            entity.HasIndex(r => new { r.UserId, r.EventId }).IsUnique();

            // Comment (Yorum) alanı için karakter sınırı ve zorunluluk kontrolleri
            entity.Property(r => r.Comment)
                .HasMaxLength(1000);

            entity.Property(r => r.Rating)
                .IsRequired();

            // İlişkiler
            entity.HasOne(r => r.User)
                .WithMany(u => u.Reviews)
                .HasForeignKey(r => r.UserId);

            entity.HasOne(r => r.Event)
                .WithMany(e => e.Reviews)
                .HasForeignKey(r => r.EventId);

            // Performans için Index tanımları
            entity.HasIndex(r => r.UserId);
            entity.HasIndex(r => r.EventId);
        });

        // Notification (Bildirim) Tablosu Yapılandırması
        modelBuilder.Entity<Notification>(entity =>
        {
            // İlişki: Bir kullanıcının birden fazla bildirimi olabilir
            entity.HasOne(n => n.User)
                .WithMany(u => u.Notifications)
                .HasForeignKey(n => n.UserId);

            // Veritabanında UserId bazlı arama (kullanıcının bildirimlerini listeleme) yapılacağı için Index ekliyoruz.
            entity.HasIndex(n => n.UserId);
        });

        // ClubRoleAssignment Tablosu Yapılandırması
        modelBuilder.Entity<ClubRoleAssignment>(entity =>
        {
            // Unique Constraint: Bir kullanıcının bir kulüpte aynı anda sadece bir rolü (kaydı) olabilir
            entity.HasIndex(cra => new { cra.ClubId, cra.UserId }).IsUnique();

            // İlişkiler
            entity.HasOne(cra => cra.Club)
                .WithMany(c => c.RoleAssignments)
                .HasForeignKey(cra => cra.ClubId);

            entity.HasOne(cra => cra.User)
                .WithMany(u => u.ClubRoles)
                .HasForeignKey(cra => cra.UserId);
                
            // Hızlı sorgulama için Rol kolonuna indeks
            entity.HasIndex(cra => cra.Role);
        });
    }
}