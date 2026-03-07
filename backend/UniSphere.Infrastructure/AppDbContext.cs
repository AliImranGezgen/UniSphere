using Microsoft.EntityFrameworkCore;
using UniSphere.Core; // Bu satırı eklediğinden emin ol!

namespace UniSphere.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users { get; set; } 
    public DbSet<Event> Events { get; set; }
}