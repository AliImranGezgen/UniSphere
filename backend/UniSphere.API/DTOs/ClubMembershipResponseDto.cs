namespace UniSphere.API.DTOs;

// 3. Faz: Topluluğa katılma/ayrılma işlemlerinin sade response contract'ı.
public class ClubMembershipResponseDto
{
    // 3. Faz: İşlem yapılan topluluğun id'si.
    public int ClubId { get; set; }

    // 3. Faz: Üyelik işlemini yapan kullanıcının id'si.
    public int UserId { get; set; }

    // 3. Faz: Üyeliğin güncel durumu (Active/Inactive).
    public string Status { get; set; } = string.Empty;

    // 3. Faz: Join/leave işlemi için kullanıcıya dönen kısa mesaj.
    public string Message { get; set; } = string.Empty;
}
