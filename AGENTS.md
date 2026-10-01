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
- Next.js `16.3.6`, App Router, Turbopack production build
- React / React DOM `19.3.0`
- TypeScript `6.0.2`, `strict: true`, `noEmit: true`
- Tailwind CSS `4.3.3` подключён через PostCSS, но большая часть интерфейса оформлена обычным CSS
- Prisma / Prisma Client `7.10.0`
- npm `overrides` закрепляют исправленные `deepmerge-ts` `8.0.2` и `mysql2` `3.24.4` только внутри зависимостей Prisma CLI; после обновления Prisma проверять, нужны ли overrides дальше
- PostgreSQL через `@prisma/adapter-pg`
- `sharp` для серверной обработки изображений
- `@aws-sdk/client-s3` для AWS S3 и S3-compatible object storage
- `nodemailer` для SMTP-уведомлений о заявках на бронирование
- `react-markdown` + `remark-gfm` для безопасного Markdown rendering без raw HTML
- ESLint `9.39.5` + `eslint-config-next` `16.3.6`
- npm и `package-lock.json`

Версии в шапке README обновлены; остальные разделы README могут быть устаревшими. При расхождениях ориентироваться на `package.json` и рабочий build. Prisma 8 пока доступен как release candidate; TypeScript 7 и ESLint 10 пока несовместимы с используемыми инструментами, поэтому закреплены последние совместимые стабильные major-версии.

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

Для локальных тестов используется `.env` с общей Neon-БД; Prisma CLI также загружает этот файл через `prisma.config.ts`. Тестовые заявки должны содержать только вымышленные контактные данные.

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
  menu-media/               WebP-постеры блюд и WebM-ролики для статического меню
  uploads/news/              временное локальное хранилище news-обложек при NEWS_STORAGE_DRIVER=local
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
- `/reservations/confirm` — закрытая от индексации страница подтверждения менеджером по ссылке из письма; подтверждение выполняет отдельный POST `/api/reservations/confirm`;
- `/reservations/cancel` — закрытая от индексации DE/EN страница отмены гостем по отдельной ссылке из письма; отмена выполняется только отдельным POST `/api/reservations/cancel`;
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

Нижняя строка Footer содержит локализованные ссылки Impressum/Datenschutz и прозрачный sponsored-credit `Werbung · Webentwicklung: SaaleWeb` на `https://saaleweb.de/` с UTM-метками `utm_source=www.neueliebe-nebra.de`, `utm_medium=referral`, `utm_campaign=footer_credit` для атрибуции переходов с сайта ресторана.

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

Для 21 статического блюда в `public/menu-media` есть короткий WebM-ролик и WebP-постеры двух размеров (до 1024 и 640 px); для `Nebraer Bier St. Georg` добавлены только постеры. Поле `video` в `MenuDish` опционально. На главной и страницах `/menu`, `/en/menu` карточка показывает адаптивный постер, а видео загружается и воспроизводится без звука по нажатию на изображение, циклично; повторное нажатие возвращает постер. Значки воспроизведения и паузы не показываются: поверх изображения остаётся прозрачная кнопка с DE/EN `aria-label` и видимым контуром при фокусе с клавиатуры. В пределах одной секции меню одновременно воспроизводится только одно видео: запуск другой карточки останавливает предыдущее, смена категории также останавливает видео. Managed dish с тем же `id` полностью заменяет static dish, поэтому его видео не сохраняется при таком override.

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

17 фотографий блюд в статической полной галерее используют те же адаптивные WebP из `public/menu-media`, что и карточки меню.

## Новости

Ключевые файлы:

- типы: `lib/news-types.ts`;
- Prisma storage и mapping: `lib/news-store.ts`;
- переключатель local/S3 media storage: `lib/news-media-storage.ts`;
- S3-compatible media storage: `lib/object-storage.ts`;
- JSON-LD/GEO: `lib/news-structured-data.ts`;
- public UI: `components/news/*`;
- routes: `app/news/*`, `app/en/news/*`;
- admin API: `app/api/admin/news/route.ts`;
- admin UI: `components/admin/AdminNewsManager.tsx`, `/admin/news`.

Новости хранятся в PostgreSQL через две Prisma-модели:

- `NewsPost` — общий slug, author, publish/draft state, дата, публичные URL обложек и nullable object keys;
- `NewsTranslation` — локаль `DE | EN`, title, excerpt, Markdown body, SEO, keywords, GEO/AI key facts, category и alt;
- `@@unique([postId, locale])` гарантирует одну запись каждой локали на публикацию;
- relation использует `onDelete: Cascade`.

Markdown хранится в поле `NewsTranslation.body` типа PostgreSQL `TEXT` и рендерится через `react-markdown` + `remark-gfm`. Raw HTML не рендерится.

