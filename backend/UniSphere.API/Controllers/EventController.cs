using Microsoft.AspNetCore.Mvc;
using UniSphere.API.DTOs;
using UniSphere.API.Mappings;
using UniSphere.Core.Interfaces;


namespace UniSphere.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EventController : ControllerBase
    {
        private readonly IEventRepository _repository;
        private readonly IWebHostEnvironment _env;

        public EventController(IEventRepository repository, IWebHostEnvironment env)
        {
            _repository = repository;
            _env = env;
        }

        // Yüklenen dosyayı uploads/ klasörüne kaydeder; dosya adını döndürür.
        private async Task<string?> SavePosterAsync(IFormFile? file)
        {
            if (file == null || file.Length == 0)
                return null;

            // Yalnızca resim dosyalarına izin ver
            var allowedTypes = new[] { "image/jpeg", "image/png", "image/webp", "image/gif" };
            if (!allowedTypes.Contains(file.ContentType.ToLower()))
                throw new InvalidOperationException("Yalnızca JPEG, PNG, WebP ve GIF formatlarına izin verilmektedir.");

            // 5 MB sınırı
            if (file.Length > 5 * 1024 * 1024)
                throw new InvalidOperationException("Dosya boyutu 5 MB'ı aşamaz.");

            var uploadsFolder = Path.Combine(_env.WebRootPath ?? _env.ContentRootPath, "uploads");
            Directory.CreateDirectory(uploadsFolder);

            // Güvenli ve benzersiz dosya adı oluştur
            var ext = Path.GetExtension(file.FileName).ToLower();
            var fileName = $"{Guid.NewGuid()}{ext}";
            var filePath = Path.Combine(uploadsFolder, fileName);

            using var stream = new FileStream(filePath, FileMode.Create);
            await file.CopyToAsync(stream);

            return fileName; // Sadece dosya adı kaydedilir, tam yol değil
        }

        private string GetBaseUrl() =>
            $"{Request.Scheme}://{Request.Host}";

        //GÖREV 1 : Tüm etkinlikleri listele
        [HttpGet]
        public async Task<IActionResult> GetAllEvents()
        {
            var entities = await _repository.GetAllEventsAsync();
            var baseUrl = GetBaseUrl();
            var dtos = entities.Select(x => x.ToDto(baseUrl));
            return Ok(dtos);
        }

        // Etkinlik oluştur (multipart/form-data — afiş dahil)
        [HttpPost]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> Create([FromForm] CreateEventDto dto)
        {
            // Tarih parse kontrolü
            if (!DateTime.TryParse(dto.EventDate, out _))
                return BadRequest($"Geçersiz tarih formatı: '{dto.EventDate}'. Beklenen: 'yyyy-MM-ddTHH:mm'");

            // Afiş görselini kaydet
            string? posterPath;
            try { posterPath = await SavePosterAsync(dto.PosterImage); }
            catch (InvalidOperationException ex) { return BadRequest(ex.Message); }

            var eventEntity = dto.ToEntity(posterPath);
            var createdEvent = await _repository.AddEventAsync(eventEntity);

            return Ok(createdEvent.ToDto(GetBaseUrl()));
        }

        // GÖREV 3 : Tek bir etkinliği getir
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var entity = await _repository.GetByEventIdAsync(id);

            if (entity == null)
                return NotFound("Aradığınız etkinlik bulunamadı.");

            return Ok(entity.ToDto(GetBaseUrl()));
        }

        // GÖREV 4 : Etkinliği Güncelle (multipart/form-data)
        [HttpPut("{id}")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> Update(int id, [FromForm] EventUpdateDto dto)
        {
            if (id != dto.EventId)
                return BadRequest("URL'deki ID ile DTO içindeki ID uyuşmuyor!");

            var existingEvent = await _repository.GetByEventIdAsync(id);
            if (existingEvent == null)
                return NotFound("Güncellenecek etkinlik bulunamadı.");

            // Tarih parse
            if (!DateTime.TryParse(dto.EventDate, out var parsedDate))
                return BadRequest($"Geçersiz tarih formatı: '{dto.EventDate}'");

            // Yeni afiş yüklendiyse eski dosyayı sil, yenisini kaydet
            if (dto.PosterImage != null)
            {
                // Eski dosyayı sil
                if (!string.IsNullOrEmpty(existingEvent.PosterImagePath))
                {
                    var oldPath = Path.Combine(
                        _env.WebRootPath ?? _env.ContentRootPath,
                        "uploads",
                        existingEvent.PosterImagePath);
                    if (System.IO.File.Exists(oldPath))
                        System.IO.File.Delete(oldPath);
                }

                string? newPoster;
                try { newPoster = await SavePosterAsync(dto.PosterImage); }
                catch (InvalidOperationException ex) { return BadRequest(ex.Message); }
                existingEvent.PosterImagePath = newPoster;
            }

            existingEvent.Title       = dto.Title;
            existingEvent.Description = dto.Description;
            existingEvent.EventDate   = parsedDate;
            existingEvent.Location    = dto.Location;
            existingEvent.Capacity    = dto.Capacity;
            existingEvent.ClubId      = dto.ClubId;

            await _repository.UpdateEventAsync(existingEvent);

            return Ok(existingEvent.ToDto(GetBaseUrl()));
        }

        // GÖREV 5 : Etkinliği Sil
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var existingEvent = await _repository.GetByEventIdAsync(id);
            if (existingEvent == null)
                return NotFound("Silinecek etkinlik zaten yok.");

            // Afiş dosyasını da sil
            if (!string.IsNullOrEmpty(existingEvent.PosterImagePath))
            {
                var path = Path.Combine(
                    _env.WebRootPath ?? _env.ContentRootPath,
                    "uploads",
                    existingEvent.PosterImagePath);
                if (System.IO.File.Exists(path))
                    System.IO.File.Delete(path);
            }

            await _repository.DeleteAsync(id);

            return NoContent();
        }
    }
}