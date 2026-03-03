using Microsoft.EntityFrameworkCore;
using UniSphere.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

// Veritabanı bağlantısını sisteme kaydediyoruz
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString));

var app = builder.Build();

app.MapGet("/", () => "UniSphere API Çalışıyor!");

app.Run();