Миграции:

- `prisma/migrations/20260623235000_add_news_posts/migration.sql`;
- `prisma/migrations/20260624003000_add_news_cover_object_keys/migration.sql`.

Публичные правила:

- draft-статьи не попадают в списки, sitemap и public routes;
- public news routes используют dynamic SSR, чтобы изменения из PostgreSQL были видны без нового build;
- обложки статей и карточек на mobile сохраняют пропорцию 16:9, чтобы `object-fit: cover` не обрезал боковые части подготовленных постеров;
- DE/EN canonical, hreflang, Open Graph Article и Twitter metadata генерируются из DB-полей;
- JSON-LD включает `NewsArticle`, `WebPage`, `BreadcrumbList`, Restaurant/PostalAddress, `contentLocation` и `SpeakableSpecification`;
- `keyFacts` выводятся отдельным блоком «Kurz erklärt / At a glance» для GEO/AI extraction;
- sitemap динамически добавляет обе локали только для полных DE+EN пар.

Admin API поддерживает создание, обновление, переименование slug, draft/publish и удаление. Общие данные и обе локали сохраняются одной Prisma-транзакцией, поэтому частичная DE/EN запись невозможна. Тексты всегда хранятся в PostgreSQL. Обложка optional; при загрузке создаются WebP 1600x900 и 900x675, максимум 25 MB.

Admin UI рекомендует исходник не менее 1600x900 с пропорцией 16:9 и центральной композицией, объясняет автоматическую WebP-конвертацию и показывает preview выбранной либо текущей обложки до сохранения.

`NEWS_STORAGE_DRIVER` выбирает media backend:

- `local` — временный режим: файлы пишутся в `public/uploads/news`;
- `s3` — production-режим через AWS S3 или S3-compatible provider.

В БД хранятся публичные URL и managed media keys. При замене обложки новые файлы сначала сохраняются и записываются в БД, после успешной транзакции старые удаляются best-effort. При ошибке БД новые файлы очищаются best-effort. Удаление статьи сначала каскадно удаляет данные из БД, затем удаляет связанные managed media. Переключение backend не ломает старые URL: локальные ключи удаляются локально, S3 keys — через object storage. Старые записи без managed keys остаются совместимыми и автоматически не очищаются.

## Бронирования и Prisma

Схема находится в `prisma/schema.prisma`.

Модель `Reservation`:

- contact fields: `firstName`, `lastName`, `email`, `phone`;
- reservation fields: `date` (`@db.Date`), `time`, `guests`, `occasion`;
- optional `specialRequest`;
- status: `PENDING | CONFIRMED | CANCELLED | NO_SHOW`;
- nullable `confirmationEmailClaimedAt` и `confirmationEmailSentAt` для защиты от повторной отправки подтверждения гостю и возможности повторить отправку при сбое;
- nullable `cancellationReason`, `cancelledAt`, `cancellationNotificationClaimedAt`, `cancellationManagerEmailSentAt`, `cancellationGuestEmailSentAt` для причины, времени отмены и повторной отправки уведомлений без обычного дубля;
- `cancellationTokenVersion` инвалидирует прежнюю ссылку отмены после смены адреса гостя в подтверждённой брони; старые токены версии 1 остаются совместимыми до такой смены;
- language: строка `de | en`;
- timestamps и индексы по date/email/status.

`lib/prisma.ts` создаёт singleton Prisma Client с `PrismaPg`.

News-модели:

- `NewsPost` — публикация и общее состояние;
- `NewsTranslation` — локализованный Markdown/SEO/GEO-контент;
- enum `NewsLocale`: `DE | EN`.

API `app/api/reservations/route.ts`:

