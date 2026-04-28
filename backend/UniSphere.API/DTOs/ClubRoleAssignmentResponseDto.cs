namespace UniSphere.API.DTOs
{
    public class ClubRoleAssignmentResponseDto
    {
        public int ClubId { get; set; }
        public int UserId { get; set; }
        public string UserName { get; set; } = string.Empty;
        public string UserEmail { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public DateTime AssignedAt { get; set; }
    }
}
