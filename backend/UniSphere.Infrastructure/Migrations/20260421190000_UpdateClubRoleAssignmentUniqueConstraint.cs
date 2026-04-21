using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace UniSphere.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdateClubRoleAssignmentUniqueConstraint : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_ClubRoleAssignments_ClubId_UserId",
                table: "ClubRoleAssignments");

            migrationBuilder.CreateIndex(
                name: "IX_ClubRoleAssignments_ClubId_UserId_Role",
                table: "ClubRoleAssignments",
                columns: new[] { "ClubId", "UserId", "Role" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_ClubRoleAssignments_ClubId_UserId_Role",
                table: "ClubRoleAssignments");

            migrationBuilder.CreateIndex(
                name: "IX_ClubRoleAssignments_ClubId_UserId",
                table: "ClubRoleAssignments",
                columns: new[] { "ClubId", "UserId" },
                unique: true);
        }
    }
}