- `POST /api/reservations` валидирует и создаёт заявку со статусом `PENDING`, отправляет гостю DE/EN письмо о получении заявки, затем уведомляет менеджера через `lib/reservation-email.ts`; SMTP-ошибка не удаляет сохранённую заявку, ответ содержит отдельные `guestNotification` и `notification` со значениями `sent | failed | not_configured`. Дата и время обязаны быть в будущем по `Europe/Berlin` и внутри обычных часов работы: среда–суббота 15:00–23:00, воскресенье 10:00–16:00, понедельник/вторник закрыты; конец смены не является допустимым временем начала брони. Общая проверка в `lib/reservation-datetime.ts` также используется админкой;
- значение `guests = "9+"` записывается как минимум `9`, а в письме обозначается как `9 oder mehr`;
- `GET /api/reservations?status=&date=` возвращает список с фильтрами только при действующей admin session; без неё отвечает `401`.
- `POST /api/reservations/confirm` проверяет HMAC-ссылку менеджера, атомарно переводит `PENDING` в `CONFIRMED` и отправляет гостю DE/EN письмо. Повторное подтверждение не посылает письмо второй раз; при SMTP-ошибке статус остаётся `CONFIRMED`, а письмо можно отправить повторно той же ссылкой.
- `POST /api/reservations/cancel` проверяет отдельную HMAC-ссылку гостя, принимает необязательную причину до 1000 символов и атомарно переводит `CONFIRMED` в `CANCELLED` только до срока за 24 часа до начала брони по `Europe/Berlin`. Повторный запрос не меняет сохранённую причину; гостю и менеджеру отправляются отдельные письма, непрошедшую отправку можно повторить той же ссылкой. GET страницы не меняет статус.
- `GET/PATCH /api/admin/reservations` требует admin cookie: список с поиском, статусом и датой (до 100 записей, `total`), правка контактов/слота/пожеланий, подтверждение, отмена, неявка и повторное письмо. При изменении слота активной брони действуют те же ограничения будущего времени и рабочих часов. Правка использует `updatedAt` для отказа при конфликте, сохраняет данные даже при сбое SMTP и возвращает статус уведомления;
- `lib/reservation-confirm-action.ts` объединяет подтверждение менеджером по ссылке и из админки; `lib/reservation-cancellation-notify.ts` объединяет уведомления после отмены гостем и администратором.

Форма находится в `components/sections/Reservation.tsx`, ограничивает календарь/время по локальному времени ресторана и показывает отдельное сообщение, если заявка сохранена, но письмо гостю или менеджеру не отправлено. После успешного POST гость получает сообщение об ожидании решения; после подтверждения менеджером — отдельное письмо о брони. Сервер повторяет проверку независимо от ограничений браузера.

Миграция `prisma/migrations/20261001190000_add_reservations/migration.sql` создаёт ранее отсутствовавшие таблицу `reservations` и enum-типы `Occasion`/`ReservationStatus`. Она применена к общей Neon-БД 2026-10-01 для локальных тестов до деплоя обновлённого API.
Миграция `prisma/migrations/20261001213000_add_reservation_confirmation_email/migration.sql` добавляет два nullable поля учёта уведомления и тоже применена к общей Neon-БД 2026-10-01.
Миграция `prisma/migrations/20261001230000_add_reservation_cancellation/migration.sql` добавляет nullable поля учёта отмены и уведомлений; применена к общей Neon-БД 2026-10-01 для локальных тестов.
Миграция `prisma/migrations/20261002000000_add_cancellation_token_version/migration.sql` добавляет версию гостевого токена отмены; применена к общей Neon-БД 2026-10-02 для локальных тестов.

Ссылка в письме менеджеру содержит подписанный токен на 14 дней, использует `ADMIN_SESSION_SECRET` длиной не менее 32 символов и передаёт токен через URL fragment. Открытие ссылки не меняет БД; подтверждение происходит только по нажатию кнопки на странице. Письмо о подтверждённой брони содержит отдельную кнопку отмены, если 24-часовой срок ещё не истёк; подписанный токен гостя использует другую HMAC-purpose и остаётся действительным только для записи со статусом `CONFIRMED` до этого порога. Для локальных тестов с телефона `RESERVATION_CONFIRM_DEV_URL` может указать адрес компьютера в той же сети для обоих типов ссылок; настройка читается только при `NODE_ENV=development`. `next.config.ts` добавляет host этого URL в `allowedDevOrigins`, чтобы Next.js не блокировал клиентские dev-ресурсы при открытии страницы с телефона. Если URL не задан, dev использует localhost/частный origin запроса. Production всегда использует `https://www.neueliebe-nebra.de`. Письма гостю подписываются именем `Neue Liebe` с адреса настроенного `SMTP_USER`: первое говорит, что заявка ожидает решения, второе — что столик подтверждён и при достаточном времени его можно отменить, третье подтверждает отмену. Результат `sent` означает приём SMTP-сервером, а не гарантированную доставку в почтовый ящик.

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

- `/admin` ведёт на `/admin/reservations` при действующей сессии, иначе на `/admin/login`;
- `/admin/login` — форма входа;
- `/admin/reservations`, `/admin/gallery`, `/admin/menu` и `/admin/news` защищены route-group layout;
- `/api/admin/login`, `/logout`, `/reservations`, `/gallery`, `/menu`, `/news`.

`lib/admin-auth.ts`:

