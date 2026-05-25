using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace UniSphere.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class FinalizeCurrentEventSchema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Older VPS databases retain required legacy columns while the
            // active entity writes to the current Name/Date based schema.
            migrationBuilder.Sql(@"
                ALTER TABLE ""Events"" ADD COLUMN IF NOT EXISTS ""Name"" text NOT NULL DEFAULT '';
                ALTER TABLE ""Events"" ADD COLUMN IF NOT EXISTS ""MaxParticipants"" integer NOT NULL DEFAULT 0;
                ALTER TABLE ""Events"" ADD COLUMN IF NOT EXISTS ""Date"" text NOT NULL DEFAULT '';
                ALTER TABLE ""Events"" ADD COLUMN IF NOT EXISTS ""Time"" text NOT NULL DEFAULT '';
                ALTER TABLE ""Events"" ADD COLUMN IF NOT EXISTS ""PosterUrl"" text NOT NULL DEFAULT '';
                ALTER TABLE ""Events"" ADD COLUMN IF NOT EXISTS ""Category"" text NOT NULL DEFAULT '';

                DO $$
                BEGIN
                    IF EXISTS (
                        SELECT 1 FROM information_schema.columns
                        WHERE table_schema = 'public' AND table_name = 'Events' AND column_name = 'Title'
                    ) THEN
                        UPDATE ""Events""
                        SET ""Name"" = COALESCE(NULLIF(""Name"", ''), ""Title"");
                    END IF;

                    IF EXISTS (
                        SELECT 1 FROM information_schema.columns
                        WHERE table_schema = 'public' AND table_name = 'Events' AND column_name = 'Capacity'
                    ) THEN
                        UPDATE ""Events""
                        SET ""MaxParticipants"" = CASE
                            WHEN ""MaxParticipants"" = 0 THEN ""Capacity""
                            ELSE ""MaxParticipants""
                        END;
                    END IF;

                    IF EXISTS (
                        SELECT 1 FROM information_schema.columns
                        WHERE table_schema = 'public' AND table_name = 'Events' AND column_name = 'EventDate'
                    ) THEN
                        UPDATE ""Events""
                        SET ""Date"" = COALESCE(NULLIF(""Date"", ''), to_char(""EventDate"", 'YYYY-MM-DD')),
                            ""Time"" = COALESCE(NULLIF(""Time"", ''), to_char(""EventDate"", 'HH24:MI'));
                    END IF;

                    IF EXISTS (
                        SELECT 1 FROM information_schema.columns
                        WHERE table_schema = 'public' AND table_name = 'Events' AND column_name = 'PosterImagePath'
                    ) THEN
                        UPDATE ""Events""
                        SET ""PosterUrl"" = COALESCE(NULLIF(""PosterUrl"", ''), ""PosterImagePath"", '');
                    END IF;
                END
                $$;

                ALTER TABLE ""Events"" DROP COLUMN IF EXISTS ""Title"";
                ALTER TABLE ""Events"" DROP COLUMN IF EXISTS ""Capacity"";
                ALTER TABLE ""Events"" DROP COLUMN IF EXISTS ""EventDate"";
                ALTER TABLE ""Events"" DROP COLUMN IF EXISTS ""Location"";
                ALTER TABLE ""Events"" DROP COLUMN IF EXISTS ""PosterImagePath"";
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
                ALTER TABLE ""Events"" ADD COLUMN IF NOT EXISTS ""Title"" text NOT NULL DEFAULT '';
                ALTER TABLE ""Events"" ADD COLUMN IF NOT EXISTS ""Capacity"" integer NOT NULL DEFAULT 0;
                ALTER TABLE ""Events"" ADD COLUMN IF NOT EXISTS ""EventDate"" timestamp with time zone NOT NULL DEFAULT now();
                ALTER TABLE ""Events"" ADD COLUMN IF NOT EXISTS ""Location"" text NOT NULL DEFAULT '';
                ALTER TABLE ""Events"" ADD COLUMN IF NOT EXISTS ""PosterImagePath"" text NULL;

                UPDATE ""Events""
                SET ""Title"" = ""Name"",
                    ""Capacity"" = ""MaxParticipants"",
                    ""EventDate"" = CASE
                        WHEN NULLIF(""Date"", '') IS NOT NULL
                        THEN (""Date"" || ' ' || COALESCE(NULLIF(""Time"", ''), '00:00'))::timestamp
                        ELSE now()
                    END,
                    ""PosterImagePath"" = NULLIF(""PosterUrl"", '');
            ");
        }
    }
}
