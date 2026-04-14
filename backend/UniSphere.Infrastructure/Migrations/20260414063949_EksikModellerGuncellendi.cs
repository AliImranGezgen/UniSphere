using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace UniSphere.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class EksikModellerGuncellendi : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Veritabanında (özellikle Hetzner sunucusunda) bu kolon manuel olarak veya 
            // dış bir SQL script'i ile daha önceden eklendiği için "AddColumn" komutu çökmektedir.
            // Çözüm olarak: Sütun sadece YUMUŞAK (idempotent) bir hamleyle, eğer yoksa eklenir.
            migrationBuilder.Sql(@"
                DO $$
                BEGIN
                    IF NOT EXISTS (
                        SELECT 1 FROM information_schema.columns 
                        WHERE table_name='Events' AND column_name='Category'
                    ) THEN
                        ALTER TABLE ""Events"" ADD COLUMN ""Category"" text NOT NULL DEFAULT '';
                    END IF;
                END
                $$;
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Category",
                table: "Events");
        }
    }
}
