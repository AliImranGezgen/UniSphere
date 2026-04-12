using Microsoft.EntityFrameworkCore;
using UniSphere.Core;

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
<<<<<<< HEAD

    // Başvurular (Applications)
    public DbSet<Application> Applications { get; set; }

    // Kullanıcı yorumları
    public DbSet<Review> Reviews { get; set; }
=======
    public DbSet<Application> Applications { get; set; }
    public DbSet<Review> Reviews { get; set; }

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
    }
>>>>>>> ff6e3969a89ad8756b4b2a40dc9db6db5d426629
}