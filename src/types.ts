export type Language = 'kn' | 'en';
export type PageType = 'home' | 'about' | 'gallery' | 'seva' | 'contact' | 'privacy' | 'notfound';

export interface Seva {
  id: string;
  name: string;
  price: number;
  description: string;
}

export interface TranslationData {
  templeName: string;
  templeSub: string;
  nav: {
    home: string;
    about: string;
    gallery: string;
    seva: string;
    contact: string;
    privacy: string;
    notfound?: string;
  };
  hero: {
    welcome: string;
    tagline: string;
    ctaSeva: string;
    ctaContact: string;
    timingsTitle: string;
    timingsWeekdays: string;
    timingsSaturdays: string;
    timingSpecial: string;
  };
  about: {
    title: string;
    intro: string;
    description1: string;
    description2: string;
    specialFeatureTitle: string;
    features: {
      title: string;
      desc: string;
    }[];
  };
  historyPreview: {
    title: string;
    subtitle: string;
    desc: string;
    readMore: string;
  };
  gallerySection: {
    title: string;
    subtitle: string;
    captionLamps: string;
    captionPuja: string;
    captionShrine: string;
    captionTemple: string;
  };
  sevaSection: {
    title: string;
    subtitle: string;
    priceLabel: string;
    bookBtn: string;
    cartTitle: string;
    emptyCart: string;
    selectedSevas: string;
    totalAmount: string;
    bookNow: string;
    bookingSuccess: string;
    modalTitle: string;
    fullName: string;
    gotra: string;
    nakshatra: string;
    submitBooking: string;
    closeBtn: string;
  };
  mantraSection: {
    title: string;
    subtitle: string;
    instruction: string;
    chantLabel: string;
    translationLabel: string;
    benefitLabel: string;
    playChant: string;
    stopChant: string;
  };
  contactSection: {
    title: string;
    subtitle: string;
    formTitle: string;
    addressLabel: string;
    address: string;
    phoneLabel: string;
    phones: string[];
    emailLabel: string;
    email: string;
    mapLabel: string;
    mapInstructions: string;
    placeholderName: string;
    placeholderEmail: string;
    placeholderPhone: string;
    placeholderMessage: string;
    submitForm: string;
    formSuccess: string;
  };
  footer: {
    tagline: string;
    rights: string;
    developerCredit: string;
  };
}

