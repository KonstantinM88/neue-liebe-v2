# AGENTS.md — Neue Liebe

Этот файл — оперативная карта проекта и обязательная точка входа для любого агента, который меняет репозиторий.

## Обязательный рабочий протокол

1. Перед анализом или изменениями прочитать `AGENTS.md` целиком.
2. Проверить `git status --short` и не затирать пользовательские или чужие незавершённые изменения.
3. Сверить затрагиваемый код с описанием ниже. Если документ расходится с исходниками, исходники являются текущей истиной, а `AGENTS.md` нужно исправить в рамках той же задачи.
4. После изменений выполнить проверки, соразмерные риску: минимум `npm run lint`; для маршрутов, конфигурации, Prisma, server/client boundaries, SEO и production-поведения также `npm run build`.
5. После каждой задачи ещё раз проверить этот файл:
   - обновить соответствующие разделы, если изменились архитектура, маршруты, API, переменные окружения, схема БД, хранилища, команды, ограничения или важные соглашения;
   - добавить краткую датированную запись в журнал важных изменений;
   - не засорять журнал чисто косметическими правками без влияния на поведение, архитектуру или сопровождение.
6. Никогда не записывать сюда значения секретов, паролей, токенов, connection strings или персональные данные.

## Назначение проекта

`neue-liebe` — production-сайт ресторана Neue Liebe в Nebra (Unstrut), Германия.

Основные функции:

- публичный двуязычный сайт на немецком и английском;
- отдельные SEO-страницы: о ресторане, впечатления, меню, галерея, события, отзывы и контакты;
- двуязычные новости в Markdown с SEO/GEO-разметкой и редактированием через админку;
- форма бронирования с записью в PostgreSQL;
- получение отзывов из Google Places API;
- закрытая DE/RU админка для загрузки галереи, управления меню и двуязычными новостями;
- SEO metadata, canonical/hreflang, sitemap, robots, JSON-LD и PWA manifest.

Production URL: `https://www.neueliebe-nebra.de`.

## Актуальный стек

Источником истины для версий является `package.json`, а не README.

- Node.js `22.x`
- Next.js `16.2.9`, App Router, Turbopack production build
- React / React DOM `19.2.5`
- TypeScript `5.9.3`, `strict: true`, `noEmit: true`
- Tailwind CSS `4.x` подключён через PostCSS, но большая часть интерфейса оформлена обычным CSS
- Prisma / Prisma Client `7.7.0`
- PostgreSQL через `@prisma/adapter-pg`
- `sharp` для серверной обработки изображений
- `react-markdown` + `remark-gfm` для безопасного Markdown rendering без raw HTML
- ESLint 9 + `eslint-config-next`
- npm и `package-lock.json`

README содержит устаревшие версии Next.js и Prisma. При расхождениях ориентироваться на `package.json` и рабочий build.

## Основные команды

```bash
npm install
npm run dev
npm run lint
npm run build
npm run start

npm run db:generate
npm run db:migrate
npm run db:push
npm run db:studio
```

`npm run build` сначала выполняет `prisma generate`, затем `next build`.

Для локальной разработки требуется доступный `DATABASE_URL`, потому что `lib/prisma.ts` проверяет его уже при загрузке модуля.

## Карта репозитория

```text
app/                         Next.js App Router: страницы, metadata и API
  api/                       route handlers
  en/                        английские варианты публичных страниц
  admin/                     login и защищённые admin routes
components/                  общие client-компоненты и секции главной
  admin/                     менеджеры галереи и меню
  sections/                  секции главной страницы
context/LangContext.tsx      клиентская локализация DE/EN
hooks/                       IntersectionObserver/reveal helpers
lib/                         auth, Prisma, меню, галерея, SEO, locale/navigation
prisma/schema.prisma         схема бронирований и новостей
generated/prisma/            сгенерированный Prisma Client, игнорируется Git
data/gallery.json            управляемая галерея, отслеживается Git
data/menu.json               управляемое меню, создаётся во время работы; сейчас отсутствует
public/                      статические изображения, видео и uploads
  uploads/news/              WebP-обложки новостей 1600x900 и 900x675
scripts/                     генерация brand assets
```

