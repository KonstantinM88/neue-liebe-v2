import type { FaqItem } from '@/components/FaqSection'
import type { SiteLocale } from '@/lib/site-locale'

export type PageFaqKey =
  | 'about'
  | 'experience'
  | 'menu'
  | 'gallery'
  | 'events'
  | 'reviews'
  | 'contact'

type PageFaqContent = {
  eyebrow: string
  title: string
  lead: string
  items: FaqItem[]
}

const PAGE_FAQ_CONTENT: Record<PageFaqKey, Record<SiteLocale, PageFaqContent>> = {
  about: {
    de: {
      eyebrow: 'Häufige Fragen',
      title: 'Fragen zur Neuen Liebe und unserem Konzept',
      lead:
        'Diese Fragen greifen typische Suchanliegen rund um Restaurant, Geschichte, Küche und Atmosphäre der Neuen Liebe in Nebra (Unstrut) auf.',
      items: [
        {
          question: 'Was macht die Neue Liebe in Nebra besonders?',
          answer:
            'Neue Liebe verbindet regionale Küche, eine stilvolle Atmosphäre und einen gastfreundlichen Service zu einem Restaurantkonzept, das sowohl für den Alltag als auch für besondere Anlässe funktioniert.',
        },
        {
          question: 'Ist die Neue Liebe ein Restaurant mit regionalem Bezug?',
          answer:
            'Ja. Die Küche orientiert sich bewusst an regionalen Klassikern und ergänzt diese durch moderne Akzente, damit vertraute Gerichte hochwertig und zeitgemäß wirken.',
        },
        {
          question: 'Kann man die Neue Liebe auch für Feiern und Events kennenlernen?',
          answer:
            'Ja. Neben dem normalen Restaurantbesuch gehören Terrasse, Veranstaltungen und Feiermöglichkeiten zum Profil der Neuen Liebe, sodass Gäste den Ort auf unterschiedliche Weise erleben können.',
        },
      ],
    },
    en: {
      eyebrow: 'Frequently Asked Questions',
      title: 'Questions about Neue Liebe and Our Concept',
      lead:
        'These questions address common search intentions around the restaurant, its story, cuisine and atmosphere in Nebra (Unstrut).',
      items: [
        {
          question: 'What makes Neue Liebe in Nebra special?',
          answer:
            'Neue Liebe combines regional cuisine, a refined atmosphere and warm service into a restaurant concept that works for everyday dining as well as special occasions.',
        },
        {
          question: 'Is Neue Liebe a restaurant with a regional identity?',
          answer:
            'Yes. The cuisine is intentionally rooted in regional classics and complements them with modern accents so that familiar dishes feel contemporary and elevated.',
        },
        {
          question: 'Can guests also experience Neue Liebe through celebrations and events?',
          answer:
            'Yes. Beyond regular dining, the terrace, events and celebration options are part of the Neue Liebe profile, allowing guests to discover the place in different ways.',
        },
      ],
    },
  },
  experience: {
    de: {
      eyebrow: 'FAQ Erlebnisse',
      title: 'Fragen zu Terrasse, Saal und Eventabenden',
      lead:
        'Die Erlebnis-Seite beantwortet typische Fragen zu den Bereichen, die Gäste bei der Neuen Liebe besonders suchen.',
      items: [
        {
          question: 'Welche Erlebnisbereiche bietet die Neue Liebe?',
          answer:
            'Zur Neuen Liebe gehören eine Sommerterrasse, ein eleganter Bankettsaal und Eventabende mit Musik und Tanz. Dadurch geht das Angebot über einen klassischen Restaurantbesuch hinaus.',
        },
        {
          question: 'Ist die Terrasse der Neuen Liebe auch für entspannte Abendbesuche gedacht?',
          answer:
            'Ja. Die Terrasse ist besonders für Gäste geeignet, die in den warmen Monaten eine ruhige und stimmungsvolle Atmosphäre im Freien suchen.',
        },
        {
          question: 'Eignet sich der Bankettsaal für private und geschäftliche Anlässe?',
          answer:
            'Ja. Der Saal ist sowohl für Familienfeste und Hochzeiten als auch für Firmenveranstaltungen und andere organisierte Anlässe gedacht.',
        },
      ],
    },
    en: {
      eyebrow: 'Experience FAQ',
      title: 'Questions about the Terrace, Hall and Event Evenings',
      lead:
        'The experiences page answers common questions about the areas guests are most interested in at Neue Liebe.',
      items: [
        {
          question: 'What experience areas does Neue Liebe offer?',
          answer:
            'Neue Liebe includes a summer terrace, an elegant banquet hall and event evenings with music and dancing. This makes the venue more than a classic restaurant visit.',
        },
        {
          question: 'Is the terrace suitable for relaxed evening visits?',
          answer:
            'Yes. The terrace is especially suited to guests looking for a calm and atmospheric outdoor setting during the warmer months.',
        },
        {
          question: 'Is the banquet hall suitable for private and business occasions?',
          answer:
            'Yes. The hall is intended for family celebrations and weddings as well as corporate events and other organized occasions.',
        },
      ],
    },
  },
  menu: {
    de: {
      eyebrow: 'FAQ Speisekarte',
      title: 'Fragen zu Gerichten, Auswahl und Reservierung',
      lead:
        'Die Menü-Seite soll nicht nur Gerichte zeigen, sondern auch typische Fragen zur Küchenrichtung und zum Besuch beantworten.',
      items: [
        {
          question: 'Welche Art von Speisen bietet die Neue Liebe an?',
          answer:
            'Die Speisekarte umfasst Vorspeisen, Hauptgerichte, Klassiker, Burger, Steaks sowie Bier und Drinks. Der Schwerpunkt liegt auf zugänglicher Küche mit regionalem Bezug.',
        },
        {
          question: 'Gibt es auf der Speisekarte sowohl Klassiker als auch modernere Optionen?',
          answer:
            'Ja. Neben traditionellen und beliebten Hausgerichten finden sich auf der Karte auch Burger, Steakgerichte und weitere Optionen für unterschiedliche Vorlieben.',
        },
        {
          question: 'Kann ich vor dem Essen direkt über die Seite zur Reservierung wechseln?',
          answer:
            'Ja. Die Menü-Seite ist direkt mit der Reservierung verbunden, damit Gäste nach dem Blick auf Speisen und Preise ohne Umwege einen Tisch anfragen können.',
        },
      ],
    },
    en: {
      eyebrow: 'Menu FAQ',
      title: 'Questions about Dishes, Selection and Reservations',
      lead:
        'The menu page is designed not only to show dishes, but also to answer common questions about the cuisine and the visit itself.',
      items: [
        {
          question: 'What kind of food does Neue Liebe offer?',
          answer:
            'The menu includes starters, main courses, classics, burgers, steaks as well as beer and drinks. The focus is on approachable cuisine with a regional character.',
        },
        {
          question: 'Does the menu include both classics and more modern options?',
          answer:
            'Yes. Alongside traditional and popular house dishes, the menu also includes burgers, steak dishes and other options for different preferences.',
        },
        {
          question: 'Can I move directly from the menu page to a reservation?',
          answer:
            'Yes. The menu page is linked directly to reservations, so guests can request a table immediately after looking through the dishes and prices.',
        },
      ],
    },
  },
  gallery: {
    de: {
      eyebrow: 'FAQ Galerie',
      title: 'Fragen zu Bildern, Eindrücken und Atmosphäre',
      lead:
        'Die Galerieseite hilft Gästen, vor dem ersten Besuch einen möglichst realistischen Eindruck von Neue Liebe zu gewinnen.',
      items: [
        {
          question: 'Zeigt die Galerie echte Eindrücke aus der Neuen Liebe?',
          answer:
            'Ja. Die Galerie bündelt Bilder aus Restaurant, Küche, Terrasse und Veranstaltungsbereichen, damit Gäste die Atmosphäre vor dem Besuch einschätzen können.',
        },
        {
          question: 'Finde ich in der Galerie auch Bilder von Events und Feiern?',
          answer:
            'Ja. Neben klassischen Restaurantmotiven enthält die Galerie auch Eindrücke von Veranstaltungen, Feiern und besonderen Momenten im Haus.',
        },
        {
          question: 'Ist die Galerie auch für mobile Besucher optimiert?',
          answer:
            'Ja. Die Seite ist so aufgebaut, dass Bilder auf mobilen Geräten und Desktop klar dargestellt werden und als visueller Einstieg in das Haus funktionieren.',
        },
      ],
    },
    en: {
      eyebrow: 'Gallery FAQ',
      title: 'Questions about Images, Impressions and Atmosphere',
      lead:
        'The gallery page helps guests build a realistic impression of Neue Liebe before their first visit.',
      items: [
        {
          question: 'Does the gallery show real impressions from Neue Liebe?',
          answer:
            'Yes. The gallery brings together images from the restaurant, kitchen, terrace and event areas so guests can judge the atmosphere before visiting.',
        },
        {
          question: 'Will I also find images of events and celebrations?',
          answer:
            'Yes. In addition to classic restaurant scenes, the gallery also includes impressions from events, celebrations and memorable moments at the venue.',
        },
        {
          question: 'Is the gallery optimized for mobile visitors as well?',
          answer:
            'Yes. The page is structured so that images are presented clearly on both mobile devices and desktop and serve as a visual introduction to the venue.',
        },
      ],
    },
  },
  events: {
    de: {
      eyebrow: 'FAQ Events',
      title: 'Fragen zu Feiern, Hochzeiten und Firmenveranstaltungen',
      lead:
        'Die Event-Seite beantwortet die wichtigsten Fragen für Gäste, die eine Feier oder Veranstaltung in Nebra planen.',
      items: [
        {
          question: 'Für welche Anlässe eignet sich die Neue Liebe als Eventlocation?',
          answer:
            'Die Neue Liebe eignet sich für Hochzeiten, Firmenfeiern, Geburtstage, Tanzabende und weitere private oder geschäftliche Anlässe mit gastronomischer Begleitung.',
        },
        {
          question: 'Kann ich sowohl private als auch geschäftliche Events anfragen?',
          answer:
            'Ja. Das Eventangebot richtet sich an private Feiern ebenso wie an Firmenveranstaltungen und organisiert geplante Abende in einem stilvollen Rahmen.',
        },
        {
          question: 'Gehört zur Eventlocation auch die passende kulinarische Begleitung?',
          answer:
            'Ja. Ein wesentlicher Teil des Angebots ist die Verbindung aus Raum, Atmosphäre und Küche, damit Veranstaltungen nicht nur organisatorisch, sondern auch gastronomisch überzeugen.',
        },
      ],
    },
    en: {
      eyebrow: 'Events FAQ',
      title: 'Questions about Celebrations, Weddings and Corporate Events',
      lead:
        'The events page answers the most important questions for guests planning a celebration or event in Nebra.',
      items: [
        {
          question: 'What occasions is Neue Liebe suitable for as an event venue?',
          answer:
            'Neue Liebe is suitable for weddings, corporate events, birthdays, dance evenings and other private or business occasions with culinary support.',
        },
        {
          question: 'Can I enquire about both private and business events?',
          answer:
            'Yes. The event offering is designed for private celebrations as well as corporate functions and organized evenings in a stylish setting.',
        },
        {
          question: 'Does the event venue include an appropriate culinary concept?',
          answer:
            'Yes. An essential part of the offering is the combination of space, atmosphere and cuisine so that events are convincing not only organizationally, but also gastronomically.',
        },
      ],
    },
  },
  reviews: {
    de: {
      eyebrow: 'FAQ Bewertungen',
      title: 'Fragen zu Gäste-Stimmen und Erfahrungsberichten',
      lead:
        'Die Bewertungsseite hilft neuen Gästen dabei, Rückmeldungen besser einzuordnen und Vertrauen vor einer Reservierung aufzubauen.',
      items: [
        {
          question: 'Welche Art von Bewertungen zeigt die Seite?',
          answer:
            'Die Seite bündelt ausgewählte Gäste-Stimmen zur Atmosphäre, Küche und zum Service und verweist zusätzlich auf die externen Google-Bewertungen der Neuen Liebe.',
        },
        {
          question: 'Warum sind Bewertungen für die Restaurantwahl wichtig?',
          answer:
            'Bewertungen geben einen realistischen Eindruck davon, wie Gäste ihren Besuch erlebt haben. Gerade vor einer Reservierung helfen sie dabei, Vertrauen aufzubauen und Erwartungen besser einzuordnen.',
        },
        {
          question: 'Kann ich auch die vollständigen Bewertungen bei Google ansehen?',
          answer:
            'Ja. Auf der Seite gibt es einen direkten Link zu den Google-Bewertungen, sodass Gäste sich bei Bedarf selbst ein umfassenderes Bild machen können.',
        },
      ],
    },
    en: {
      eyebrow: 'Reviews FAQ',
      title: 'Questions about Guest Feedback and Experiences',
      lead:
        'The reviews page helps new guests interpret feedback more clearly and build trust before making a reservation.',
      items: [
        {
          question: 'What kind of reviews does the page show?',
          answer:
            'The page brings together selected guest feedback about the atmosphere, cuisine and service and also links to Neue Liebe’s external Google reviews.',
        },
        {
          question: 'Why are reviews important when choosing a restaurant?',
          answer:
            'Reviews provide a realistic impression of how guests experienced their visit. Especially before making a reservation, they help build trust and set expectations more clearly.',
        },
        {
          question: 'Can I also read the full reviews on Google?',
          answer:
            'Yes. The page includes a direct link to the Google reviews so guests can build a broader picture if they want to.',
        },
      ],
    },
  },
  contact: {
    de: {
      eyebrow: 'FAQ Kontakt',
      title: 'Fragen zu Adresse, Erreichbarkeit und Anfahrt',
      lead:
        'Die Kontaktseite beantwortet die wichtigsten praktischen Fragen für Gäste, die ihren Besuch in Nebra planen.',
      items: [
        {
          question: 'Wo befindet sich die Neue Liebe?',
          answer:
            'Die Neue Liebe befindet sich in der Wetzendorfer Straße 10 in 06642 Nebra (Unstrut) in Deutschland und ist damit klar als lokales Restaurant in der Region auffindbar.',
        },
        {
          question: 'Wie kann ich die Neue Liebe direkt kontaktieren?',
          answer:
            'Für eine schnelle Kontaktaufnahme steht die Telefonnummer 034461 599804 zur Verfügung. Zusätzlich hilft die Kontaktseite mit Adresse, Karte und Reservierungsoption weiter.',
        },
        {
          question: 'Wann hat das Restaurant Neue Liebe geöffnet?',
          answer:
            'Wir sind Donnerstag bis Samstag von 15:00 bis 23:00 Uhr sowie sonntags von 10:00 bis 16:00 Uhr für Sie da. Montag bis Mittwoch haben wir Ruhetag.',
        },
        {
          question: 'Können Events auch außerhalb der Öffnungszeiten stattfinden?',
          answer:
            'Ja, für Hochzeiten, Firmenfeiern oder große Familienfeste öffnen wir nach Absprache gerne exklusiv an unseren Ruhetagen oder außerhalb der regulären Zeiten.',
        },
      ],
    },
    en: {
      eyebrow: 'Contact FAQ',
      title: 'Questions about Address, Accessibility and Directions',
      lead:
        'The contact page answers the main practical questions for guests planning their visit in Nebra.',
      items: [
        {
          question: 'Where is Neue Liebe located?',
          answer:
            'Neue Liebe is located at Wetzendorfer Straße 10, 06642 Nebra (Unstrut), Germany, making it clearly discoverable as a local restaurant in the region.',
        },
        {
          question: 'How can I contact Neue Liebe directly?',
          answer:
            'For quick contact, the phone number 034461 599804 is available. The contact page also helps with the address, map and reservation path.',
        },
        {
          question: 'When is Restaurant Neue Liebe open?',
          answer:
            'We are open for you from Thursday to Saturday between 15:00 and 23:00, and on Sundays from 10:00 to 16:00. We are closed from Monday to Wednesday.',
        },
        {
          question: 'Can events be hosted outside of regular opening hours?',
          answer:
            'Yes, for weddings, corporate events, or large family celebrations, we are happy to open exclusively on our closed days or outside regular hours by arrangement.',
        },
      ],
    },
  },
}

export function getPageFaqContent(page: PageFaqKey, locale: SiteLocale): PageFaqContent {
  return PAGE_FAQ_CONTENT[page][locale]
}

export function buildFaqPageStructuredData(page: PageFaqKey, locale: SiteLocale, url: string) {
  const faq = getPageFaqContent(page, locale)

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    url,
    inLanguage: locale === 'de' ? 'de-DE' : 'en-US',
    mainEntity: faq.items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: typeof item.answer === 'string' ? item.answer : '',
      },
    })),
  }
}