export const translations: Record<Language, TranslationData> = {
  kn: {
    templeName: "ಶಾಂತಮೂರ್ತಿ ಶ್ರೀ ಶನೀಶ್ವರ ದೇವಸ್ಥಾನ",
    templeSub: "ಶ್ರೀ ಕ್ಷೇತ್ರ ಹಾಡಿಕೆರೆ",
    nav: {
      home: "ಮುಖಪುಟ",
      about: "ದೇವಸ್ಥಾನದ ಬಗ್ಗೆ",
      gallery: "ಗ್ಯಾಲರಿ",
      seva: "ಸೇವೆಗಳು",
      contact: "ಸಂಪರ್ಕಿಸಿ",
      privacy: "ಗೌಪ್ಯತಾ ನೀತಿ",
      notfound: "ಪುಟ ಕಂಡುಬಂದಿಲ್ಲ"
    },
    hero: {
      welcome: "ಶ್ರೀ ಕ್ಷೇತ್ರ ಹಾಡಿಕೆರೆಗೆ ಸುಸ್ವಾಗತ",
      tagline: "ಶಾಂತಮೂರ್ತಿ ಶ್ರೀ ಶನೀಶ್ವರ ದೇವಸ್ಥಾನ - ನಿಮ್ಮ ಶ್ರದ್ಧೆ, ಭಕ್ತಿ ಮತ್ತು ಆಧ್ಯಾತ್ಮಿಕ ಶಾಂತಿಯ ಪವಿತ್ರ ತಾಣ.",
      ctaSeva: "ಪೂಜಾ ಸೇವೆಗಳು",
      ctaContact: "ಸಂಪರ್ಕಿಸಿ",
      timingsTitle: "ದರ್ಶನದ ಸಮಯ",
      timingsWeekdays: "ಇತರ ದಿನಗಳ ದರ್ಶನ: ಬೆಳಿಗ್ಗೆ 7:00 ರಿಂದ ಮಧ್ಯಾಹ್ನ 1:00 | ಸಂಜೆ 4:30 ರಿಂದ ರಾತ್ರಿ 7:30",
      timingsSaturdays: "ಸೋಮವಾರ ಮತ್ತು ಶನಿವಾರ ವಿಶೇಷ ಪೂಜೆ: ಬೆಳಿಗ್ಗೆ 6:00 ರಿಂದ ರಾತ್ರಿ 8:00 ರವರೆಗೆ ನಿರಂತರ ದರ್ಶನ",
      timingSpecial: "ಪ್ರತಿ ಸೋಮವಾರ ಮತ್ತು ಶನಿವಾರ ಮಧ್ಯಾಹ್ನ ಭಕ್ತಾದಿಗಳಿಗೆ ಅನ್ನದಾಸೋಹ ಪ್ರಸಾದ ವಿನಿಯೋಗವಿರುತ್ತದೆ."
    },
    about: {
      title: "ಕ್ಷೇತ್ರದ ಹಿನ್ನೆಲೆ ಮತ್ತು ಇತಿಹಾಸ",
      intro: "ಉಡುಪಿ ಜಿಲ್ಲೆಯ ಬ್ರಹ್ಮಾವರ ತಾಲೂಕಿನ ಪ್ರಶಾಂತ ಗ್ರಾಮವಾದ 'ಹಾಡಿಕೆರೆ'ಯಲ್ಲಿ ನೆಲೆಸಿರುವ ಶ್ರೀ ಕ್ಷೇತ್ರವು ಅತ್ಯಂತ ಪ್ರಸಿದ್ಧ ಹಾಗೂ ಜಾಗೃತ ಪುಣ್ಯಸ್ಥಳವಾಗಿದೆ.",
      description1: "ಇಲ್ಲಿ ನೆಲೆಸಿರುವ ಶ್ರೀ ಶನೀಶ್ವರ ಸ್ವಾಮಿಯು ತನ್ನ ಉಗ್ರರೂಪವನ್ನು ಮರೆತು, ಪರಮ ಶಾಂತ ಹಾಗೂ ದಯಾಮಯಿ 'ಶಾಂತಮೂರ್ತಿ'ಯಾಗಿ ನೆಲೆಗೊಂಡಿದ್ದಾನೆ. ಈ ಕಾರಣದಿಂದಾಗಿ, ಕ್ಷೇತ್ರಕ್ಕೆ ಬರುವ ಭಕ್ತರು ಭಯದಿಂದಲ್ಲದೆ, ತಾಯಿಯ ಬಳಿ ಬರುವ ಮಗುವಿನಂತೆ ಪ್ರೀತಿ ಹಾಗೂ ಭಕ್ತಿಯಿಂದ ಸ್ವಾಮಿಯನ್ನು ಆರಾಧಿಸುತ್ತಾರೆ.",
      description2: "ದೇವಸ್ಥಾನದ ಪ್ರಮುಖ ಆಕರ್ಷಣೆಯೆಂದರೆ ಶನಿ ದೇವರಿಗೆ ಪ್ರಿಯವಾದ ಎಳ್ಳೆಣ್ಣೆ ದೀಪಗಳ ಆರಾಧನೆ. ಭಕ್ತಾದಿಗಳು ತಮ್ಮ ಜಾತಕದಲ್ಲಿರುವ ಶನಿ ಮಹಾದಶೆ, ಅಷ್ಟಮ ಶನಿ ಅಥವಾ ಸಾಡೇಸಾತಿ ದೋಷಗಳ ನಿವಾರಣೆಗಾಗಿ ಇಲ್ಲಿ ಬಂದು ಎಳ್ಳುಬತ್ತಿ ದೀಪಗಳನ್ನು ಹಚ್ಚಿ, ತೈಲಾಭಿಷೇಕ ಮಾಡಿ ಧನ್ಯರಾಗುತ್ತಾರೆ.",
      specialFeatureTitle: "ಕ್ಷೇತ್ರದ ಮಹತ್ವ ಮತ್ತು ವಿಶೇಷತೆಗಳು",
      features: [
        {
          title: "ಶಾಂತ ಸ್ವರೂಪ ಮೂರ್ತಿ",
          desc: "ಸಾಮಾನ್ಯವಾಗಿ ಶನಿದೇವರು ಉಗ್ರರೂಪಿಯಾಗಿರುತ್ತಾರೆ ಆದರೆ ಹಾಡಿಕೆರೆಯಲ್ಲಿ ಸ್ವಾಮಿಯು ಪ್ರಶಾಂತ ಮುಖಭಾವದ ಶಾಂತಮೂರ್ತಿಯಾಗಿ ಅಭಯ ನೀಡುತ್ತಾನೆ."
        },
        {
          title: "ಎಳ್ಳೆಣ್ಣೆ ದೀಪದ ಆರಾಧನೆ",
          desc: "ಶನಿವಾರದಂದು ಸಾವಿರಾರು ಭಕ್ತರು ಸಾಲಾಗಿ ಎಳ್ಳು ದೀಪಗಳನ್ನು ಹಚ್ಚಿ ತಮ್ಮ ಕಷ್ಟಗಳನ್ನು ನಿವಾರಿಸುವಂತೆ ಪ್ರಾರ್ಥಿಸುತ್ತಾರೆ."
        },
        {
          title: "ಅನ್ನದಾಸೋಹ ಪ್ರಸಾದ",
          desc: "ಪ್ರತಿ ಶನಿವಾರ ಕ್ಷೇತ್ರಕ್ಕೆ ಬರುವ ಸರ್ವ ಭಕ್ತಾದಿಗಳಿಗೆ ಶುಚಿಯಾದ ಮತ್ತು ರುಚಿಕರವಾದ ಅನ್ನಪ್ರಸಾದ ನೀಡಲಾಗುತ್ತದೆ."
        }
      ]
    },
    historyPreview: {
      title: "ಪವಿತ್ರ ಇತಿಹಾಸದ ಸಾರಾಂಶ",
      subtitle: "ಶತಮಾನಗಳ ಇತಿಹಾಸವಿರುವ ಭಕ್ತರ ನಂಬಿಕೆಯ ಜಾಗೃತ ತಾಣ",
      desc: "ಬ್ರಹ್ಮಾವರ ತಾಲೂಕಿನ ಹಾಡಿಕೆರೆ ಎಂಬ ಪುಟ್ಟ ಸುಂದರ ಗ್ರಾಮದಲ್ಲಿ ನೆಲೆಗೊಂಡಿರುವ ಈ ಪುಣ್ಯಕ್ಷೇತ್ರವು ಭಕ್ತರ ಸಕಲ ಕಷ್ಟಗಳನ್ನು ಪರಿಹರಿಸುವ ಪ್ರಸಿದ್ಧ ತಾಣವಾಗಿದೆ. ಇಲ್ಲಿ ಶನಿ ಮಹಾತ್ಮನು ಪರಮ ಶಾಂತ ಹಾಗೂ ಕರುಣಾಮಯಿ ರೂಪದಲ್ಲಿ ಭಕ್ತರಿಗೆ ದರ್ಶನ ನೀಡುತ್ತಾನೆ. ನೂರಾರು ವರ್ಷಗಳ ಪವಿತ್ರ ಇತಿಹಾಸ ಮತ್ತು ಭಕ್ತಿ ಪರಂಪರೆಯು ಇಲ್ಲಿಗೆ ಬರುವ ಪ್ರತಿಯೊಬ್ಬರಿಗೂ ನೆಮ್ಮದಿ ನೀಡುತ್ತದೆ.",
      readMore: "ಕ್ಷೇತ್ರದ ಸಂಪೂರ್ಣ ಇತಿಹಾಸ ತಿಳಿಯಿರಿ ➔"
    },
    gallerySection: {
      title: "ಕ್ಷೇತ್ರದ ದಿವ್ಯ ಛಾಯಾಚಿತ್ರಗಳು",
      subtitle: "ದೇವಸ್ಥಾನದ ಧಾರ್ಮಿಕ ವಿಧಿವಿಧಾನಗಳು, ವಿಶೇಷ ಅಲಂಕಾರಗಳು ಮತ್ತು ಪವಿತ್ರ ಜಾಗೃತಿ ತಾಣದ ಸುಂದರ ನೋಟಗಳು.",
      captionLamps: "ಎಳ್ಳೆಣ್ಣೆ ದೀಪಾರಾಧನೆ - ಭಕ್ತರ ಕಷ್ಟ ಮತ್ತು ಶನಿದೋಷಗಳನ್ನು ನಿವಾರಿಸುವ ಜ್ಯೋತಿಗಳು",
      captionPuja: "ವಿಶೇಷ ಪೂಜಾ ಫಲಕ ಮತ್ತು ಮಹಾಮಂಗಳಾರತಿಯ ಶುಭ ಪ್ರಸಾದ",
      captionShrine: "ಮಹಾಲಂಕಾರ ಮತ್ತು ನೀಲ ಪುಷ್ಪಗಳಿಂದ ಕಂಗೊಳಿಸುತ್ತಿರುವ ಶ್ರೀ ಶಾಂತಮೂರ್ತಿ ಶನೀಶ್ವರ",
      captionTemple: "ಪೂಜ್ಯ ವಾತಾವರಣದಲ್ಲಿ ಕಂಗೊಳಿಸುತ್ತಿರುವ ಐತಿಹಾಸಿಕ ಪವಿತ್ರ ದೇಗುಲ"
    },
    sevaSection: {
      title: "ವಿಶೇಷ ಪೂಜೆಗಳು ಮತ್ತು ಸೇವೆಗಳು",
      subtitle: "ದೇವಸ್ಥಾನದಲ್ಲಿ ಭಕ್ತರ ಹೆಸರಿನಲ್ಲಿ ಕೈಗೊಳ್ಳಬಹುದಾದ ವಿವಿಧ ಪೂಜೆಗಳ ವಿವರಗಳು ಇಲ್ಲಿದೆ. ಭಕ್ತರು ಸೇವೆಗಳನ್ನು ಆಯ್ದುಕೊಂಡು ಕಾಣಿಕೆ ಸಲ್ಲಿಸಬಹುದು.",
      priceLabel: "ಸೇವಾ ಶುಲ್ಕ",
      bookBtn: "ಸೇವೆ ಸೇರಿಸಿ",
      cartTitle: "ಆಯ್ದುಕೊಂಡ ಸೇವೆಗಳು (ಸೇವಾ ರಶೀದಿ)",
      emptyCart: "ಯಾವುದೇ ಸೇವೆಯನ್ನು ಆಯ್ದುಕೊಂಡಿಲ್ಲ. ದಯವಿಟ್ಟು ಮೇಲೆ ನೀಡಿರುವ ಸೇವೆಗಳಲ್ಲಿ ಆಯ್ದುಕೊಳ್ಳಿ.",
      selectedSevas: "ಆಯ್ದುಕೊಂಡ ಸೇವೆಗಳು",
      totalAmount: "ಒಟ್ಟು ಕಾಣಿಕೆ ಮೊತ್ತ",
      bookNow: "ಸಂಕಲ್ಪ ಮತ್ತು ಪ್ರಾರ್ಥನೆ ಸಲ್ಲಿಸಿ",
      bookingSuccess: "ನಿಮ್ಮ ಸೇವಾ ಸಂಕಲ್ಪವನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಸ್ವೀಕರಿಸಲಾಗಿದೆ! ಶನೀಶ್ವರ ಸ್ವಾಮಿಯು ನಿಮಗೆ ಸಕಲ ಸುಖ-ಶಾಂತಿ ನೀಡಲಿ.",
      modalTitle: "ಸೇವಾ ಸಂಕಲ್ಪ ವಿವರಗಳು",
      fullName: "ಪೂರ್ಣ ಹೆಸರು",
      gotra: "ಗೋತ್ರ (ತಿಳಿದಿದ್ದರೆ ಬರೆಯಿರಿ)",
      nakshatra: "ಜನ್ಮ ನಕ್ಷತ್ರ / ರಾಶಿ",
      submitBooking: "ಸಂಕಲ್ಪ ಪೂರ್ಣಗೊಳಿಸಿ",
      closeBtn: "ಮುಚ್ಚಿ"
    },
    mantraSection: {
      title: "ಶ್ರೀ ಶನೀಶ್ವರ ಶಾಂತಿ ಮಂತ್ರಗಳು",
      subtitle: "ನಿಮ್ಮ ಆಂತರಿಕ ಪ್ರಶಾಂತತೆ ಮತ್ತು ಶನಿದೋಷಗಳ ನಿವಾರಣೆಗಾಗಿ ಪ್ರತಿನಿತ್ಯ ಕೇಳಿ ಅಥವಾ ಪಠಿಸಿ.",
      instruction: "ಮಂತ್ರ ಪಠಣದ ಧ್ವನಿಯನ್ನು ಆಲಿಸಲು ಪ್ಲೇ ಬಟನ್ ಒತ್ತಿರಿ",
      chantLabel: "ಮಂತ್ರ ಪಠಣ",
      translationLabel: "ಭಾವಾರ್ಥ",
      benefitLabel: "ಮಂತ್ರದ ಫಲ",
      playChant: "ಮಂತ್ರ ಆಲಿಸಿ",
      stopChant: "ನಿಲ್ಲಿಸಿ"
    },
    contactSection: {
      title: "ಸಂಪರ್ಕ ಮಾಹಿತಿ ಮತ್ತು ವಿಳಾಸ",
      subtitle: "ದೇವಸ್ಥಾನದ ಭೇಟಿ, ವಸತಿ ಅಥವಾ ಪೂಜಾ ವಿವರಗಳಿಗೆ ನಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸಿ",
      formTitle: "ನಿಮ್ಮ ಪ್ರಾರ್ಥನೆ ಅಥವಾ ವಿಚಾರಣೆಗಳನ್ನು ಕಳುಹಿಸಿ",
      addressLabel: "ದೇವಸ್ಥಾನದ ವಿಳಾಸ",
      address: "ಶಾಂತಮೂರ್ತಿ ಶ್ರೀ ಶನೀಶ್ವರ ದೇವಸ್ಥಾನ, ಶ್ರೀ ಕ್ಷೇತ್ರ ಹಾಡಿಕೆರೆ, ಬ್ರಹ್ಮಾವರ ತಾಲ್ಲೂಕು, ಉಡುಪಿ ಜಿಲ್ಲೆ, ಕರ್ನಾಟಕ - 576221",
      phoneLabel: "ದೂರವಾಣಿ ಸಂಖ್ಯೆ",
      phones: ["+91 99022 07990", "+91 87929 78777"],
      emailLabel: "ಇಮೇಲ್ ವಿಳಾಸ",
      email: "shanthamoorthyshaneshwara1995@gmail.com",
      mapLabel: "ಕ್ಷೇತ್ರದ ಮಾರ್ಗ ಸೂಚಿ",
      mapInstructions: "ಹಾಡಿಕೆರೆಯು ಉಡುಪಿ ಜಿಲ್ಲೆಯ ಬ್ರಹ್ಮಾವರ ತಾಲೂಕಿನಲ್ಲಿದೆ. ಬ್ರಹ್ಮಾವರ ಅಥವಾ ಉಡುಪಿಯಿಂದ ಪಬ್ಲಿಕ್ ಬಸ್ಸುಗಳು ಹಾಗೂ ವಾಹನಗಳ ಮೂಲಕ ಸುಲಭವಾಗಿ ಇಲ್ಲಿಗೆ ತಲುಪಬಹುದು.",
      placeholderName: "ನಿಮ್ಮ ಹೆಸರು",
      placeholderEmail: "ನಿಮ್ಮ ಇಮೇಲ್ ವಿಳಾಸ",
      placeholderPhone: "ನಿಮ್ಮ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ",
      placeholderMessage: "ನಿಮ್ಮ ಸಂದೇಶ ಅಥವಾ ಪ್ರಾರ್ಥನೆಯ ವಿವರಗಳು...",
      submitForm: "ಸಂದೇಶ ಕಳುಹಿಸಿ",
      formSuccess: "ಧನ್ಯವಾದಗಳು! ನಿಮ್ಮ ಸಂದೇಶವನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಸ್ವೀಕರಿಸಲಾಗಿದೆ. ಶೀಘ್ರದಲ್ಲೇ ನಿಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸಲಾಗುವುದು."
    },
    footer: {
      tagline: "ಅತ್ಯಂತ ಪ್ರಶಾಂತ ಹಾಗೂ ಕರುಣಾಮಯಿ ಶ್ರೀ ಶನೀಶ್ವರ ಸ್ವಾಮಿಯು ಸರ್ವರಿಗೂ ಶುಭವನ್ನು ತರಲಿ.",
      rights: "© 2026 ಶ್ರೀ ಕ್ಷೇತ್ರ ಹಾಡಿಕೆರೆ ದೇವಸ್ಥಾನ ಸಮಿತಿ. ಎಲ್ಲಾ ಹಕ್ಕುಗಳನ್ನು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ.",
      developerCredit: "ಭಕ್ತಿ ಪೂರ್ವಕ ಸೇವೆ"
    }
  },
  en: {
    templeName: "Shantamurthy Sri Shaneshwara Temple",
    templeSub: "Sri Kshetra Haadikere",
    nav: {
      home: "Home",
      about: "About Temple",
      gallery: "Gallery",
      seva: "Sevas & Poojas",
      contact: "Contact Us",
      privacy: "Privacy Policy",
      notfound: "Page Not Found"
    },
    hero: {
      welcome: "Welcome to Sri Kshetra Haadikere",
      tagline: "Shantamurthy Sri Shaneshwara Temple - A sacred sanctuary of faith, supreme devotion, and spiritual tranquility.",
      ctaSeva: "Explore Sevas",
      ctaContact: "Get Directions",
      timingsTitle: "Darshan Timings",
      timingsWeekdays: "Other Days: 7:00 AM to 1:00 PM | 4:30 PM to 7:30 PM",
      timingsSaturdays: "Monday & Saturday: 6:00 AM to 8:00 PM",
      timingSpecial: "Every Monday and Saturday, special offerings and prasad are served to all devotees."
    },
    about: {
      title: "Temple Sanctuary & Holy History",
      intro: "Nestled in the peaceful village of 'Haadikere' in Brahmavara Taluk, Udupi District, this shrine is an incredibly sacred and spiritually vibrant pilgrimage center.",
      description1: "Here, Lord Shaneshwara is worshipped not in his typical fierce state, but as a deeply serene, benevolent, and merciful deity known as 'Shantamurthy' (the Peaceful One). Due to this unique, calming aura, devotees approach the deity with profound love and devotion rather than fear.",
      description2: "The hallmark of the temple is the burning of sesame oil lamps (Ellu Bathi). Devotees experiencing astrological hardships, particularly Shani Dosha, Ashtama Shani, or Sade Sati, visit this holy shrine to light lamps, offer sesame oil (Tailabhisheka), and pray for relief and mental peace.",
      specialFeatureTitle: "Sacred Signifiances & Offerings",
      features: [
        {
          title: "Serene Benevolent Deity",
          desc: "Unlike the traditionally intense representations, Lord Shani here bestows blessings with an exceptionally calm, smiling, and peaceful countenance."
        },
        {
          title: "Ellu Bathi Lamp Offering",
          desc: "Hundreds of sesame-filled cloth packets are lit simultaneously in iron oil lamps on Saturdays, forming a beautiful glowing river of prayers."
        },
        {
          title: "Annadasoha (Free Food)",
          desc: "A rich tradition of serving delicious, sanctified vegetarian meals to every single pilgrim visiting on holy Saturdays."
        }
      ]
    },
    historyPreview: {
      title: "Sacred History Preview",
      subtitle: "A legacy of faith and relief from sorrows spanning centuries",
      desc: "Situated in the scenic, serene village of Haadikere in Udupi district, this ancient pilgrimage site is revered as a vibrant sanctuary where Lord Shaneshwara resides. Here, he has assumed a remarkably peaceful and compassionate form (Shantamurthy), bestowing solace and mental calmness. The centuries-old traditions practiced here continue to alleviate hardships and guide devotees toward a tranquil life.",
      readMore: "Explore Full Temple History ➔"
    },
    gallerySection: {
      title: "Divine Temple Gallery",
      subtitle: "Explore beautiful snapshots of temple poojas, sesame oil lamp rituals, and the sacred deity blessings.",
      captionLamps: "Sesame Oil Lamps - Lit by devotees to alleviate planetary hardships",
      captionPuja: "Holy Pujas & flower offerings for Saturday Mahapuja",
      captionShrine: "Sri Shantamurthy Shaneshwara in full custom decoration",
      captionTemple: "The historical holy temple shrine of Haadikere"
    },
    sevaSection: {
      title: "Special Poosas and Seva Offerings",
      subtitle: "Select from our traditional sacred offerings. You can choose one or multiple sevas to perform in your family's name and calculate the total contribution.",
      priceLabel: "Seva Fee",
      bookBtn: "Add to Seva List",
      cartTitle: "Your Selected Sevas (Sankalpa Receipt)",
      emptyCart: "No sevas selected yet. Please select from the sevas listed above to initiate a booking.",
      selectedSevas: "Selected Sevas",
      totalAmount: "Total Offering Amount",
      bookNow: "Submit Names for Sankalpa",
      bookingSuccess: "Your Seva Sankalpa has been successfully recorded! May Lord Shantamurthy Sri Shaneshwara bless you and your family with peace and prosperity.",
      modalTitle: "Enter Devotee Details for Sankalpa",
      fullName: "Full Name of Devotee",
      gotra: "Gotra (Clan - if known)",
      nakshatra: "Birth Star / Rashi",
      submitBooking: "Complete Seva Sankalpa",
      closeBtn: "Cancel"
    },
    mantraSection: {
      title: "Sri Shaneshwara Peace Chants",
      subtitle: "Listen to or recite these powerful Vedic verses daily to alleviate difficulties and invite mental tranquility.",
      instruction: "Click the button below to play the ambient spiritual bell and meditative chanting sound.",
      chantLabel: "Sacred Chant",
      translationLabel: "Meaning",
      benefitLabel: "Spiritual Benefit",
      playChant: "Listen to Mantra",
      stopChant: "Stop Audio"
    },
    contactSection: {
      title: "Contact Information & Directions",
      subtitle: "Reach out to the temple committee, chief priest, or plan your pilgrimage seamlessly.",
      formTitle: "Send a Prayer Request or Query",
      addressLabel: "Temple Address",
      address: "Shantamurthy Sri Shaneshwara Temple, Sri Kshetra Haadikere, Brahmavara Taluk, Udupi District, Karnataka - 576221",
      phoneLabel: "Phone Contacts",
      phones: ["+91 99022 07990", "+91 87929 78777"],
      emailLabel: "Email Address",
      email: "shanthamoorthyshaneshwara1995@gmail.com",
      mapLabel: "Pilgrim Route Guide",
      mapInstructions: "Haadikere is located in Brahmavara Taluk, Udupi District. It is easily accessible via road and public transport from Brahmavara or Udupi town, with frequent bus services available.",
      placeholderName: "Your Full Name",
      placeholderEmail: "Your Email Address",
      placeholderPhone: "Your Mobile Number",
      placeholderMessage: "Type your prayer requests or questions here...",
      submitForm: "Send to Temple Office",
      formSuccess: "Thank you! Your inquiry and prayers have been securely transmitted to the temple administration."
    },
    footer: {
      tagline: "May the peaceful and benevolent Lord Shaneshwara shower his ultimate blessings upon all.",
      rights: "© 2026 Sri Kshetra Haadikere Temple Trust. All rights Reserved.",
      developerCredit: "Offered with extreme devotion"
    }
  }
};