В корне существует пустое дерево каталогов с именем `{app/...}`. Это артефакт, не часть Next.js-приложения и не отслеживается Git.

## Публичные маршруты

Немецкий — язык по умолчанию, английский использует префикс `/en`.

| Немецкий | Английский | Назначение |
| --- | --- | --- |
| `/` | `/en` | главная со всеми основными секциями |
| `/about` | `/en/about` | о ресторане |
| `/experience` | `/en/experience` | терраса, зал, впечатления |
| `/menu` | `/en/menu` | полное меню |
| `/gallery` | `/en/gallery` | полная галерея |
| `/events` | `/en/events` | события и праздники |
| `/news` | `/en/news` | список опубликованных новостей |
| `/news/[slug]` | `/en/news/[slug]` | Markdown-статья |
| `/reviews` | `/en/reviews` | отзывы |
| `/contact` | `/en/contact` | контакты и карта |
| `/impressum` | `/en/impressum` | юридическая информация, `noindex` |
| `/datenschutz` | `/en/datenschutz` | privacy policy, `noindex` |

Служебные SEO/PWA routes:

- `/sitemap.xml` — `app/sitemap.ts`;
- `/robots.txt` — `app/robots.ts`;
- `/llms.txt` — `public/llms.txt`, Markdown-контекст и curated links для AI/LLM-систем;
- `/manifest.webmanifest` — `app/manifest.ts`;
- Open Graph, Twitter, favicon и app icons находятся в `app/`.

`next.config.ts`:

- постоянно перенаправляет host `neueliebe-nebra.de` на `https://www.neueliebe-nebra.de`;
- задаёт годовой immutable cache для статических изображений и видео.

При добавлении или переименовании публичной страницы проверить обе локали, `lib/site-locale.ts`, `lib/site-nav.ts`, `app/sitemap.ts`, metadata canonical/hreflang, Open Graph, JSON-LD и ссылки Footer/Navigation.

## Рендеринг и локализация

- Server pages в `app/**/page.tsx` задают metadata и JSON-LD.
- Интерактивный UI находится в компонентах с `'use client'`.
- `app/HomePageClient.tsx` собирает главную страницу и оборачивает её в `LangProvider`.
- Внутренние страницы используют `components/SitePageShell.tsx`.
- `context/LangContext.tsx` хранит `de | en`, меняет `<html lang>` и предоставляет `t(de, en)`.
- Английские pages переиспользуют немецкие client-компоненты с `initialLang="en"`.
- Навигационные преобразования централизованы в `lib/site-locale.ts` и `lib/site-nav.ts`.
- Админка локализована отдельно на `de | ru` через `lib/admin-lang.ts`; выбор хранится в `localStorage`.

Не добавлять отдельную копию client-компонента только ради английского текста: сохранять текущую модель `initialLang` + `t(...)`, если нет веской архитектурной причины изменить её.

## Главная страница и UI

Порядок секций главной задаётся в `app/HomePageClient.tsx`:

1. Hero
2. InfoBar
3. About
4. Experience
5. MenuSection
6. ParallaxQuote
7. Gallery
8. Events
9. Reviews
10. Reservation
11. Contact

Общие интерактивные элементы: custom cursor, scroll progress, desktop/mobile navigation, toast и reveal-анимации через `IntersectionObserver`.

Основные дизайн-токены находятся в начале `app/globals.css`:

- gold `#c9a96e`;
- gold-light `#e8d5a3`;
- charcoal `#1a1714`;
- brown `#4a3728`;
- cream `#faf6f0`.

Шрифты Cormorant Garamond и Jost подключаются через `next/font/google` в `app/layout.tsx`. Сохранять существующие CSS variables и визуальный язык, если задача явно не требует редизайна.

