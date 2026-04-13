namespace UniSphere.Core.AI.DTOs;

public class RecommendationRequestDto
{
    public int UserId { get; set; }
    public List<int> AppliedEventIds { get; set; } = new();
    public List<int> CheckedInEventIds { get; set; } = new();
    public List<string> InterestedCategories { get; set; } = new();
}