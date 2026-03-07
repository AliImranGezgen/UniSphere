using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.EntityFrameworkCore;
using UniSphere.Core.Services;
using UniSphere.Infrastructure.Data; // Artık hata vermeyecek!

var builder = WebApplication.CreateBuilder(args);

// 1. Veritabanı Bağlantısı
builder.Services.AddDbContext<DbContext, AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// 2. AuthService Tanımlama
builder.Services.AddScoped<IAuthService, AuthService>();

// 3. JWT Kimlik Doğrulama Ayarları
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = "UniSphereAPI",
            ValidAudience = "UniSphereFrontend",
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("UniSphere_Cok_Gizli_Key_1234567890_Sifre_Uzun_Olmalidir"))
        };
    });

builder.Services.AddControllers();
var app = builder.Build();

app.UseAuthentication(); 
app.UseAuthorization();  
app.MapControllers();

app.Run();