## Меню

Ключевые файлы:

- типы: `lib/menu-types.ts`;
- встроенные категории и блюда: `lib/menu-static.ts`;
- JSON/file storage: `lib/menu-store.ts`;
- merge для публичного сайта: `lib/menu-public.ts`;
- публичный API: `app/api/menu/route.ts`;
- admin API: `app/api/admin/menu/route.ts`;
- UI: `components/sections/MenuSection.tsx`, `components/admin/AdminMenuManager.tsx`.

Текущий baseline: 7 статических категорий и 25 статических блюд.

Алгоритм данных:

1. Статические элементы загружаются из TypeScript.
2. Управляемые элементы читаются из `data/menu.json`.
3. Merge выполняется через `Map`: managed category с тем же `key` и managed dish с тем же `id` переопределяют статический объект.
4. Если `data/menu.json` отсутствует или некорректен, используется пустой managed-набор.

Admin API умеет создавать/обновлять категории и блюда. Новое изображение блюда:

- принимается до 25 MB;
- обрабатывается `sharp`;
- сохраняется в WebP шириной до 1600 и 900 px;
- пишется в `public/uploads/menu`;
- пути и metadata записываются в `data/menu.json`.

Удаление категорий/блюд и очистка старых файлов сейчас не реализованы.

## Галерея

Ключевые файлы:

- типы: `lib/gallery-types.ts`;
- встроенная галерея: `lib/gallery-static.ts`;
- JSON/file storage: `lib/gallery-store.ts`;
- публичная локализация/merge: `lib/gallery-public.ts`;
- admin API: `app/api/admin/gallery/route.ts`;
- UI: `app/gallery/*`, `components/admin/AdminGalleryManager.tsx`.

Текущий baseline: 29 статических и 31 managed-изображение. Managed-изображения показываются перед статическими.

Загрузка через админку:

- максимум 20 файлов за запрос;
- `sharp` исправляет orientation и определяет `wide | tall | square`;
- создаются WebP варианты до 1600 и 900 px;
- файлы сохраняются в `public/uploads/gallery`;
- metadata добавляется в начало `data/gallery.json`.

Удаление изображений и очистка файлов сейчас не реализованы.

Важно: секция Gallery на главной (`components/sections/Gallery.tsx`) использует собственный фиксированный набор из шести media items и не читает managed gallery. Полная страница `/gallery` использует managed + static gallery.

## Новости

Ключевые файлы:

- типы: `lib/news-types.ts`;
- Prisma storage и mapping: `lib/news-store.ts`;
- JSON-LD/GEO: `lib/news-structured-data.ts`;
- public UI: `components/news/*`;
- routes: `app/news/*`, `app/en/news/*`;
- admin API: `app/api/admin/news/route.ts`;
- admin UI: `components/admin/AdminNewsManager.tsx`, `/admin/news`.

Новости хранятся в PostgreSQL через две Prisma-модели:

- `NewsPost` — общий slug, author, publish/draft state, дата и URL обложек;
- `NewsTranslation` — локаль `DE | EN`, title, excerpt, Markdown body, SEO, keywords, GEO/AI key facts, category и alt;
- `@@unique([postId, locale])` гарантирует одну запись каждой локали на публикацию;
- relation использует `onDelete: Cascade`.

Markdown хранится в поле `NewsTranslation.body` типа PostgreSQL `TEXT` и рендерится через `react-markdown` + `remark-gfm`. Raw HTML не рендерится.

Миграция: `prisma/migrations/20260623235000_add_news_posts/migration.sql`.

Публичные правила:

