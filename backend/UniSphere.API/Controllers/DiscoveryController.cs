using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UniSphere.API.DTOs;
using UniSphere.Infrastructure.Data;

namespace UniSphere.API.Controllers;

[ApiController]
[Route("api/discovery")]
public class DiscoveryController : ControllerBase
{
    private const string ActiveMembershipStatus = "Active";
    private readonly AppDbContext _context;

    // 3. Faz: Recommendation ve keşif ekranı için desteklenen sade kategori seti.
    private static readonly IReadOnlyList<DiscoveryCategoryDto> Categories = new List<DiscoveryCategoryDto>
    {
        new() { Key = "technical", Label = "Technical" },
        new() { Key = "social", Label = "Social" },
        new() { Key = "cultural", Label = "Cultural" },
        new() { Key = "career", Label = "Career" },
        new() { Key = "sports", Label = "Sports" },
        new() { Key = "volunteering", Label = "Volunteering" }
    };

    public DiscoveryController(AppDbContext context)
    {
        _context = context;
    }

    private string GetBaseUrl() =>
        $"{Request.Scheme}://{Request.Host}";

    private static string BuildEventDate(UniSphere.Core.Entities.Event eventEntity) =>
        $"{eventEntity.Date} {eventEntity.Time}".Trim();

    private string? BuildPosterUrl(string? posterUrl)
    {
        if (string.IsNullOrWhiteSpace(posterUrl))
            return null;

        return posterUrl.StartsWith("http", StringComparison.OrdinalIgnoreCase)
            ? posterUrl
            : $"{GetBaseUrl()}/uploads/{posterUrl}";
    }

    private DiscoveryEventSummaryDto ToEventSummary(UniSphere.Core.Entities.Event eventEntity) =>
        new()
        {
            EventId = eventEntity.Id,
            Title = eventEntity.Name,
            Description = eventEntity.Description,
            EventDate = BuildEventDate(eventEntity),
            Category = eventEntity.Category,
            ClubId = eventEntity.ClubId,
            ClubName = eventEntity.Club?.Name ?? string.Empty,
            ApplicationCount = eventEntity.Applications.Count,
            PosterImageUrl = BuildPosterUrl(eventEntity.PosterUrl)
        };

    // 3. Faz: Başvuru sayısına göre popüler etkinlikleri listeler.
    [HttpGet("popular-events")]
    public async Task<IActionResult> GetPopularEvents()
    {
        var events = await _context.Events
            .Include(e => e.Club)
            .Include(e => e.Applications)
            .OrderByDescending(e => e.Applications.Count)
            .Take(10)
            .ToListAsync();

        return Ok(events.Select(ToEventSummary));
    }

    // 3. Faz: Keşif ve recommendation filtrelerinde kullanılacak kategori listesini döndürür.
    [HttpGet("categories")]
    public IActionResult GetCategories()
    {
        return Ok(Categories);
    }

    // 3. Faz: Aktif üye sayısına göre popüler toplulukları listeler.
    [HttpGet("popular-clubs")]
    public async Task<IActionResult> GetPopularClubs()
    {
        var clubs = await _context.Clubs
            .Include(c => c.Memberships)
            .OrderByDescending(c => c.Memberships.Count(m => m.Status == ActiveMembershipStatus))
            .Take(10)
            .Select(c => new DiscoveryClubSummaryDto
            {
                ClubId = c.Id,
                Name = c.Name,
                Description = c.Description,
                ShortDescription = c.ShortDescription,
                Logo = c.Logo,
                MemberCount = c.Memberships.Count(m => m.Status == ActiveMembershipStatus),
                CreatedAt = c.CreatedAt
            })
            .ToListAsync();

        return Ok(clubs);
    }

    // 3. Faz: Son 30 gün filtresi için mevcut Event.Date/Event.Time alanından oluşan EventDate kullanılır.
    [HttpGet("new-events")]
    public async Task<IActionResult> GetNewEvents()
    {
        var cutoffDate = DateTime.UtcNow.AddDays(-30);
        var events = await _context.Events
            .Include(e => e.Club)
            .Include(e => e.Applications)
            .ToListAsync();

        var newEvents = events
            .Where(e => e.EventDate >= cutoffDate)
            .OrderByDescending(e => e.EventDate)
            .Take(10)
            .Select(ToEventSummary);

        return Ok(newEvents);
    }

    // 3. Faz: Son 30 günde oluşturulan toplulukları listeler.
    [HttpGet("new-clubs")]
    public async Task<IActionResult> GetNewClubs()
    {
        var cutoffDate = DateTime.UtcNow.AddDays(-30);
        var clubs = await _context.Clubs
            .Include(c => c.Memberships)
            .Where(c => c.CreatedAt >= cutoffDate)
            .OrderByDescending(c => c.CreatedAt)
            .Take(10)
            .Select(c => new DiscoveryClubSummaryDto
            {
                ClubId = c.Id,
                Name = c.Name,
                Description = c.Description,
                ShortDescription = c.ShortDescription,
                Logo = c.Logo,
                MemberCount = c.Memberships.Count(m => m.Status == ActiveMembershipStatus),
                CreatedAt = c.CreatedAt
            })
            .ToListAsync();

        return Ok(clubs);
    }

    // 3. Faz: Notification.Type = "System" olan sistem duyurularını döndürür.
    [HttpGet("announcements")]
    public async Task<IActionResult> GetAnnouncements()
    {
        var announcements = await _context.Notifications
            .Where(n => n.Type == "System")
            .OrderByDescending(n => n.CreatedAt)
            .Take(10)
            .Select(n => new DiscoveryAnnouncementDto
            {
                Id = n.Id,
                Message = n.Message,
                Type = n.Type,
                CreatedAt = n.CreatedAt
            })
            .ToListAsync();

        return Ok(announcements);
    }
}