- проверяет username/password из environment, без резервных credentials; без `ADMIN_SESSION_SECRET` от 32 символов вход и проверка сессии закрыты;
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
ADMIN_SESSION_SECRET      required для подписи сессии и ссылок подтверждения бронирований; минимум 32 символа и одинаковое значение на всех instances
GOOGLE_MAPS_API_KEY       optional
GOOGLE_PLACE_ID           optional
GOOGLE_PLACE_QUERY        optional, fallback "Neue Liebe Nebra"
MAIL_PROVIDER             "smtp" для уведомлений о бронировании
SMTP_HOST                 SMTP hostname
SMTP_PORT                 SMTP port, для TLS-on-connect обычно 465
SMTP_SECURE               "true" для TLS-on-connect, "false" для STARTTLS
SMTP_USER                 SMTP login
SMTP_PASSWORD             SMTP password
SMTP_FROM                 резервный адрес отправителя уведомлений
LEAD_NOTIFY_FROM          основной адрес отправителя уведомлений
LEAD_NOTIFY_TO            один или несколько адресов менеджеров для заявок через запятую
RESERVATION_CONFIRM_DEV_URL optional локальный URL компьютера для открытия ссылок подтверждения и отмены с телефона в одной сети; игнорируется в production
NEWSLETTER_FROM           сейчас не читается приложением
NEWS_STORAGE_DRIVER       "local" или "s3", default "local"
OBJECT_STORAGE_ENDPOINT   optional только для AWS S3; required для R2/B2/MinIO и аналогов
OBJECT_STORAGE_REGION     required; для Cloudflare R2 обычно "auto"
OBJECT_STORAGE_BUCKET     required для загрузки обложек
OBJECT_STORAGE_ACCESS_KEY_ID      required для загрузки/удаления объектов
OBJECT_STORAGE_SECRET_ACCESS_KEY  required для загрузки/удаления объектов
OBJECT_STORAGE_PUBLIC_URL         required публичный base URL bucket/CDN
OBJECT_STORAGE_FORCE_PATH_STYLE   optional boolean, обычно нужен для локального MinIO
OBJECT_STORAGE_PREFIX             optional, default "neue-liebe"
```

`.env` и остальные локальные env-файлы игнорируются. `.env.example` явно разрешён через `!.env.example` и содержит только безопасные placeholders.

На 2026-10-01 `.env` указывает на общую Neon-БД, используемую опубликованными новостями. Перед тестами с записью проверять целевой database. Предыдущая тестовая заявка была удалена; новая миграция бронирований теперь применена к этой БД.

SMTP-параметры необходимо задать и в окружении deployed Node-приложения: локальный `.env` не переносится на hosting автоматически. При недостающей конфигурации заявка остаётся в БД, а пользователь видит просьбу позвонить. `nodemailer` использует `SMTP_SECURE=true` на порту 465 и требует STARTTLS при `SMTP_SECURE=false`.
Для письма менеджеру и ответа гостю используются одни SMTP credentials. Если `ADMIN_SESSION_SECRET` короче 32 символов, ссылка подтверждения не создаётся, а отправка уведомления менеджеру помечается как `not_configured`.

`NEWS_STORAGE_DRIVER=local` не требует object-storage credentials и включает загрузку через админку в `public/uploads/news`. Этот режим подходит для локальной разработки и обычного Node hosting с постоянным writable filesystem. Он не гарантирует сохранность файлов на Vercel/serverless/immutable/ephemeral hosting.

При `NEWS_STORAGE_DRIVER=s3` конфигурация читается серверным `lib/object-storage.ts`. Без полного набора `OBJECT_STORAGE_*` существующие новости и сохранение без новой обложки продолжают работать, но выбор нового изображения в admin UI отключён. `OBJECT_STORAGE_PUBLIC_URL` также читается `next.config.ts` во время build для создания `images.remotePatterns`, поэтому public URL должен присутствовать уже в build environment.

## SEO и контент

- Общий metadata base и базовые Open Graph/Twitter settings — `app/layout.tsx`.
- Page-specific metadata находится рядом с каждой page.
- Общие JSON-LD builders — `lib/structured-data.ts`.
- Сущность `WebSite` указывает SaaleWeb (`https://saaleweb.de/`) как `creator`; Impressum и `llms.txt` также фиксируют техническую реализацию и веб-разработку.
- FAQ content и FAQPage JSON-LD — `lib/page-faqs.ts`.
- Production URL, адрес, телефон, часы работы и ресторанные сведения повторяются в нескольких местах.
- Текущий график работы: среда–суббота 15:00–23:00; воскресенье 10:00–16:00; понедельник и вторник — выходные.

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