- draft-статьи не попадают в списки, sitemap и public routes;
- public news routes используют dynamic SSR, чтобы изменения из PostgreSQL были видны без нового build;
- DE/EN canonical, hreflang, Open Graph Article и Twitter metadata генерируются из DB-полей;
- JSON-LD включает `NewsArticle`, `WebPage`, `BreadcrumbList`, Restaurant/PostalAddress, `contentLocation` и `SpeakableSpecification`;
- `keyFacts` выводятся отдельным блоком «Kurz erklärt / At a glance» для GEO/AI extraction;
- sitemap динамически добавляет обе локали только для полных DE+EN пар.

Admin API поддерживает создание, обновление, переименование slug, draft/publish и удаление. Общие данные и обе локали сохраняются одной Prisma-транзакцией, поэтому частичная DE/EN запись невозможна. Обложка optional; при загрузке создаются WebP 1600x900 и 900x675, максимум 25 MB. Удаление статьи каскадно удаляет переводы, но не удаляет ранее загруженные файлы обложек.

## Бронирования и Prisma

Схема находится в `prisma/schema.prisma`.

Модель `Reservation`:

- contact fields: `firstName`, `lastName`, `email`, `phone`;
- reservation fields: `date` (`@db.Date`), `time`, `guests`, `occasion`;
- optional `specialRequest`;
- status: `PENDING | CONFIRMED | CANCELLED | NO_SHOW`;
- language: строка `de | en`;
- timestamps и индексы по date/email/status.

`lib/prisma.ts` создаёт singleton Prisma Client с `PrismaPg`.

News-модели:

- `NewsPost` — публикация и общее состояние;
- `NewsTranslation` — локализованный Markdown/SEO/GEO-контент;
- enum `NewsLocale`: `DE | EN`.

API `app/api/reservations/route.ts`:

- `POST /api/reservations` создаёт бронь;
- `GET /api/reservations?status=&date=` возвращает список с фильтрами.

Форма находится в `components/sections/Reservation.tsx`.

При изменении Prisma schema:

1. создать и проверить миграцию, если изменение предназначено для сохранения;
2. выполнить `npm run db:generate`;
3. проверить типы, API и production build;
4. не коммитить `generated/prisma`, он игнорируется.

## Отзывы Google

`GET /api/reviews?lang=de|en` использует Google Places Text Search и Place Details.

- Если `GOOGLE_MAPS_API_KEY` отсутствует, API возвращает `source: "disabled"` и пустой список.
- Если `GOOGLE_PLACE_ID` отсутствует, place id ищется по `GOOGLE_PLACE_QUERY`.
- Ответ ограничивается семью отзывами.
- Fetch и HTTP response используют revalidation/cache headers.

UI находится в `components/sections/Reviews.tsx` и `app/reviews/ReviewsPageClient.tsx`.

## Админка и авторизация

Маршруты:

- `/admin` перенаправляет на `/admin/login`;
- `/admin/login` — форма входа;
- `/admin/gallery`, `/admin/menu` и `/admin/news` защищены route-group layout;
- `/api/admin/login`, `/logout`, `/gallery`, `/menu`, `/news`.

`lib/admin-auth.ts`:

- проверяет username/password из environment;
- создаёт HMAC-SHA256 signed token;
- cookie `nl_admin_session`: `httpOnly`, `sameSite=lax`, `secure` в production;
- срок сессии — 7 дней;
- `app/admin/(protected)/layout.tsx` проверяет cookie на сервере;
- каждый admin data API повторно проверяет cookie.

Изменения auth должны сохранять серверную проверку и на page, и на API уровне.

## Переменные окружения

Файлы `.env*` не должны попадать в ответы, логи или документацию со значениями.

Используемые/заявленные ключи:

```text
DATABASE_URL              required для Prisma
NEXT_PUBLIC_SITE_URL      присутствует в env template, но код сейчас его не читает
ADMIN_USERNAME            required для безопасной production admin auth
ADMIN_PASSWORD            required для безопасной production admin auth
ADMIN_SESSION_SECRET      required для безопасной подписи сессии
GOOGLE_MAPS_API_KEY       optional
GOOGLE_PLACE_ID           optional
GOOGLE_PLACE_QUERY        optional, fallback "Neue Liebe Nebra"
```

