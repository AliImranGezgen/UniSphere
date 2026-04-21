namespace UniSphere.API.DTOs;

// 3. Faz: Keşif ekranında etkinlik kartlarını besleyen özet DTO.
public class DiscoveryEventSummaryDto
{
    // 3. Faz: Keşif kartında gösterilecek etkinlik id'si.
    public int EventId { get; set; }

    // 3. Faz: Keşif kartında gösterilecek etkinlik başlığı.
    public string Title { get; set; } = string.Empty;

    // 3. Faz: Keşif kartında gösterilecek kısa etkinlik açıklaması.
    public string Description { get; set; } = string.Empty;

    // 3. Faz: Etkinlik tarih/saat bilgisinin sade string gösterimi.
    public string EventDate { get; set; } = string.Empty;

    // 3. Faz: Recommendation ve keşif filtreleri için kategori.
    public string Category { get; set; } = string.Empty;

    // 3. Faz: Etkinliğin bağlı olduğu topluluk id'si.
    public int ClubId { get; set; }

    // 3. Faz: Etkinliğin bağlı olduğu topluluk adı.
    public string ClubName { get; set; } = string.Empty;

    // 3. Faz: Popülerlik sıralaması için başvuru sayısı.
    public int ApplicationCount { get; set; }

    // 3. Faz: Keşif kartında gösterilecek afiş URL'si.
    public string? PosterImageUrl { get; set; }
}

// 3. Faz: Keşif ekranında topluluk vitrin kartlarını besleyen özet DTO.
public class DiscoveryClubSummaryDto
{
    // 3. Faz: Keşif kartında gösterilecek topluluk id'si.
    public int ClubId { get; set; }

    // 3. Faz: Keşif kartında gösterilecek topluluk adı.
    public string Name { get; set; } = string.Empty;

    // 3. Faz: Topluluğun temel açıklaması.
    public string Description { get; set; } = string.Empty;

    // 3. Faz: Topluluk vitrini için kısa açıklama.
    public string ShortDescription { get; set; } = string.Empty;

    // 3. Faz: Topluluk vitrini için logo URL'si.
    public string Logo { get; set; } = string.Empty;

    // 3. Faz: Popülerlik sıralaması için aktif üye sayısı.
    public int MemberCount { get; set; }

    // 3. Faz: Yeni eklenen topluluk sıralaması için oluşturulma tarihi.
    public DateTime CreatedAt { get; set; }
}

// 3. Faz: Ana sayfadaki sistem duyurularını döndüren response DTO.
public class DiscoveryAnnouncementDto
{
    // 3. Faz: Sistem duyurusu id'si.
    public int Id { get; set; }

    // 3. Faz: Ana sayfada gösterilecek duyuru metni.
    public string Message { get; set; } = string.Empty;

    // 3. Faz: "System" duyurularını ayıran bildirim tipi.
    public string Type { get; set; } = string.Empty;

    // 3. Faz: Duyuru sıralaması için oluşturulma tarihi.
    public DateTime CreatedAt { get; set; }
}

// 3. Faz: Keşif ve öneri ekranlarının kullanacağı sabit kategori contract'ı.
public class DiscoveryCategoryDto
{
    // 3. Faz: API ve veri tabanında saklanacak kategori anahtarı.
    public string Key { get; set; } = string.Empty;

    // 3. Faz: Frontend'de gösterilecek kategori etiketi.
    public string Label { get; set; } = string.Empty;
}
