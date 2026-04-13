namespace UniSphere.Core.AI.DTOs;

public class NoShowRequestDto
{
    public int UserId { get; set; }
    public int EventId { get; set; }
    public int PreviousNoShowCount { get; set; }
    public int PreviousAttendCount { get; set; }
}
