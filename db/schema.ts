import {
  sqliteTable,
  text,
  integer,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

export const business = sqliteTable(
  "businesses",
  {
    id: integer("id").primaryKey(),
    registrationId: text("registrationId"),
    name: text("name"),
  },
  (countries) => ({
    registrationIdx: uniqueIndex("registrationIdx").on(
      countries.registrationId
    ),
  })
);
