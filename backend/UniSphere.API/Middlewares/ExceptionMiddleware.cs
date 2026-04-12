using System.Net;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc;

namespace UniSphere.API.Middlewares;

// Uygulama genelindeki (Global) tüm hata ve istisnaları yakalayıp profesyonel formatta döndüren katman
public class ExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionMiddleware> _logger;

    public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            // Eğer bir sıkıntı yoksa bir sonraki adıma (diğer middleware veya controller'a) geç.
            await _next(context);
        }
        catch (Exception ex)
        {
            // Bir hata meydana gelirse (örn. throw new Exception("...")) bunu logla ve client için handle et.
            _logger.LogError(ex, ex.Message);
            await HandleCustomExceptionResponseAsync(context, ex);
        }
    }

    // Gelen hatayı, endüstri standardı olan "Problem Details" objesine sarıp client'a (ör. React tarafına) dönen metod.
    private static Task HandleCustomExceptionResponseAsync(HttpContext context, Exception exception)
    {
        // Response formatını JSON olarak ayarlarız.
        context.Response.ContentType = "application/json";
        
        // Şimdilik genel olarak 500 dönüyor ancak iş kuralları istisnası eklemek isterseniz buraya tip kontrolü yazılabilir.
        // Hata tipi BadHttpRequestException, ValidationException veya ArgumentException vs. ise 400 dönecek şekilde ayarlanabilir.
        context.Response.StatusCode = exception switch
        {
            ArgumentException => (int)HttpStatusCode.BadRequest, // 400
            InvalidOperationException => (int)HttpStatusCode.UnprocessableEntity, // 422
            _ => (int)HttpStatusCode.InternalServerError // 500
        };

        // Standardize edilmiş JSON objemiz:
        var response = new ProblemDetails
        {
            Status = context.Response.StatusCode,
            Title = context.Response.StatusCode == 500 ? "Sunucu İçi Beklenmedik Hata" : "Doğrulama veya İş Kuralı Hatası",
            Detail = exception.Message // Sadece exception mesajını (örn: "Kapasite dolu") döneriz, karmaşık StackTrace dönmeyiz.
        };

        var options = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };
        var json = JsonSerializer.Serialize(response, options);

        return context.Response.WriteAsync(json);
    }
}
