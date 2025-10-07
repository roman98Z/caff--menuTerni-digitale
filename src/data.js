// Dati del menu per Manus - Menu Digitale Interattivo

export const categories = [
  {
    id: 'apericena',
    name: 'CAFFETTERIA',
    description: 'Taglieri, bruschette e piatti per l\'aperitivo',    image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663126501606/rJqoqDkQjAqnMyeJ.jpeg'
  },
  {
    id: 'vini',
    name: 'COLAZIONI & AMERICAN LIFESTYLE',
    description: 'Selezione di vini bianchi, rossi e rosé',    image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663126501606/GMRkHAOFveNDPfkS.jpg'
  },
  {
    id: 'gin',
    name: 'BEVANDE ANALCOLICHE',
    description: 'Gin premium e cocktail signature',
    image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663126501606/lGNrJMYEiqDoGhvl.jpg'  },

  {
    id: 'pasticceria',
    name: 'BEVANDE ALCOLICHE',
    description: 'Dolci freschi e pasticcini',    image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663126501606/XvNwxROkZbJOmSlg.jpg'
  },
  {
    id: 'pranzo',
    name: 'Pranzo',
    description: 'Piatti principali e primi',
    image: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=600&h=400&fit=crop'
  }
];

export const menuData = {
  apericena: [
    {
      id: 1,
      name: 'Caffè espresso',
      type: 'CAFFÈ',
      description: 'Caffè espresso italiano tradizionale',
      price: 1.20,
      image: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=400&h=300&fit=crop',
      allergens: [],
      dietary: ['vegan']
    },
    {
      id: 2,
      name: 'Caffè decaffeinato',
      type: 'CAFFÈ',
      description: 'Caffè espresso decaffeinato',
      price: 1.20,
      image: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=400&h=300&fit=crop',
      allergens: [],
      dietary: ['vegan']
    },
    {
      id: 3,
      name: 'Caffè d’orzo piccolo',
      type: 'CAFFÈ D\'ORZO',
      description: 'Caffè d’orzo in tazza piccola',
      price: 1.30,
      image: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=400&h=300&fit=crop',
      allergens: ['gluten'],
      dietary: ['vegan']
    },
    {
      id: 4,
      name: 'Caffè d’orzo grande',
      type: 'CAFFÈ D\'ORZO',
      description: 'Caffè d’orzo in tazza grande',
      price: 1.30,
      image: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=400&h=300&fit=crop',
      allergens: ['gluten'],
      dietary: ['vegan']
    },
    {
      id: 5,
      name: 'Caffè marocchino',
      type: 'CAFFÈ SPECIALE',
      description: 'Caffè con cacao e schiuma di latte',
      price: 1.60,
      image: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=400&h=300&fit=crop',
      allergens: ['lactose'],
      dietary: []
    },
    {
      id: 6,
      name: 'Caffè al ginseng piccolo',
      type: 'CAFFÈ AL GINSENG',
      description: 'Caffè al ginseng in tazza piccola',
      price: 1.50,
      image: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=400&h=300&fit=crop',
      allergens: [],
      dietary: ['vegan']
    },
    {
      id: 7,
      name: 'Caffè al ginseng grande',
      type: 'CAFFÈ AL GINSENG',
      description: 'Caffè al ginseng in tazza grande',
      price: 1.70,
      image: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=400&h=300&fit=crop',
      allergens: [],
      dietary: ['vegan']
    },
    {
      id: 8,
      name: 'Caffè shakerato',
      type: 'CAFFÈ FREDDO',
      description: 'Caffè shakerato con ghiaccio',
      price: 2.00,
      image: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=400&h=300&fit=crop',
      allergens: [],
      dietary: ['vegan']
    },
    {
      id: 9,
      name: 'Caffè speciali',
      type: 'CAFFÈ SPECIALE',
      description: 'Caffè con aromi speciali',
      price: 2.30,
      image: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=400&h=300&fit=crop',
      allergens: [],
      dietary: []
    },
    {
      id: 10,
      name: 'Macchiatone',
      type: 'CAFFÈ MACCHIATO',
      description: 'Caffè macchiato con più schiuma di latte',
      price: 1.50,
      image: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=400&h=300&fit=crop',
      allergens: ['lactose'],
      dietary: []
    },
    {
      id: 11,
      name: 'Cappuccino',
      type: 'CAFFÈ',
      description: 'Cappuccino cremoso con latte montato',
      price: 1.60,
      image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=300&fit=crop',
      allergens: ['lactose'],
      dietary: []
    },
    {
      id: 12,
      name: 'Cappuccino decaffeinato',
      type: 'CAFFÈ',
      description: 'Cappuccino con caffè decaffeinato',
      price: 1.50,
      image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=300&fit=crop',
      allergens: ['lactose'],
      dietary: []
    },
    {
      id: 13,
      name: 'Cappuccino d’orzo',
      type: 'CAFFÈ D\'ORZO',
      description: 'Cappuccino con caffè d’orzo',
      price: 1.60,
      image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=300&fit=crop',
      allergens: ['gluten', 'lactose'],
      dietary: []
    }
  ],

  vini: [
    {
      id: 14,
      name: 'Croissant',
      type: 'DOLCE',
      description: 'Croissant classico',
      price: 1.50,
      image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663126501606/nemuwgJCGrmdyXkp.jpg',
      allergens: ['gluten', 'lactose'],
      dietary: []
    },
    {
      id: 15,
      name: 'Mini croissant',
      type: 'DOLCE',
      description: 'Mini croissant classico',
      price: 1.10,
      image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663126501606/nemuwgJCGrmdyXkp.jpg',
      allergens: ['gluten', 'lactose'],
      dietary: []
    },
    {
      id: 16,
      name: 'Crostate e frolle',
      type: 'DOLCE',
      description: 'Assortimento di crostate e frolle',
      price: 1.50,
      image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663126501606/nemuwgJCGrmdyXkp.jpg',
      allergens: ['gluten', 'lactose', 'eggs'],
      dietary: []
    },
    {
       id: 17,
      name: 'Biscotti assortiti',
      type: 'DOLCE',
      description: 'Biscotti di vario tipo',
      price: 0.50,
      image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663126501606/AubcQNnPpElMXVbK.jpg',
      allergens: ['gluten', 'lactose', 'eggs'],
      dietary: []
    },
    {
      id: 18,
      name: 'Mini crostate pesche',
      type: 'DOLCE',
      description: 'Mini crostate con pesche fresche',
      price: 1.00,
      image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663126501606/xmGHUnKdlIBZFvsz.jpg',
      allergens: ['gluten', 'lactose', 'eggs'],
      dietary: []
    }
  ],

  gin: [],



  pasticceria: [
    {
      id: 14,
      name: 'Cornetto alla Crema',
      type: 'DOLCE',
      description: 'Cornetto fresco ripieno di crema pasticcera',
      price: 1.50,
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop',
      allergens: ['gluten', 'eggs', 'lactose'],
      dietary: []
    },
    {
      id: 15,
      name: 'Maritozzo',
      type: 'DOLCE',
      description: 'Maritozzo romano con panna montata',
      price: 2.50,
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop',
      allergens: ['gluten', 'eggs', 'lactose'],
      dietary: []
    },
    {
      id: 16,
      name: 'Tiramisù',
      type: 'DOLCE',
      description: 'Tiramisù della casa con mascarpone e caffè',
      price: 4.50,
      image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop',
      allergens: ['gluten', 'eggs', 'lactose'],
      dietary: []
    }
  ],

  pranzo: [
    {
      id: 17,
      name: 'Pasta alla Carbonara',
      type: 'PRIMO',
      description: 'Spaghetti alla carbonara tradizionale romana',
      price: 8.50,
      image: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400&h=300&fit=crop',
      allergens: ['gluten', 'eggs', 'lactose'],
      dietary: []
    },
    {
      id: 18,
      name: 'Insalata Caesar',
      type: 'SECONDO',
      description: 'Insalata Caesar con pollo grigliato',
      price: 7.00,
      image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop',
      allergens: ['eggs', 'lactose'],
      dietary: []
    },
    {
      id: 19,
      name: 'Risotto ai Porcini',
      type: 'PRIMO',
      description: 'Risotto cremoso con funghi porcini freschi',
      price: 12.00,
      image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400&h=300&fit=crop',
      allergens: ['lactose'],
      dietary: ['vegetarian']
    }
  ]
};

export const allergenIcons = {
  gluten: '🌾',
  lactose: '🥛',
  eggs: '🥚',
  nuts: '🥜',
  fish: '🐟',
  shellfish: '🦐',
  soy: '🫘',
  sulfites: '🍷'
};

export const dietaryIcons = {
  vegan: '🌱',
  vegetarian: '🥬',
  organic: '🌿',
  spicy: '🌶️',
  gluten_free: '🚫🌾'
};