- Миграция бронирований уже применена к общей Neon-БД, но код защиты `GET /api/reservations` ещё не выложен на production. До деплоя старый публичный GET может раскрыть созданные заявки; использовать только вымышленные данные и выложить защищённый API перед приёмом реальных заявок.
- Время приёма письма SMTP-сервером не подтверждает фактическую доставку гостю; при сбое отправки менеджер видит сообщение и может повторить отправку по той же ссылке, пока токен действует.
- `POST /api/reservations` не имеет rate limiting/CAPTCHA; публичные запросы могут создавать лишние записи и SMTP-уведомления.

### Deployment/storage

- Menu/gallery admin writes JSON и media прямо в локальную файловую систему.
- News-текст, переводы, SEO/GEO и publish state хранятся в PostgreSQL. News-обложки используют выбранный `NEWS_STORAGE_DRIVER`.
- Временный `local` режим работает только на hosting с постоянным writable filesystem; для serverless/immutable hosting нужен `s3`.
- На serverless/immutable/ephemeral hosting локальные записи menu/gallery всё ещё могут исчезнуть, не реплицироваться между instances или завершиться ошибкой.
- Запись JSON не защищена lock/transaction; одновременные admin requests могут потерять обновления.

### Качество и сопровождение

- Автоматических unit/integration/e2e тестов и test script нет.
- README частично устарел.
- Логика DE/EN страниц и JSON-LD местами дублируется.
- `data/gallery.json` и загруженные gallery assets отслеживаются Git, а `data/menu.json` сейчас отсутствует.
- У upload API галереи нет явного общего лимита размера файла, только лимит количества.
- Best-effort удаление news objects может оставить orphan при недоступном storage; ошибка логируется и не откатывает уже сохранённую БД-транзакцию.
- Prisma CLI закрепляет версии `deepmerge-ts` и `mysql2` с опубликованными advisories. Локальные npm `overrides` устраняют предупреждения аудита, но `deepmerge-ts` повышен на major-версию внутри Prisma; после обновления Prisma повторно проверить CLI-команды и убрать overrides, когда upstream исправит зависимости.

## Проверенный baseline

Дата последней полной проверки: **2026-09-26**.

- `npm ci`, `npm run lint`, `npm run build` и `npm audit --omit=dev`: проходят; аудит показывает 0 уязвимостей.
- Next.js build: 43 статически генерируемые page/asset route; news, admin и API routes динамические.
- В Datenschutz-компоненте `H2`, `H3`, `P` объявлены вне render; изображения lightbox и Google-аватаров используют `next/image` с `unoptimized` для уже подготовленных или внешних изображений.
- Обновление зависимостей выполнялось поверх незавершённых изменений меню и медиа в рабочем дереве; они сохранены.

Lint и build остаются отдельными обязательными проверками. Визуальная desktop/mobile проверка после этих изменений не выполнена: браузер в текущей среде недоступен.

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

