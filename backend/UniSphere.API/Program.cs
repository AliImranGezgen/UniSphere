using Microsoft.EntityFrameworkCore;
using UniSphere.Infrastructure.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using UniSphere.API.Services;
using System.Text;
using UniSphere.Core.Interfaces;
using UniSphere.Infrastructure.Repositories;

var builder = WebApplication.CreateBuilder(args);

// API endpoint'leri için Controller desteğini ekliyoruz (Gelen HTTP isteklerini karşılamak için)
builder.Services.AddControllers();


// CORS Ayarları: Frontend (React) projemizden gelen isteklere izin veriyoruz.
// Tarayıcı güvenliği (Same-Origin Policy) gereği, farklı kökenlerden gelen istekler varsayılan olarak engellenir.
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173") // Vite (Frontend) projesinin varsayılan adresi
              .AllowAnyHeader()  // Tüm HTTP başlıklarına (Authentication vb.) izin ver
              .AllowAnyMethod();  // Tüm HTTP metodlarına (GET, POST, PUT, DELETE) izin ver
    });
});


// Swagger - API dokümantasyonu ve test arayüzü eklemek için
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// appsettings.json içerisinden JWT konfigürasyonlarını alıyoruz
var jwtSettings = builder.Configuration.GetSection("Jwt");
var jwtKey = jwtSettings["Key"];

// Güvenlik: Eğer gizli anahtar belirtilmemişse uygulamanın çalışmasını engelliyoruz
if (string.IsNullOrWhiteSpace(jwtKey))
{
    throw new InvalidOperationException("JWT Key is missing. Check environment variables or configuration.");
}

// Secret Key'i (Gizli Anahtar) byte dizisine dönüştürüyoruz (JWT doğrulamasında kullanılacak)
var key = Encoding.UTF8.GetBytes(jwtKey);

// Sistemdeki Kimlik Doğrulama (Authentication) mekanizmasını ayarlıyoruz
builder.Services.AddAuthentication(options =>
{
    // Varsayılan doğrulama ve yetkilendirme şeması olarak JWT belirledik
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false; // Geliştirme ortamında HTTP kullanılabilmesi için false (Canlıda true olmalı)
    options.SaveToken = true;

    // Gelen token'ın geçerliliğini kontrol edecek parametreler
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true, // Token'ı kimin dağıttığını doğrula
        ValidateAudience = true, // Token'ın kimler için oluşturulduğunu doğrula
        ValidateLifetime = true, // Süresi geçmiş token'ları reddet
        ValidateIssuerSigningKey = true, // Token'ın imzasını doğrula (anahtar ile)
        ValidIssuer = jwtSettings["Issuer"], // appsettings'deki değeri kontrol et
        ValidAudience = jwtSettings["Audience"], // appsettings'deki değeri kontrol et
        IssuerSigningKey = new SymmetricSecurityKey(key) // Doğrulama için kullanılacak secret key
    };
});

// Rol tabanlı yetkilendirme (Authorization) için servislere ekliyoruz
builder.Services.AddAuthorization();

// Veritabanı bağlantı dizesini appsettings.json'dan okuyoruz
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

if (string.IsNullOrWhiteSpace(connectionString))
{
    throw new InvalidOperationException("Database connection string is missing. Check environment variables or configuration.");
}

// Entity Framework Core için PostgreSQL (Npgsql) veritabanı bağlantı ayarını yapıyoruz
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString));

var app = builder.Build();


app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "UniSphere API V1");
    c.RoutePrefix = "swagger"; // Tarayıcıda /swagger yazarak api dokümantasyonuna ulaşabilmek için
});

// CORS politikasını etkinleştiriyoruz (Authentication'dan önce gelmelidir)
app.UseCors("AllowFrontend");

// Kimlik doğrulama işlemini ara katmana (Middleware) ekliyoruz (Kimsiniz?)
app.UseAuthentication();

// Yetki kontrol işlemlerini ara katmana ekliyoruz (Bu işlemi yapmaya izniniz var mı?)
app.UseAuthorization();

// Controller sınıflarındaki Route'ları haritalıyoruz
app.MapControllers();

// Sağlık kontrolü ve test için Minimal API endpointleri
app.MapGet("/", () => "UniSphere API Çalışıyor!"); // Herkese açık endpoint
app.MapGet("/secure", () => "Bu endpoint JWT ile korunuyor!")
   .RequireAuthorization(); // Yalnızca giriş yapmış (yetkilendirilmiş) kullanıcılar erişebilir

app.Run("http://0.0.0.0:8080");