export interface NavigationItem {
  label: string
  to: string
}

export interface BiographySection {
  heading: string
  paragraphs: string[]
}

export interface VideoItem {
  title: string
  url: string
}

export interface SiteContent {
  brand: {
    name: string
    shortName: string
    tagline: string
  }
  navigation: NavigationItem[]
  home: {
    title: string
  }
  about: {
    waveText: string
    pageTitle: string
    intro: Pick<BiographySection, 'paragraphs'>
    story: BiographySection
    galleryLabel: string
  }
  resources: {
    eyebrow: string
    heading: string
    introduction: string
    resumeLabel: string
    primaryHeadshotLabel: string
    alternateHeadshotLabel: string
    resumePath: string
  }
  media: {
    eyebrow: string
    heading: string
    videosHeading: string
    videos: VideoItem[]
    performanceGalleryHeading: string
    portraitGalleryHeading: string
  }
  contact: {
    eyebrow: string
    heading: string
    introduction: string
    recipientEmail: string
    displayedEmail: string
    displayedPhone: string
    location: string
    mailSubject: string
  }
  social: {
    instagramUrl: string
    instagramLabel: string
  }
  footer: {
    heading: string
    note: string
  }
  seo: {
    title: string
    description: string
  }
}

/**
 * SITE OWNER: EDIT TEXT AND LINKS IN THIS FILE.
 * Search for REPLACE_ME before publishing. Photos and the resume have their own
 * plain-language instructions in IMAGE_GUIDE.md.
 */
export const siteContent: SiteContent = {
  brand: {
    name: 'Jacqueline Trinh-Juarez',
    shortName: 'Jacqueline',
    // REPLACE_ME: Adjust the professional disciplines if needed.
    tagline: 'Actor · Singer · Dancer · Educator',
  },
  navigation: [
    { label: 'Home', to: '/' },
    { label: 'About', to: '/about' },
    { label: 'Headshot / Resume', to: '/headshot-resume' },
    { label: 'Media', to: '/media' },
    { label: 'Contact', to: '/contact' },
  ],
  home: {
    title: 'Howdy, I’m Jacqueline!',
  },
  about: {
    waveText: 'Howdy!',
    pageTitle: 'About Jacqueline',
    intro: {
      paragraphs: [
        'Howdy, y’all! I’m **Jacqueline Trinh-Juarez**, a **Vietnamese-Mexican** musical theatre performer raised in Austin and Houston, Texas.',
        'I’m now based in **Pittsburgh, Pennsylvania**, earning my BFA in Musical Theatre with a minor in Dance at **Point Park University**. Go Pioneers!',
        'Musical theatre and dance have always been my first loves. Alongside performing, I teach children’s theatre and dance, and I love getting to share that part of my life with kids.',
      ],
    },
    story: {
      heading: 'Beyond the stage',
      paragraphs: [
        'I started out singing in the children’s choir at church and putting on shows for my extended family. There was living-room choreography and, yes, a Hannah Montana wig.',
        'You might also find me “hanging out” with Moana or Silvermist at children’s parties. I’ve taught kids to dance on a mission trip in Honduras, too. Teaching and volunteering with children and communities are a big part of my life outside the theatre.',
        'Offstage, I love cooking, the color pink, and a good glass of lemonade.',
      ],
    },
    galleryLabel: 'About Jacqueline photo gallery',
  },
  resources: {
    eyebrow: 'Press materials',
    heading: 'Headshots & resume',
    introduction:
      'Open any item in a new tab for a closer look, or use its download link to save a copy.',
    resumeLabel: 'Performance resume',
    primaryHeadshotLabel: 'Headshot 1',
    alternateHeadshotLabel: 'Headshot 2',
    resumePath: 'downloads/jacqueline-trinh-juarez-resume.pdf',
  },
  media: {
    eyebrow: 'Watch & explore',
    heading: 'Media',
    videosHeading: 'Performance reels',
    // Video titles and links from the original portfolio's Media page.
    videos: [
      {
        title: 'It won’t be long now — In the Heights',
        url: 'https://www.youtube.com/watch?v=KSnRPCISxHU',
      },
      { title: 'Dance Reel', url: 'https://www.youtube.com/watch?v=36nitiZI8Xs' },
      {
        title: 'Teddy Bear Hound Dog! — Jacqueline Trinh-Juarez & Evan Williams',
        url: 'https://www.youtube.com/watch?v=GzMb1uuKseI',
      },
    ],
    performanceGalleryHeading: 'On stage',
    portraitGalleryHeading: 'Portraits & movement',
  },
  contact: {
    eyebrow: 'Say hello',
    heading: 'Let’s make something lovely!',
    introduction:
      'Tell me about your project. This form opens a draft in your email app, ready for you to review and send.',
    recipientEmail: 'Jackie.trinh.juarez@gmail.com',
    displayedEmail: 'Jackie.trinh.juarez@gmail.com',
    displayedPhone: '512-554-2744',
    location: 'Pittsburgh, PA',
    mailSubject: 'Portfolio inquiry',
  },
  social: {
    instagramUrl: 'https://www.instagram.com/jackie.trinh.juarez/',
    instagramLabel: '@jackie.trinh.juarez',
  },
  footer: {
    heading: 'Let’s chat',
    note: 'Available for performance, creative, and education opportunities.',
  },
  seo: {
    // REPLACE_ME: Review this copy before launch.
    title: 'Jacqueline Trinh-Juarez | Performer',
    description:
      'The performance portfolio of Jacqueline Trinh-Juarez—actor, singer, dancer, and educator.',
  },
}
