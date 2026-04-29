using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UniSphere.API.Services;
using UniSphere.Infrastructure.Data;

namespace UniSphere.API.Controllers;

[ApiController]
[Route("api/applications")]
[Authorize]
public class ApplicationsController : ControllerBase
{
    private readonly ApplicationService _applicationService;
    private readonly AppDbContext _context;

    public ApplicationsController(ApplicationService applicationService, AppDbContext context)
    {
        _applicationService = applicationService;
        _context = context;
    }

    [HttpPost("events/{eventId:int}/apply")]
    public async Task<IActionResult> ApplyToEvent(int eventId)
    {
        var userId = GetCurrentUserId();
        var status = await _applicationService.ApplyToEventAsync(userId, eventId);

        return Ok(new
        {
            eventId,
            status,
            message = status == "Approved"
                ? "Basvurunuz onaylandi."
                : "Etkinlik kontenjani dolu oldugu icin bekleme listesine alindiniz."
        });
    }

    [HttpGet("me")]
    public async Task<IActionResult> GetMyApplications()
    {
        var userId = GetCurrentUserId();

        var applications = await _context.Applications
            .AsNoTracking()
            .Include(a => a.Event)
            .ThenInclude(e => e.Club)
            .Where(a => a.UserId == userId)
            .OrderByDescending(a => a.CreatedAt)
            .Select(a => new
            {
                id = a.Id,
                eventId = a.EventId,
                title = a.Event.Name,
                clubName = a.Event.Club.Name,
                eventDate = a.Event.EventDate.ToString("yyyy-MM-ddTHH:mm:ss"),
                status = a.Status.ToString()
            })
            .ToListAsync();

        return Ok(applications);
    }

    private int GetCurrentUserId()
    {
        var rawUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!int.TryParse(rawUserId, out var userId) || userId <= 0)
            throw new UnauthorizedAccessException("Gecerli kullanici bulunamadi.");

        return userId;
    }
}
