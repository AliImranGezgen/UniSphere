using UniSphere.Infrastructure.Data;
using UniSphere.Core.AI.DTOs;
using UniSphere.Core.AI.Interfaces;
using UniSphere.Core.Entities;

namespace UniSphere.Infrastructure.Services;

public class NoShowPredictionService : INoShowPredictionService
{
    private readonly AppDbContext _context;

    public NoShowPredictionService(AppDbContext context)
    {
        _context = context;
    }

    public NoShowResultDto Predict(NoShowRequestDto request)
    {
        // Kullanıcının geçmiş başvurularını çekiyoruz.
        var userApps = _context.Applications
            .Where(x => x.UserId == request.UserId)
            .ToList();

        var total = userApps.Count + request.PreviousNoShowCount + request.PreviousAttendCount;
        var attended = userApps.Count(x => x.Status == ApplicationStatus.Approved) + request.PreviousAttendCount;
        var noShow = total - attended;

        // No-show oranını hesaplıyoruz.
        double ratio = total == 0 ? 0 : (double)noShow / total;
        string riskLevel;

        if (ratio > 0.7)
        {
            riskLevel = "High";
        }
        else if (ratio > 0.4)
        {
            riskLevel = "Medium";
        }
        else
        {
            riskLevel = "Low";
        }

        return new NoShowResultDto
        {
            RiskLevel = riskLevel,
            Score = Math.Round(ratio * 100, 2),
            Meta = new AIResponseMetaDto
            {
                Model = "noshow-v1"
            }
        };
    }
}