export const sevasList: Record<Language, Seva[]> = {
  kn: [
    {
      id: "tailabhisheka",
      name: "ಶ್ರೀ ತೈಲಾಭಿಷೇಕ ಸೇವೆ (Tailabhisheka)",
      price: 150,
      description: "ಶನಿ ದೇವರಿಗೆ ಶುದ್ಧ ಎಳ್ಳೆಣ್ಣೆಯಿಂದ ಮಾಡುವ ಅಭಿಷೇಕ ಮತ್ತು ಅರ್ಚನೆ ಪ್ರಸಾದ."
    },
    {
      id: "ellubathi",
      name: "ಎಳ್ಳು ಬತ್ತಿ ದೀಪಾರಾಧನೆ (Ellu Bathi Seva)",
      price: 50,
      description: "ಭಕ್ತರು ಸ್ವತಃ ತಮ್ಮ ಕೈಯಾರೆ ಮಣ್ಣಿನ ದೀಪಗಳಲ್ಲಿ ಎಳ್ಳು ಬತ್ತಿಗಳನ್ನು ಹಚ್ಚುವ ಪವಿತ್ರ ಸೇವೆ."
    },
    {
      id: "shanihoma",
      name: "ವಿಶೇಷ ಶನಿ ಶಾಂತಿ ಹೋಮ (Shani Shanthi Homa)",
      price: 1500,
      description: "ಕಷ್ಟಗಳನ್ನು ನಿವಾರಿಸಲು ನಡೆಸಲಾಗುವ ವೈದಿಕ ಶನಿ ಹೋಮದಲ್ಲಿ ದಂಪತಿ ಸಮೇತ ಪಾಲ್ಗೊಳ್ಳುವಿಕೆ."
    },
    {
      id: "archana",
      name: "ಅಷ್ಟೋತ್ತರ ಶತನಾಮಾವಳಿ ಅರ್ಚನೆ (Archana Seva)",
      price: 30,
      description: "ಭಕ್ತರ ಹೆಸರು ಹಾಗೂ ನಕ್ಷತ್ರಗಳನ್ನು ಸಂಕಲ್ಪ ಮಾಡಿ ಪುಷ್ಪ ಅರ್ಚನೆ ಮಾಡುವುದು."
    },
    {
      id: "mahapooja",
      name: "ಶನಿವಾರದ ವಿಶೇಷ ಮಹಾಪೂಜೆ (Maha Pooja)",
      price: 501,
      description: "ವಿಶೇಷ ಪುಷ್ಪಾಲಂಕಾರ, ಪಂಚಾಮೃತ ಅಭಿಷೇಕ ಮತ್ತು ಪ್ರಮುಖ ಮಹಾಮಂಗಳಾರತಿ ಪ್ರಸಾದ."
    },
    {
      id: "annadasoha",
      name: "ಅನ್ನದಾಸೋಹ ಪ್ರಸಾದ ಸೇವೆ (Annadasoha Donor)",
      price: 2001,
      description: "ಶನಿವಾರ ಭಕ್ತಾದಿಗಳಿಗೆ ವಿತರಿಸಲಾಗುವ ಅನ್ನದಾಸೋಹದ ದಿನಸಿಗಳಿಗೆ ನಿಮ್ಮ ಸೇವಾ ಕಾಣಿಕೆ."
    }
  ],
  en: [
    {
      id: "tailabhisheka",
      name: "Sri Tailabhisheka Seva",
      price: 150,
      description: "Sacred bathing of the deity with pure sesame oil accompanied by mantras."
    },
    {
      id: "ellubathi",
      name: "Ellu Bathi Lamp Offering",
      price: 50,
      description: "Devotees light sesame-filled cotton bags in clay oil lamps for divine grace."
    },
    {
      id: "shanihoma",
      name: "Special Shani Shanthi Homa",
      price: 1500,
      description: "Participation in the grand Vedic fire ritual for planetary peace and blessing."
    },
    {
      id: "archana",
      name: "Ashtottara Shatanamavali Archana",
      price: 30,
      description: "Recitation of 108 names of Lord Shaneshwara under your name and birth star."
    },
    {
      id: "mahapooja",
      name: "Saturday Special Maha Pooja",
      price: 501,
      description: "Elaborate floral decoration, panchamrutha abhisheka, and grand arati blessing."
    },
    {
      id: "annadasoha",
      name: "Annadasoha Feeding Donation",
      price: 2001,
      description: "Sponsor and support the preparation of sacred free meals for Saturday pilgrims."
    }
  ]
};

