using Microsoft.EntityFrameworkCore;
using UniSphere.Infrastructure.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using UniSphere.API.Services;
using UniSphere.API.Middlewares; // ExceptionMiddleware için eklendi
using System.Text;
using UniSphere.Core.Interfaces;
using UniSphere.Core.AI.Interfaces;
using UniSphere.Infrastructure.Repositories;
using UniSphere.Infrastructure.Services;

var builder = WebApplication.CreateBuilder(args);

// API endpoint'leri için Controller desteğini ekliyoruz (Gelen HTTP isteklerini karşılamak için)
builder.Services.AddControllers();


// CORS Ayarları: Frontend (React) projemizden gelen isteklere izin veriyoruz.
// Tarayıcı güvenliği (Same-Origin Policy) gereği, farklı kökenlerden gelen istekler varsayılan olarak engellenir.
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.SetIsOriginAllowed(origin => new Uri(origin).Host == "localhost")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});


// Servisler için Dependency Injection (DI) kayıtları
// AddScoped: Her HTTP isteği için bir kez oluşturulur.
builder.Services.AddScoped<TokenService>(); // JWT üretimi vb. işlemler için eklendi
builder.Services.AddScoped<IClubRepository, ClubRepository>(); // Kulüp veritabanı işlemleri için
builder.Services.AddScoped<IEventRepository, EventRepository>(); // Etkinlik veritabanı işlemleri için
builder.Services.AddScoped<IApplicationRepository, ApplicationRepository>(); // Başvuru veritabanı işlemleri için
builder.Services.AddScoped<IReviewRepository, ReviewRepository>(); // Yorum/Puan veritabanı işlemleri için
builder.Services.AddScoped<IRecommendationService, RecommendationService>(); // Öneri sistemi için DI kaydı
builder.Services.AddScoped<INoShowPredictionService, NoShowPredictionService>(); // No-show tahmin servisi için DI kaydı

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
    options.UseNpgsql(connectionString, sqlOptions => 
    {
        // Geçici ağ hataları veya veritabanı başlatılma süreçlerinde bağlantıyı yeniden denemek için:
        sqlOptions.EnableRetryOnFailure(
            maxRetryCount: 5,
            maxRetryDelay: TimeSpan.FromSeconds(10),
            errorCodesToAdd: null);
    }));

var app = builder.Build();

// Yüklenen afiş dosyaları için uploads/ klasörünü oluştur
var uploadsPath = Path.Combine(app.Environment.WebRootPath
    ?? app.Environment.ContentRootPath, "uploads");
Directory.CreateDirectory(uploadsPath);

// CORS politikasını etkinleştiriyoruz — Her şeyden önce gelmeli
app.UseCors("AllowFrontend");

// Statik dosya servisi: yüklenen afişler /uploads/{filename} üzerinden erişilebilir
app.UseStaticFiles();

// ─── Otomatik Migration ─────────────────────────────────────────────────────
// Uygulama başlarken bekleyen tüm EF Core migration'larını otomatik uygular.
// Bu sayede 'dotnet ef database update' komutuna gerek kalmaz.
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
    var maxRetryCount = 5;
    var retryDelay = TimeSpan.FromSeconds(5);
    var retries = 0;
    
    while(retries < maxRetryCount)
    {
        try
        {
            logger.LogInformation("Veritabanı bekleyen migrationlar kontrol ediliyor... (Deneme {RetryCount}/{MaxRetryCount})", retries + 1, maxRetryCount);
            db.Database.Migrate();
            logger.LogInformation("Veritabanı migration'ları başarıyla uygulandı veya güncel durumda.");
            break;
        }
        catch (Exception ex)
        {
            retries++;
            logger.LogWarning(ex, "Veritabanına bağlanılamadı. {Delay} saniye sonra tekrar denenecek...", retryDelay.TotalSeconds);
            if (retries == maxRetryCount)
            {
                logger.LogError(ex, "Veritabanı bağlantısı kritik hata ile sonuçlandı. Maksimum deneme sayısına ulaşıldı. Lütfen veritabanı kimlik bilgilerini (.env veya appsettings.json) kontrol ediniz.");
                throw; 
            }
            Thread.Sleep(retryDelay);
        }
    }
}

// Global Exception Handler (Tüm hatalar Response dönmeden önce burada yakalanıp formatlanır)
app.UseMiddleware<ExceptionMiddleware>();


// Geliştirme asistanı Swagger'ı uygulamaya dahil ediyoruz

app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "UniSphere API V1");

    c.RoutePrefix = "swagger"; // Tarayıcıda /swagger yazarak api dokümantasyonuna ulaşabilmek için

});

// CORS politikası yukarıda (UseStaticFiles'tan önce) eklendi

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

app.Run();