Текущий `.gitignore` игнорирует и `.env`, и `.env.example`. Локальный `.env.example` содержит credential-like значения вместо безопасных placeholders. Не копировать их в документы или сообщения. Рекомендуемое отдельное исправление: заменить значения placeholders и изменить ignore rule на явное разрешение `!.env.example`.

## SEO и контент

- Общий metadata base и базовые Open Graph/Twitter settings — `app/layout.tsx`.
- Page-specific metadata находится рядом с каждой page.
- Общие JSON-LD builders — `lib/structured-data.ts`.
- FAQ content и FAQPage JSON-LD — `lib/page-faqs.ts`.
- Production URL, адрес, телефон, часы работы и ресторанные сведения повторяются в нескольких местах.

При изменении адреса, телефона, часов работы, домена, меню или позиционирования искать все дубли через `rg`, включая:

```text
app/layout.tsx
app/**/page.tsx
components/sections/*
lib/page-faqs.ts
lib/structured-data.ts
app/sitemap.ts
app/robots.ts
```

Сохранять parity между DE/EN metadata и контентом.

## Известные ограничения и риски

### Высокий приоритет

- `GET /api/reservations` не требует admin session и раскрывает все бронирования с персональными данными. Перед production-использованием endpoint должен быть защищён или удалён.
- В `lib/admin-auth.ts` есть fallback username/password/secret. В production отсутствие env не приводит к fail-fast и создаёт предсказуемые credentials.
- `POST /api/reservations` не имеет rate limiting/CAPTCHA и делает только базовую валидацию.
- `occasion` приводится к Prisma enum без runtime validation.
- Значение формы `guests = "9+"` преобразуется через `Number("9+") || 2`, поэтому сохраняется как `2`.

### Deployment/storage

- Menu/gallery admin writes JSON и media прямо в локальную файловую систему.
- News-текст, переводы, SEO/GEO и publish state хранятся устойчиво в PostgreSQL; только загруженные news-обложки пока пишутся в локальную файловую систему.
- На serverless/immutable/ephemeral hosting такие записи могут исчезнуть, не реплицироваться между instances или завершиться ошибкой.
- Для надёжного production CMS нужны постоянное object storage для media и БД/другое durable storage для metadata.
- Запись JSON не защищена lock/transaction; одновременные admin requests могут потерять обновления.

### Качество и сопровождение

- Автоматических unit/integration/e2e тестов и test script нет.
- README частично устарел.
- Логика DE/EN страниц и JSON-LD местами дублируется.
- `data/gallery.json` и загруженные gallery assets отслеживаются Git, а `data/menu.json` сейчас отсутствует.
- У upload API галереи нет явного общего лимита размера файла, только лимит количества.
- Удаление или замена news-обложки оставляет старый файл в `public/uploads/news`; автоматического garbage collection нет.
- `npm audit --omit=dev` после обновления Next.js показывает transitive advisories в Prisma CLI/Hono/fast-uri и bundled PostCSS; прямого безопасного non-breaking fix для текущего Prisma 7.7.0 audit не предлагает.

## Проверенный baseline

Дата последней полной проверки: **2026-06-23**.

- `npm run build`: проходит.
- Next.js build: 43 статически генерируемые page/asset route; news, admin и API routes динамические.
- `npm run lint`: не проходит — 41 error и 2 warning.
  - Все 41 error: `app/datenschutz/DatenschutzClient.tsx`, правило `react-hooks/static-components`; `H2`, `H3`, `P` объявлены внутри render.
  - Warning: `<img>` в `app/gallery/GalleryMasonry.tsx`.
  - Warning: `<img>` в `components/sections/Reviews.tsx`.
- Git branch на момент анализа: `main`.
- Рабочее дерево до добавления этого файла было чистым.

Build может проходить при красном lint, поэтому обе проверки обязательны и не заменяют друг друга.