export interface Chant {
  id: string;
  name: string;
  mantra: string;
  translation: string;
  benefit: string;
}

export const chantsList: Record<Language, Chant[]> = {
  kn: [
    {
      id: "shani-gayatri",
      name: "ಶ್ರೀ ಶನಿ ಗಾಯತ್ರಿ ಮಂತ್ರ",
      mantra: "ಓಂ ಕೃಷ್ಣಾಂಗಾಯ ವಿದ್ಮಹೇ ರವಿಪುತ್ರಾಯ ಧೀಮಹಿ | ತನ್ನೋ ಸೌರಿಃ ಪ್ರಚೋದಯಾತ್ ||",
      translation: "ಕೃಷ್ಣ ವರ್ಣದ ಶರೀರವುಳ್ಳ, ಸೂರ್ಯದೇವನ ಪುತ್ರನಾದ ಶನಿ ಮಹಾತ್ಮನನ್ನು ನಾವು ಧ್ಯಾನಿಸುತ್ತೇವೆ. ಆ ಸೌರಿ (ಶನಿ) ನಮಗೆ ಸನ್ಮಾರ್ಗದಲ್ಲಿ ಮುನ್ನಡೆಯಲು ಪ್ರೇರಣೆ ನೀಡಲಿ.",
      benefit: "ಬುದ್ಧಿಶಕ್ತಿಯನ್ನು ಹೆಚ್ಚಿಸುತ್ತದೆ ಮತ್ತು ಶನಿದೋಷಗಳಿಂದ ಬರುವ ಮಾನಸಿಕ ಆತಂಕಗಳನ್ನು ದೂರ ಮಾಡುತ್ತದೆ."
    },
    {
      id: "shani-peeda-hara",
      name: "ಶನಿ ಪೀಡಾಹರ ಸ್ತೋತ್ರ",
      mantra: "ಸೂರ್ಯಪುತ್ರೋ ಧೀರ್ಘದೇಹೋ ವಿಶಾಲಾಕ್ಷಃ ಶಿವಪ್ರಿಯಃ | ಮಂದಚಾರಃ ಪ್ರಸನ್ನಾತ್ಮ ಪೀಡಾಂ ಹರತು ಮೇ ಶನಿಃ ||",
      translation: "ಸೂರ್ಯನ ಪುತ್ರನಾದ, ಎತ್ತರದ ಶರೀರವುಳ್ಳ, ವಿಶಾಲವಾದ ಕಣ್ಣುಗಳುಳ್ಳ, ಪರಶಿವನ ಪ್ರೀತಿಯ ಭಕ್ತನಾದ, ಮಂದಗತಿಯಲ್ಲಿ ಚಲಿಸುವ ಪ್ರಸನ್ನಾತ್ಮನಾದ ಶನಿ ದೇವನು ನನ್ನ ಸರ್ವ ಪೀಡೆಗಳನ್ನು ಹರಿಸಲಿ.",
      benefit: "ಆರೋಗ್ಯ ಸಮಸ್ಯೆಗಳನ್ನು, ದೀರ್ಘಕಾಲದ ಕಾಯಿಲೆಗಳನ್ನು ಮತ್ತು ಕೆಲಸ-ಕಾರ್ಯಗಳಲ್ಲಿ ಬರುವ ಅಡೆತಡೆಗಳನ್ನು ನಿವಾರಿಸುತ್ತದೆ."
    },
    {
      id: "shani-bija",
      name: "ಶ್ರೀ ಶನಿ ಬೀಜ ಮಂತ್ರ",
      mantra: "ಓಂ ಪ್ರಾಂ ಪ್ರೀಂ ಪ್ರೌಂ ಸಃ ಶನೀಶ್ವರಾಯ ನಮಃ ||",
      translation: "ಶಕ್ತಿಶಾಲಿ ಅಕ್ಷರಗಳೊಂದಿಗೆ ಕೂಡಿದ ಶನೀಶ್ವರ ದೇವರಿಗೆ ನನ್ನ ಅನಂತ ಪ್ರಣಾಮಗಳು.",
      benefit: "ಪ್ರತಿದಿನ 108 ಬಾರಿ ಜಪಿಸುವುದರಿಂದ ಅತ್ಯಂತ ಶೀಘ್ರವಾಗಿ ಮನಸ್ಸಿಗೆ ಧೈರ್ಯ ಹಾಗೂ ಆಂತರಿಕ ಶಕ್ತಿ ಪ್ರಾಪ್ತಿಯಾಗುತ್ತದೆ."
    }
  ],
  en: [
    {
      id: "shani-gayatri",
      name: "Sri Shani Gayatri Mantra",
      mantra: "Om Krishnaangaya Vidmahe Raviputraya Dheemahi | Tanno Saurih Prachodayat ||",
      translation: "We meditate upon the dark-complexioned one, the glorious son of Lord Surya. May Shani Dev guide and illuminate our intellect with wisdom.",
      benefit: "Improves mental clarity, sharpens focus, and reduces stress and anxiety caused by planetary transits."
    },
    {
      id: "shani-peeda-hara",
      name: "Shani Peedahara Stotram",
      mantra: "Suryaputro Deerghadeho Vishaalakshah Shivapriyah | Mandachaarah Prasannatma Peedam Haratu Me Shanih ||",
      translation: "May Shani Dev, the son of Surya, tall, broad-eyed, beloved of Shiva, slow-moving, and pure-souled, remove all my sufferings.",
      benefit: "Alleviates chronic health issues, overcomes professional delays, and removes life obstacles."
    },
    {
      id: "shani-bija",
      name: "Sri Shani Bija Mantra",
      mantra: "Om Praam Preem Proum Sah Shanaishcharaya Namah ||",
      translation: "My salutations to Lord Shaneshwara, characterized by these powerful seed syllables of cosmic protection.",
      benefit: "Chanting this 108 times daily creates a shield of confidence, fortitude, and physical/spiritual well-being."
    }
  ]
};

