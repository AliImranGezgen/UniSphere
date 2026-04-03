using Microsoft.EntityFrameworkCore;
using UniSphere.Infrastructure.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using UniSphere.API.Services;
using System.Text;
using UniSphere.Core.Interfaces;
using UniSphere.Infrastructure.Repositories;

var builder = WebApplication.CreateBuilder(args);

// Controllers
builder.Services.AddControllers();

// Services
builder.Services.AddScoped<TokenService>();
builder.Services.AddScoped<IClubRepository, ClubRepository>();
builder.Services.AddScoped<IEventRepository, EventRepository>();

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// JWT settings
var jwtSettings = builder.Configuration.GetSection("Jwt");
var jwtKey = jwtSettings["Key"];

if (string.IsNullOrWhiteSpace(jwtKey))
{
    throw new InvalidOperationException("JWT Key is missing. Check environment variables or configuration.");
}

var key = Encoding.UTF8.GetBytes(jwtKey);

// Authentication
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

// Authorization
builder.Services.AddAuthorization();

// Database
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

if (string.IsNullOrWhiteSpace(connectionString))
{
    throw new InvalidOperationException("Database connection string is missing. Check environment variables or configuration.");
}

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString));

var app = builder.Build();

// Swagger
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "UniSphere API V1");
    c.RoutePrefix = "swagger";
});

// Middleware
app.UseAuthentication();
app.UseAuthorization();

// Controllers
app.MapControllers();

// Health/Test endpoints
app.MapGet("/", () => "UniSphere API Çalışıyor!");
app.MapGet("/secure", () => "Bu endpoint JWT ile korunuyor!")
   .RequireAuthorization();

app.Run("http://0.0.0.0:8080");