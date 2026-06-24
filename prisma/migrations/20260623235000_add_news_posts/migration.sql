-- CreateEnum
CREATE TYPE "NewsLocale" AS ENUM ('DE', 'EN');

-- CreateTable
CREATE TABLE "news_posts" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "author" TEXT NOT NULL DEFAULT 'Neue Liebe',
    "publishedAt" TIMESTAMP(3) NOT NULL,
    "draft" BOOLEAN NOT NULL DEFAULT true,
    "coverImage" TEXT NOT NULL,
    "coverImageMobile" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "news_posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "news_translations" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "locale" "NewsLocale" NOT NULL,
    "title" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "seoTitle" TEXT NOT NULL,
    "seoDescription" TEXT NOT NULL,
    "keywords" TEXT[],
    "keyFacts" TEXT[],
    "category" TEXT NOT NULL,
    "coverAlt" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "news_translations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "news_posts_slug_key" ON "news_posts"("slug");

-- CreateIndex
CREATE INDEX "news_posts_publishedAt_idx" ON "news_posts"("publishedAt");

-- CreateIndex
CREATE INDEX "news_posts_draft_publishedAt_idx" ON "news_posts"("draft", "publishedAt");

-- CreateIndex
CREATE INDEX "news_translations_locale_idx" ON "news_translations"("locale");

-- CreateIndex
CREATE UNIQUE INDEX "news_translations_postId_locale_key" ON "news_translations"("postId", "locale");

-- AddForeignKey
ALTER TABLE "news_translations"
ADD CONSTRAINT "news_translations_postId_fkey"
FOREIGN KEY ("postId") REFERENCES "news_posts"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
