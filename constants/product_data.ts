//constants/product_data.ts
export interface Product {
  id: string;
  imageUrl: any;
  title: string;
  price: string;
  originalPrice?: string;
  discount?: string;
  rating?: number;
  reviewCount?: number;
  prime?: boolean;
  apparel?: boolean; // new property to designate apparel items
}

const productImages: { [key: string]: any } = {
  gamingGtplayerChair: require('@/assets/images/products/gaming-gtplayer-chair.png'),
  gamingRazerBlacksharkHeadset: require('@/assets/images/products/gaming-razer-blackshark-v2-x-headset.png'),
  nflFocoMensTeamLogoCasualHat: require('@/assets/images/products/nfl-foco-mens-team-logo-casual-hat.png'),
  nflNflProLineMensClassic: require('@/assets/images/products/nfl-nfl-pro-line-mens-classic.png'),
  nflWincraftBuffaloBillsRed3x5GrommetFlag: require('@/assets/images/products/nfl-wincraft-buffalo-bills-red-3x5-grommet-flag.png'),
  schoolBicXtraSmoothMechanicalPencilsWithErasers: require('@/assets/images/products/school-bic-xtra-smooth-mechanical-pencils-with-erasers.png'),
  schoolFivestarSpiralNotebook5Subject: require('@/assets/images/products/school-fivestar-spiral-notebook-5-subject.png'),
  schoolJansportSuperbreakOneBackpack: require('@/assets/images/products/school-jansport-superbreak-one-backpack.png'),
  techDell2025Latitude3000_3540Laptop: require('@/assets/images/products/tech-dell-2025-latitude-3000-3540-laptop.jpg'),
  techDellOpticalMouse: require('@/assets/images/products/tech-dell-optical-mouse.png'),
  techDellWiredKeyboard: require('@/assets/images/products/tech-dell-wired-keyboard.png'),
  techGenericLaptopSleeveDurableBriefcaseShockproofProtectiveCase15_6: require('@/assets/images/products/tech-generic-laptop-sleeve-durable-briefcase-shockproof-protective-case-15-6.png'),
  techJblGo3Speaker: require('@/assets/images/products/tech-jbl-go-3-speaker.png'),
};

export const products: { [key: string]: Product } = {
  gamingGtplayerChair: {
    id: 'gamingGtplayerChair',
    imageUrl: productImages.gamingGtplayerChair,
    title: 'Premium Gaming Chair',
    price: '$99.99',
    rating: 4.3,
    reviewCount: 2145,
    prime: true,
    apparel: false, // not an apparel item
  },
  gamingRazerBlacksharkHeadset: {
    id: 'gamingRazerBlacksharkHeadset',
    imageUrl: productImages.gamingRazerBlacksharkHeadset,
    title: 'Gaming Headset Razer Blackshark V2 X',
    price: '$39.99',
    rating: 4.1,
    reviewCount: 1890,
    prime: true,
    apparel: false, // not an apparel item
  },
  nflFocoMensTeamLogoCasualHat: {
    id: 'nflFocoMensTeamLogoCasualHat',
    imageUrl: productImages.nflFocoMensTeamLogoCasualHat,
    title: 'NFL Foco Mens Team Logo Casual Hat',
    price: '$29.99',
    rating: 4.2,
    reviewCount: 1500,
    prime: false,
    apparel: true, // apparel item (hat)
  },
  nflNflProLineMensClassic: {
    id: 'nflNflProLineMensClassic',
    imageUrl: productImages.nflNflProLineMensClassic,
    title: 'NFL Pro Line Mens Classic',
    price: '$99.99',
    originalPrice: '$199.99',
    discount: '50%',
    rating: 4.5,
    reviewCount: 2300,
    prime: false,
    apparel: true, // apparel item (e.g., jersey or t-shirt)
  },
  nflWincraftBuffaloBillsRed3x5GrommetFlag: {
    id: 'nflWincraftBuffaloBillsRed3x5GrommetFlag',
    imageUrl: productImages.nflWincraftBuffaloBillsRed3x5GrommetFlag,
    title: 'NFL Wincraft Buffalo Bills Red 3x5 Grommet Flag',
    price: '$19.99',
    rating: 4.0,
    reviewCount: 800,
    prime: false,
    apparel: false, // not apparel
  },
  schoolBicXtraSmoothMechanicalPencilsWithErasers: {
    id: 'schoolBicXtraSmoothMechanicalPencilsWithErasers',
    imageUrl: productImages.schoolBicXtraSmoothMechanicalPencilsWithErasers,
    title: 'Bic Xtra Smooth Mechanical Pencils with Erasers',
    price: '$4.99',
    rating: 3.9,
    reviewCount: 500,
    prime: false,
    apparel: false,
  },
  schoolFivestarSpiralNotebook5Subject: {
    id: 'schoolFivestarSpiralNotebook5Subject',
    imageUrl: productImages.schoolFivestarSpiralNotebook5Subject,
    title: 'Fivestar Spiral Notebook (5 Subject)',
    price: '$6.99',
    rating: 4.3,
    reviewCount: 600,
    prime: false,
    apparel: false,
  },
  schoolJansportSuperbreakOneBackpack: {
    id: 'schoolJansportSuperbreakOneBackpack',
    imageUrl: productImages.schoolJansportSuperbreakOneBackpack,
    title: 'Jansport Superbreak One Backpack',
    price: '$39.99',
    rating: 4.6,
    reviewCount: 1200,
    prime: true,
    apparel: false,
  },
  techDell2025Latitude3000_3540Laptop: {
    id: 'techDell2025Latitude3000_3540Laptop',
    imageUrl: productImages.techDell2025Latitude3000_3540Laptop,
    title: 'Dell Latitude 3000 3540 Laptop',
    price: '$799.99',
    rating: 4.4,
    reviewCount: 950,
    prime: true,
    apparel: false,
  },
  techDellOpticalMouse: {
    id: 'techDellOpticalMouse',
    imageUrl: productImages.techDellOpticalMouse,
    title: 'Dell Optical Mouse',
    price: '$19.99',
    rating: 4.2,
    reviewCount: 450,
    prime: false,
    apparel: false,
  },
  techDellWiredKeyboard: {
    id: 'techDellWiredKeyboard',
    imageUrl: productImages.techDellWiredKeyboard,
    title: 'Dell Wired Keyboard',
    price: '$29.99',
    rating: 4.0,
    reviewCount: 300,
    prime: false,
    apparel: false,
  },
  techGenericLaptopSleeveDurableBriefcaseShockproofProtectiveCase15_6: {
    id: 'techGenericLaptopSleeveDurableBriefcaseShockproofProtectiveCase15_6',
    imageUrl: productImages.techGenericLaptopSleeveDurableBriefcaseShockproofProtectiveCase15_6,
    title: 'Generic Laptop Sleeve & Briefcase (15.6")',
    price: '$49.99',
    rating: 4.1,
    reviewCount: 220,
    prime: false,
    apparel: false,
  },
  techJblGo3Speaker: {
    id: 'techJblGo3Speaker',
    imageUrl: productImages.techJblGo3Speaker,
    title: 'JBL Go 3 Speaker',
    price: '$59.99',
    rating: 4.5,
    reviewCount: 700,
    prime: true,
    apparel: false,
  },
};
