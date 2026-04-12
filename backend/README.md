# ⚙️ UniSphere - Backend API

Bu klasör, UniSphere projesinin **C# .NET Core** ile geliştirilen RESTful API mimarisini içerir.

## 📌 Teknolojiler

- **.NET Core:** Core API mimarisi.
- **Entity Framework Core:** ORM ve veritabanı yönetimi (Code-First yaklaşımı).
- **PostgreSQL:** İlişkisel veritabanı.
- **JWT (JSON Web Token):** Rol tabanlı yetkilendirme (Student, ClubAdmin, SystemAdmin).

## 🚀 Geliştirme Ortamında Çalıştırma

Docker kullanmadan, sadece Backend'i lokalde çalıştırmak isterseniz:

1.  Terminali `backend` dizininde açın.
2.  Gerekli paketleri yükleyin ve projeyi derleyin:
    ```bash
    dotnet restore
    dotnet build
    ```
3.  API'yi ayağa kaldırın:
    ```bash
    dotnet run
    ```

## 🔐 Yetkilendirme (Auth)

Sistemde rotalar rol bazlı olarak korunmaktadır. İstek atarken Header kısmına JWT token eklenmelidir:
`Authorization: Bearer <token_buraya>`
