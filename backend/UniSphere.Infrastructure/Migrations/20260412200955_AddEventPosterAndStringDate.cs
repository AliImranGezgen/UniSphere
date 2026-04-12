using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace UniSphere.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddEventPosterAndStringDate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "PosterImagePath",
                table: "Events",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PosterImagePath",
                table: "Events");
        }
    }
}