## Code conventions

- Использовать alias `@/*` для импортов от корня.
- Следовать существующему стилю: TypeScript, single quotes, без обязательных semicolons, 2 пробела.
- Сохранять server/client boundary:
  - `server-only` для filesystem, secrets и Prisma helpers;
  - `'use client'` только там, где нужны hooks, browser APIs или event handlers.
- Не импортировать server-only modules в client tree.
- Не добавлять secrets в `NEXT_PUBLIC_*`.
- Для server route handlers возвращать структурированный JSON и логировать server errors с route context.
- Для изображений сохранять desktop/mobile variants и осмысленный `alt`.
- При изменении UI проверять desktop и mobile; сайт сильно зависит от responsive CSS и media assets.
- Не редактировать сгенерированный `generated/prisma` вручную.
- Не удалять и не перезаписывать пользовательские uploads без явного запроса.

## Definition of done для изменений

Перед завершением задачи:

1. Изменение реализовано в минимально необходимом scope.
2. DE/EN parity проверена, если затронут публичный контент или маршрут.
3. Auth/API validation проверены, если затронуты admin или бронирования.
4. Persistence и deployment semantics проверены, если затронуты menu/gallery/uploads.
5. `npm run lint` и нужные дополнительные проверки выполнены; существующие и новые ошибки разделены в отчёте.
6. Для значимых изменений выполнен `npm run build`.
7. `git diff` просмотрен, лишние файлы и секреты не добавлены.
8. `AGENTS.md` обновлён, если изменился хотя бы один долговечный факт о проекте.

## Журнал важных изменений

Записи добавляются сверху, формат: `YYYY-MM-DD — краткое изменение; затронутые области; выполненные проверки`.

- **2026-06-23** — news persistence перенесён с Markdown-файлов на PostgreSQL/Prisma: добавлены `NewsPost`, `NewsTranslation`, `NewsLocale`, cascade relation, уникальность локали и миграция `20260623235000_add_news_posts`; Markdown теперь хранится как `TEXT`, а DE/EN создаются и обновляются одной транзакцией. Миграция применена к настроенной БД. Проверки: Prisma validate/generate/status успешно; production build успешно; production CRUD-тест создал запись с двумя переводами, транзакционно переименовал slug, проверил DE/EN/JSON-LD/sitemap и каскадно удалил тестовые данные.
- **2026-06-23** — немецкая локализация news-модуля приведена к слову `Nachrichten` во всех пользовательских местах: header/footer navigation, public metadata и заголовки, breadcrumbs, admin UI, default category и `llms.txt`; английская локаль сохраняет `News`, технические URL `/news` не изменены.
- **2026-06-23** — добавлен двуязычный Markdown news-модуль: `/news`, `/en/news`, динамические article routes, `/admin/news`, защищённый CRUD API, WebP-обложки, SEO metadata, `NewsArticle`/Restaurant/Breadcrumb/Speakable JSON-LD, dynamic sitemap и навигация; Next.js обновлён с 16.2.3 до security patch 16.2.9. Проверки: `tsc --noEmit` успешно; production build успешно; end-to-end production test успешно создал, отрендерил DE/EN, проверил JSON-LD/sitemap и удалил временную новость; lint сохранил только прежние 41 error и 2 warning.
- **2026-06-23** — добавлен `public/llms.txt`, доступный как `/llms.txt`; зафиксированы проверенные сведения о ресторане, инструкции для AI и curated DE/EN links по формату llms.txt. Проверки: Markdown-структура и ссылки сверены с публичными routes; production build успешно; локальный production server вернул `200` и `Content-Type: text/plain; charset=UTF-8`.
- **2026-06-23** — создан корневой `AGENTS.md`; зафиксированы архитектура, маршруты, источники данных, env-контракт, deployment/security risks и исходный build/lint baseline. Проверки: `npm run build` успешно; `npm run lint` завершился с 41 error и 2 warning, описанными выше.
