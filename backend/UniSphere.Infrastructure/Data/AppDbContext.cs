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

    // Users tablosunu temsil eder
    public DbSet<User> Users { get; set; }
    public DbSet<Event> Events {get; set;}
    public DbSet<Club> Clubs {get; set;}
}