- **2026-10-02** — публичная форма и API не принимают прошлые дату/время и слоты вне обычных рабочих часов `Europe/Berlin`; добавлена защищённая DE/RU админ-панель бронирований с поиском, просмотром, правкой, подтверждением, отменой, неявкой и уведомлениями. Вход в админку ведёт к броням; резервные admin credentials удалены. При правке адреса подтверждённой брони версия токена отмены увеличивается, старый линк перестаёт действовать; миграция применена к выбранной Neon-БД. Проверки: Prisma generate, lint, build (49/49), migrate status, интеграционный API-тест с вымышленными записями и отключённым SMTP (auth, прошедшее время, закрытые дни/часы, действия и смена токена), тестовые записи и скрипт удалены; встроенный браузер недоступен, визуальная проверка desktop/mobile не выполнена.
- **2026-10-01** — после проверки пользователем доставки подтверждения гостю добавлена отмена подтверждённой брони по отдельной кнопке в DE/EN письме: необязательная причина, срок до 24 часов перед началом по `Europe/Berlin`, атомарный статус `CANCELLED`, письма менеджеру и гостю с повторной отправкой при сбое. Добавочная миграция применена к выбранной Neon-БД; production-код не развёрнут. Проверки: Prisma generate, lint, production build (47/47), летняя/зимняя граница срока, API на вымышленных заявках без реального SMTP (неверный токен, просроченная отмена, сохранение причины, повтор, noindex страницы), тестовые записи и скрипт удалены.
- **2026-10-01** — исправлено повторное чтение fragment-токена на странице подтверждения: React dev Strict Mode повторно запускал эффект после удаления fragment из URL, из-за чего действующая ссылка показывала `invalid_link` без POST. Fragment больше не удаляется при загрузке, повторный запуск эффекта безопасен; повторное открытие письма позволяет продолжить подтверждение. При разборе проблемы в общей БД были пять `PENDING` заявок и ноль принятых SMTP писем о подтверждении. Проверки: `npm run lint`, production build (45/45), `git diff --check`; подтверждение реальной заявки и письмо гостю ожидают проверки пользователем.
- **2026-10-01** — по приложенному dev-логу выявлена блокировка Next.js dev-ресурсов для локального IP подтверждения; из-за отсутствия клиентской гидратации кнопка на странице не появлялась и POST подтверждения не отправлялся. `next.config.ts` разрешает только private host из `RESERVATION_CONFIRM_DEV_URL` через `allowedDevOrigins`; до гидратации страница теперь явно показывает загрузку ссылки. Проверки: все четыре заявки в БД остались `PENDING` без отметки письма, HTTP с LAN host вернул 200 для страницы и клиентского скрипта, POST с неверным токеном ответил 400, `npm run lint`, production build (45/45), `git diff --check`; браузерный инструмент недоступен, визуальная проверка не выполнена.
- **2026-10-01** — после сохранения `PENDING` заявки гостю отправляется DE/EN письмо о получении и ожидании подтверждения, API возвращает отдельный статус гостевого уведомления, форма сообщает о сбое каждой стороны. Для локальной проверки с телефона добавлен dev-only `RESERVATION_CONFIRM_DEV_URL`; в production ссылка остаётся на публичном домене. Проверки: `npm run lint`, production build (45/45), шаблоны DE/EN и формирование локальной/публичной ссылки с подменённым SMTP, локальный POST с вымышленными данными (201, оба статуса уведомления, `PENDING`), тестовая строка удалена, `git diff --check`.
- **2026-10-01** — добавлены подписанная ссылка в письме менеджеру, страница с явным подтверждением бронирования, переход `PENDING → CONFIRMED`, письмо гостю на DE/EN и повторная отправка при SMTP-сбое; новый API/страница закрыты от индексации и GET не изменяет статус. Nullable поля учёта письма добавлены миграцией и применены к общей Neon-БД; production-код не выкладывался. Проверки: `npm run db:generate`, `npm run lint`, production build (45/45), `prisma migrate status`, `git diff --check`; интеграционные тесты с вымышленными заявками проверили GET без изменения статуса, отказ неверного и просроченного токена, подтверждение, отказ SMTP, повторный клик без второй отправки и удаление тестовых строк.
- **2026-10-01** — в локальном `.env` исправлены адрес отправителя уведомлений и список получателей через запятую; тестовый SMTP-вызов принят сервером для двух получателей без отказов. Проверки: `npm run lint`, production build (43/43), `git diff --check`. Значения адресов и секретов в документацию не добавлены.
- **2026-10-01** — по выбору пользователя локальное тестирование бронирований переключено на единственный `.env` с общей Neon-БД; миграция `20261001190000_add_reservations` успешно применена через `prisma migrate deploy`. Временный `.env.local` и скрипт локальной БД удалены, локальный PostgreSQL остановлен. Проверки: `prisma migrate status` (схема актуальна), `npm run lint`, production build (43/43), `git diff --check`. Деплой кода оставлен пользователю; до него для заявок допустимы только вымышленные данные из-за старого публичного GET.
- **2026-10-01** — подготовлены SMTP-уведомления о новых заявках через Nodemailer, безопасный status ответа при сбое почты, серверная проверка данных и защита `GET /api/reservations` admin cookie; исправлена обработка `9+`, добавлены placeholders почтовых env и миграция отсутствовавшей таблицы. Локальный SMTP verify и интеграционный POST проверены: Hostinger принял тестовое письмо, заявка `PENDING` сохранилась и была удалена; затем пустая общая Neon-БД возвращена к исходной схеме, миграция остаётся pending до совместного деплоя кода и БД. Проверки: `npm run lint`, production build (43/43), `npm audit --omit=dev` (0), `git diff --check`; production-код не развёрнут по просьбе пользователя.
- **2026-10-01** — опубликованная Halloween-статья DE/EN уточнена под локальные запросы о ресторане, ужине и бронировании 31 октября; добавлены ответы о времени, обычном меню и подтверждении заявки, исправлены разорванные запятыми `keyFacts` для GEO/AI. Проверки: production admin API сохранил обе локали, публичные страницы HTTP 200 с актуальными title/canonical/hreflang/NewsArticle и четырьмя фактами, ссылка из `/news`, sitemap и robots проверены; `npm run lint` и production build (43/43) проходят.
- **2026-10-01** — через production admin API опубликована двуязычная статья `/news/halloween-2026-neue-liebe-nebra` и `/en/news/halloween-2026-neue-liebe-nebra` о Хэллоуине 31 октября 2026 года и бронировании столиков; созданная иллюстративная обложка сохранена в `public/uploads/news` в WebP 1600×900 и 900×675. Проверки: публичные DE/EN страницы и списки новостей (HTTP 200), оба файла обложки (HTTP 200, размеры), sitemap, `npm run lint`, production build (43/43), `git diff --check`; временный скрипт публикации удалён.
- **2026-09-27** — в карточках меню убраны видимые значки play/pause; прозрачная кнопка поверх изображения сохраняет запуск и остановку видео по нажатию, DE/EN `aria-label`, клавиатурный фокус и остановку предыдущего ролика. Область нажатия выровнена с фото на ширине до 768 px. Проверки: полный lint и production build (43/43) проходят; визуальная браузерная проверка недоступна.
- **2026-09-27** — ссылка SaaleWeb в DE/EN футере дополнена UTM-метками источника, типа перехода и размещения; целевой URL проверен HTTP HEAD (200, параметры сохранены). Проверки: `npm run lint`, production build (43/43), итоговый `href` в DE/EN HTML и `git diff --check`.
- **2026-09-26** — исправлены 41 ошибка `react-hooks/static-components` в Datenschutz и два предупреждения `<img>` в галерее/отзывах; для зависимостей Prisma CLI добавлены точечные overrides `deepmerge-ts` 8.0.2 и `mysql2` 3.24.4. Проверки: `npm ci`, полный lint, production build (43/43) и `npm audit --omit=dev` проходят с 0 уязвимостей; браузерная desktop/mobile проверка недоступна в текущей среде.
- **2026-09-26** — обновлены стабильные совместимые версии Next.js 16.3.6, React 19.3.0, Prisma 7.10.0, TypeScript 6.0.2, Tailwind 4.3.3, ESLint 9.39.5 и прочих прямых зависимостей; обновлены lockfile, README и комментарий Prisma schema. Проверки: `npm ci`, `npm run build` (43/43), `prisma validate`, WebP-конвертация `sharp` проходят; полный lint сохраняет прежние 41 ошибку Datenschutz и 2 предупреждения `<img>`; `npm audit --omit=dev` показывает 4 high advisories в зависимостях Prisma CLI.
- **2026-09-26** — состояние активного видео меню перенесено на уровень `MenuSection`: запуск следующей карточки останавливает предыдущую, повторное нажатие и смена категории возвращают постер. Проверки: scoped ESLint и production build проходят (43/43 статических маршрута); полный lint сохраняет прежние 41 ошибку Datenschutz и 2 предупреждения `<img>`. Браузерная проверка недоступна в текущей среде.
- **2026-09-26** — новые медиа блюд из `public/temp` преобразованы в 21 WebM и 22 пары адаптивных WebP; заменены фото статического меню и 17 фото полной галереи, в DE/EN меню добавлено воспроизведение видео по нажатию с циклом и остановкой. Проверено: 21 WebM полностью декодируется без ошибок, 44 WebP читаются, production build собрал 43/43 маршрута, scoped ESLint и `tsc --noEmit` проходят; полный lint сохраняет прежние 41 ошибку Datenschutz и 2 предупреждения `<img>`. Браузерная проверка не выполнена: браузер в текущей среде недоступен.
- **2026-06-25** — атрибуция SaaleWeb расширена для прозрачности и AI/GEO: footer-credit изменён на `Werbung · Webentwicklung: SaaleWeb` с `rel="sponsored"`, в DE/EN Impressum добавлен блок технической реализации, `WebSite.creator` в JSON-LD указывает Organization SaaleWeb, а `llms.txt` фиксирует связь разработчика с сайтом. Проверено: scoped ESLint и `tsc --noEmit` проходят, production build успешно собрал 43/43 маршрута, итоговый HTML и `/llms.txt` содержат требуемую атрибуцию. Полный lint сохраняет прежний baseline: 41 ошибка `react-hooks/static-components` в `app/datenschutz/DatenschutzClient.tsx` и 2 предупреждения `no-img-element`.
- **2026-06-25** — в нижнюю строку Footer рядом с Impressum/Datenschutz добавлена локализованная рекламная ссылка `Webentwicklung: SaaleWeb` на `https://saaleweb.de/`; ссылка открывается в новой вкладке, а группа адаптирована для переноса на мобильных экранах. Проверки: scoped ESLint и `tsc --noEmit` успешно; production build успешно; полный lint сохранил прежние 41 error и 2 warning.
- **2026-06-25** — mobile-отображение news-обложек адаптировано под исходные постеры 16:9: статья и карточки больше не переключаются на 4:3/16:10 на узких экранах, поэтому боковые части изображения не обрезаются. Проверки: реальные desktop-варианты подтверждены как 1600x900; scoped ESLint и `tsc --noEmit` успешно; production build успешно; полный lint сохранил прежние 41 error и 2 warning.
- **2026-06-25** — поле news-обложки в админке дополнено рекомендацией исходного размера `1600x900+`, указанием автоматической WebP-конвертации в desktop/mobile варианты и предварительным просмотром выбранной или текущей обложки; preview показывает имя, размер файла и фактическое разрешение, выбранный файл можно убрать до сохранения. Проверки: scoped ESLint и `tsc --noEmit` успешно; production build успешно; полный lint сохранил прежние 41 error и 2 warning.
- **2026-06-25** — среда добавлена как рабочий день: график синхронно обновлён на `среда–суббота 15:00–23:00`, `воскресенье 10:00–16:00`, `понедельник–вторник закрыто` в DE/EN UI, Footer, FAQ, Restaurant JSON-LD и `llms.txt`. Проверки: старые формулировки больше не найдены; scoped ESLint и `tsc --noEmit` успешно; production build успешно; полный lint сохранил прежние 41 error и 2 warning.
- **2026-06-24** — добавлен временный `NEWS_STORAGE_DRIVER=local`: `lib/news-media-storage.ts` переключает news-обложки между локальным `public/uploads/news` и S3, сохраняет backend-aware managed keys и очищает файлы при замене, удалении или ошибке БД. Рабочий `.env` и безопасный `.env.example` настроены на `local`; admin UI показывает активный локальный режим. Проверки: scoped ESLint и `tsc --noEmit` успешно; production build успешно; end-to-end admin API тест вошёл в админку, создал draft с PNG, сформировал два WebP, проверил локальные URL/keys и удалил запись вместе с обоими файлами; полный lint сохранил прежние 41 error и 2 warning.
- **2026-06-24** — news-обложки перенесены с локальной файловой системы на AWS S3/S3-compatible object storage: добавлен `lib/object-storage.ts`, immutable WebP upload, public URL generation, managed object keys, cleanup при замене/удалении и компенсационное удаление при ошибке БД; Prisma получил nullable `coverImageKey`/`coverImageMobileKey`, миграция `20260624003000_add_news_cover_object_keys` применена к настроенной БД. Admin UI показывает состояние конфигурации storage, `next.config.ts` разрешает remote images из `OBJECT_STORAGE_PUBLIC_URL`, `.env.example` очищен до placeholders и разрешён в Git. Проверки: Prisma validate/generate/migrate/status успешно; scoped ESLint и `tsc --noEmit` успешно; production build успешно; полный lint сохранил прежние 41 error и 2 warning. Live upload не запускался, потому что object-storage credentials в текущем environment не заданы.
- **2026-06-23** — news persistence перенесён с Markdown-файлов на PostgreSQL/Prisma: добавлены `NewsPost`, `NewsTranslation`, `NewsLocale`, cascade relation, уникальность локали и миграция `20260623235000_add_news_posts`; Markdown теперь хранится как `TEXT`, а DE/EN создаются и обновляются одной транзакцией. Миграция применена к настроенной БД. Проверки: Prisma validate/generate/status успешно; production build успешно; production CRUD-тест создал запись с двумя переводами, транзакционно переименовал slug, проверил DE/EN/JSON-LD/sitemap и каскадно удалил тестовые данные.
- **2026-06-23** — немецкая локализация news-модуля приведена к слову `Nachrichten` во всех пользовательских местах: header/footer navigation, public metadata и заголовки, breadcrumbs, admin UI, default category и `llms.txt`; английская локаль сохраняет `News`, технические URL `/news` не изменены.
- **2026-06-23** — добавлен двуязычный Markdown news-модуль: `/news`, `/en/news`, динамические article routes, `/admin/news`, защищённый CRUD API, WebP-обложки, SEO metadata, `NewsArticle`/Restaurant/Breadcrumb/Speakable JSON-LD, dynamic sitemap и навигация; Next.js обновлён с 16.2.3 до security patch 16.2.9. Проверки: `tsc --noEmit` успешно; production build успешно; end-to-end production test успешно создал, отрендерил DE/EN, проверил JSON-LD/sitemap и удалил временную новость; lint сохранил только прежние 41 error и 2 warning.
- **2026-06-23** — добавлен `public/llms.txt`, доступный как `/llms.txt`; зафиксированы проверенные сведения о ресторане, инструкции для AI и curated DE/EN links по формату llms.txt. Проверки: Markdown-структура и ссылки сверены с публичными routes; production build успешно; локальный production server вернул `200` и `Content-Type: text/plain; charset=UTF-8`.
- **2026-06-23** — создан корневой `AGENTS.md`; зафиксированы архитектура, маршруты, источники данных, env-контракт, deployment/security risks и исходный build/lint baseline. Проверки: `npm run build` успешно; `npm run lint` завершился с 41 error и 2 warning, описанными выше.
