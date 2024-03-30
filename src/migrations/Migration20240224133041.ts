import { Migration } from '@mikro-orm/migrations';

export class Migration20240224133041 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "movies" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "title" varchar(255) not null, "synopsis" varchar(255) null, "rating" real not null, "release_date" date not null, constraint "movies_pkey" primary key ("id"));');
    this.addSql('comment on column "movies"."id" is \'User ID\';');
    this.addSql('comment on column "movies"."created_at" is \'Entity create datetime\';');
    this.addSql('comment on column "movies"."updated_at" is \'Entity update datetime\';');
    this.addSql('comment on column "movies"."title" is \'Movie title\';');
    this.addSql('comment on column "movies"."synopsis" is \'Movie synopsis\';');
    this.addSql('comment on column "movies"."rating" is \'Movie rating\';');

    this.addSql('create table "users" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "username" varchar(128) not null, "password" varchar(255) not null, constraint "users_pkey" primary key ("id"));');
    this.addSql('comment on column "users"."id" is \'User ID\';');
    this.addSql('comment on column "users"."created_at" is \'Entity create datetime\';');
    this.addSql('comment on column "users"."updated_at" is \'Entity update datetime\';');
    this.addSql('comment on column "users"."username" is \'Username\';');
    this.addSql('comment on column "users"."password" is \'User password\';');

    this.addSql('create table "movie_reviews" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "rating" real not null, "comment" varchar(255) null, "user_id" uuid not null, "movie_id" uuid not null);');
    this.addSql('comment on column "movie_reviews"."created_at" is \'Entity create datetime\';');
    this.addSql('comment on column "movie_reviews"."updated_at" is \'Entity update datetime\';');

    this.addSql('create table "user_movies" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "user_id" uuid not null, "movie_id" uuid not null);');
    this.addSql('comment on column "user_movies"."created_at" is \'Entity create datetime\';');
    this.addSql('comment on column "user_movies"."updated_at" is \'Entity update datetime\';');

    this.addSql('alter table "movie_reviews" add constraint "movie_reviews_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade;');
    this.addSql('alter table "movie_reviews" add constraint "movie_reviews_movie_id_foreign" foreign key ("movie_id") references "movies" ("id") on update cascade;');

    this.addSql('alter table "user_movies" add constraint "user_movies_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade;');
    this.addSql('alter table "user_movies" add constraint "user_movies_movie_id_foreign" foreign key ("movie_id") references "movies" ("id") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "movie_reviews" drop constraint "movie_reviews_movie_id_foreign";');

    this.addSql('alter table "user_movies" drop constraint "user_movies_movie_id_foreign";');

    this.addSql('alter table "movie_reviews" drop constraint "movie_reviews_user_id_foreign";');

    this.addSql('alter table "user_movies" drop constraint "user_movies_user_id_foreign";');

    this.addSql('drop table if exists "movies" cascade;');

    this.addSql('drop table if exists "users" cascade;');

    this.addSql('drop table if exists "movie_reviews" cascade;');

    this.addSql('drop table if exists "user_movies" cascade;');
  }

}
