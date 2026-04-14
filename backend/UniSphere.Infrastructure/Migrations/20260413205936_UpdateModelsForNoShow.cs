using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace UniSphere.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdateModelsForNoShow : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Category",
                table: "Events",
                type: "text",
                nullable: false,
                defaultValue: "");
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
