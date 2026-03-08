using Microsoft.EntityFrameworkCore;
using UniSphere.Infrastructure.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using UniSphere.API.Services;
using System.Text;


var builder = WebApplication.CreateBuilder(args);

// Controller servislerini ekler
builder.Services.AddControllers();
builder.Services.AddScoped<TokenService>();

// Swagger/OpenAPI desteğini etkinleştirir.
// API endpointlerinin otomatik dokümantasyonunu üretir ve Swagger UI üzerinden test edilebilmesini sağlar.
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


// JWT ayarlarını appsettings.json'dan alır
var jwtSettings = builder.Configuration.GetSection("Jwt");
var key = Encoding.UTF8.GetBytes(jwtSettings["Key"]!);


// JWT Authentication ayarları
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;

    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,

        ValidIssuer = jwtSettings["Issuer"],
        ValidAudience = jwtSettings["Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(key)
    };
});


// PostgreSQL veritabanı bağlantısını sisteme ekler
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString));



var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<AppDbContext>();
        context.Database.Migrate(); // Tabloları veritabanına otomatik basar
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "Veritabanı migration işlemi sırasında bir hata oluştu.");
    }
}

// Swagger arayüzünü aktif eder
app.UseSwagger();
app.UseSwaggerUI();


// Authentication ve Authorization middleware
app.UseAuthentication();
app.UseAuthorization();


// Controller endpointlerini aktif eder
app.MapControllers();


// Basit test endpointi
app.MapGet("/", () => "UniSphere API Çalışıyor!");


// JWT korumalı test endpointi
app.MapGet("/secure", () => "Bu endpoint JWT ile korunuyor!")
   .RequireAuthorization();


app.Run();