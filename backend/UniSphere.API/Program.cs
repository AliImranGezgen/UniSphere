using Microsoft.EntityFrameworkCore;
using UniSphere.Infrastructure.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using UniSphere.API.Services;
using System.Text;
using UniSphere.Core.Interfaces;
using UniSphere.Infrastructure.Repositories;


var builder = WebApplication.CreateBuilder(args);

// Controller servislerini ekler
builder.Services.AddControllers();
builder.Services.AddScoped<TokenService>();
builder.Services.AddScoped<IClubRepository, ClubRepository>();
builder.Services.AddScoped<IEventRepository, EventRepository>();

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


// Swagger arayüzünü aktif eder
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "UniSphere API V1");
    c.RoutePrefix = "swagger";
});


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


app.Run("http://0.0.0.0:8080");