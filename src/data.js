// Dati del menu per Manus - Menu Digitale Interattivo

export const categories = [
  {
    id: 'caffetteria',
    name: 'CAFFETTERIA',
    description: 'Caffè, cappuccini e altre bevande calde',
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&h=400&fit=crop' // Immagine per Caffetteria
  },
  {
    id: 'colazioni',
    name: 'COLAZIONI & AMERICAN LIFESTYLE',
    description: 'Croissant, torte e altre dolcezze',
    image: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=600&h=400&fit=crop' // Immagine per Colazioni
  },
  {
    id: 'bevande_analcoliche',
    name: 'BEVANDE ANALCOLICHE',
    description: 'Acque, bibite, succhi e altre bevande',
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&h=400&fit=crop' // Immagine per Bevande Analcoliche
  },
  {
    id: 'bevande_alcoliche',
    name: 'BEVANDE ALCOLICHE',
    description: 'Birre, vini e cocktail',
    image: 'https://images.unsplash.com/photo-1590080875830-57886b1b8f21?w=600&h=400&fit=crop' // Immagine per Bevande Alcoliche
  },
  {
    id: 'pranzo',
    name: 'Pranzo',
    description: 'Piatti principali e primi',
    image: 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=600&h=400&fit=crop' // Immagine per Pranzo
  }
];

export const menuData = {
  caffetteria: [
    {
      id: 1,
      name: 'Caffè espresso',
      type: 'CAFFÈ',
      description: 'Caffè espresso italiano tradizionale',
      price: 1.20,
      image: 'https://images.unsplash.com/photo-1517256071840-f1311667069c?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      allergens: [],
      dietary: ['vegan']
    },
    {
      id: 2,
      name: 'Caffè decaffeinato',
      type: 'CAFFÈ',
      description: 'Caffè espresso decaffeinato',
      price: 1.20,
      image: 'https://images.unsplash.com/photo-1517256071840-f1311667069c?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      allergens: [],
      dietary: ['vegan']
    },
    {
      id: 3,
      name: 'Caffè d’orzo piccolo',
      type: 'CAFFÈ D\'ORZO',
      description: 'Caffè d’orzo in tazza piccola',
      price: 1.30,
      image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      allergens: ['gluten'],
      dietary: ['vegan']
    },
    {
      id: 4,
      name: 'Caffè d’orzo grande',
      type: 'CAFFÈ D\'ORZO',
      description: 'Caffè d’orzo in tazza grande',
      price: 1.30,
      image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      allergens: ['gluten'],
      dietary: ['vegan']
    },
    {
      id: 5,
      name: 'Caffè marocchino',
      type: 'CAFFÈ SPECIALE',
      description: 'Caffè con cacao e schiuma di latte',
      price: 1.60,
      image: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      allergens: ['lactose'],
      dietary: []
    },
    {
      id: 6,
      name: 'Caffè al ginseng piccolo',
      type: 'CAFFÈ AL GINSENG',
      description: 'Caffè al ginseng in tazza piccola',
      price: 1.50,
      image: 'https://images.unsplash.com/photo-1517256071840-f1311667069c?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      allergens: [],
      dietary: ['vegan']
    },
    {
      id: 7,
      name: 'Caffè al ginseng grande',
      type: 'CAFFÈ AL GINSENG',
      description: 'Caffè al ginseng in tazza grande',
      price: 1.70,
      image: 'https://images.unsplash.com/photo-1517256071840-f1311667069c?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      allergens: [],
      dietary: ['vegan']
    },
    {
      id: 8,
      name: 'Caffè shakerato',
      type: 'CAFFÈ FREDDO',
      description: 'Caffè shakerato con ghiaccio',
      price: 2.00,
      image: 'https://images.unsplash.com/photo-1517256071840-f1311667069c?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      allergens: [],
      dietary: ['vegan']
    },
    {
      id: 9,
      name: 'Caffè speciali',
      type: 'CAFFÈ SPECIALE',
      description: 'Caffè con aromi speciali',
      price: 2.30,
      image: 'https://images.unsplash.com/photo-1517256071840-f1311667069c?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      allergens: [],
      dietary: []
    },
    {
      id: 10,
      name: 'Macchiatone',
      type: 'CAFFÈ MACCHIATO',
      description: 'Caffè macchiato con più schiuma di latte',
      price: 1.50,
      image: 'https://images.unsplash.com/photo-1517256071840-f1311667069c?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      allergens: ['lactose'],
      dietary: []
    },
    {
      id: 11,
      name: 'Cappuccino',
      type: 'CAFFÈ',
      description: 'Cappuccino cremoso con latte montato',
      price: 1.60,
      image: 'https://images.unsplash.com/photo-1517256071840-f1311667069c?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      allergens: ['lactose'],
      dietary: []
    },
    {
      id: 12,
      name: 'Cappuccino decaffeinato',
      type: 'CAFFÈ',
      description: 'Cappuccino con caffè decaffeinato',
      price: 1.50,
      image: 'https://images.unsplash.com/photo-1517256071840-f1311667069c?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      allergens: ['lactose'],
      dietary: []
    },
    {
      id: 13,
      name: 'Cappuccino d’orzo',
      type: 'CAFFÈ D\'ORZO',
      description: 'Cappuccino con caffè d’orzo',
      price: 1.60,
      image: 'https://images.unsplash.com/photo-1517256071840-f1311667069c?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      allergens: ['gluten', 'lactose'],
      dietary: []
    }
  ],

  colazioni: [
    {
      id: 14,
      name: 'Croissant',
      type: 'DOLCE',
      description: 'Croissant classico',
      price: 1.50,
      image: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      allergens: ['gluten', 'lactose'],
      dietary: []
    },
    {
      id: 15,
      name: 'Mini croissant',
      type: 'DOLCE',
      description: 'Mini croissant classico',
      price: 1.10,
      image: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      allergens: ['gluten', 'lactose'],
      dietary: []
    },
    {
      id: 16,
      name: 'Crostate e frolle',
      type: 'DOLCE',
      description: 'Assortimento di crostate e frolle',
      price: 1.50,
      image: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      allergens: ['gluten', 'lactose', 'eggs'],
      dietary: []
    },
    {
       id: 17,
      name: 'Biscotti assortiti',
      type: 'DOLCE',
      description: 'Biscotti di vario tipo',
      price: 0.50,
      image: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      allergens: ['gluten', 'lactose', 'eggs'],
      dietary: []
    },
    {
      id: 18,
      name: 'Mini crostate pesche',
      type: 'DOLCE',
      description: 'Mini crostate con pesche fresche',
      price: 1.00,
      image: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      allergens: ['gluten', 'lactose', 'eggs'],
      dietary: []
    }
  ],

  bevande_analcoliche: [
    {
      id: 20,
      name: 'Acqua minerale bottiglia 50 cl',
      type: 'ACQUA',
      description: 'Acqua minerale naturale in bottiglia da 50 cl',
      price: 1.20,
      image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      allergens: [],
      dietary: ['vegan']
    },
    {
      id: 21,
      name: 'Acqua minerale bottiglia 75 cl',
      type: 'ACQUA',
      description: 'Acqua minerale naturale in bottiglia da 75 cl',
      price: 1.80,
      image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      allergens: [],
      dietary: ['vegan']
    },
    {
      id: 22,
      name: 'Acqua minerale bottiglia 150 cl',
      type: 'ACQUA',
      description: 'Acqua minerale naturale in bottiglia da 150 cl',
      price: 1.90,
      image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      allergens: [],
      dietary: ['vegan']
    },
    {
      id: 23,
      name: 'Effervescente digestivo',
      type: 'DIGESTIVO',
      description: 'Bevanda effervescente digestiva',
      price: 1.50,
      image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      allergens: [],
      dietary: ['vegan']
    },
    {
      id: 24,
      name: 'Succo di frutta 200 cl',
      type: 'SUCCO',
      description: 'Succo di frutta naturale da 200 cl',
      price: 2.80,
      image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      allergens: [],
      dietary: ['vegan']
    },
    {
      id: 25,
      name: 'Succo di frutta bio',
      type: 'SUCCO',
      description: 'Succo di frutta biologico',
      price: 3.50,
      image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      allergens: [],
      dietary: ['vegan', 'organic']
    },
    {
      id: 26,
      name: 'Spremuta di agrumi',
      type: 'SPREMUTA',
      description: 'Spremuta fresca di agrumi',
      price: 3.50,
      image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      allergens: [],
      dietary: ['vegan']
    },
    {
      id: 27,
      name: 'Spremuta di melograno',
      type: 'SPREMUTA',
      description: 'Spremuta fresca di melograno',
      price: 4.00,
      image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      allergens: [],
      dietary: ['vegan']
    },
    {
      id: 28,
      name: 'Bibite in bottiglia 20 cl',
      type: 'BIBITA',
      description: 'Bibite assortite in bottiglia da 20 cl',
      price: 2.60,
      image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      allergens: [],
      dietary: []
    },
    {
      id: 29,
      name: 'Bibite in bottiglia 33 cl',
      type: 'BIBITA',
      description: 'Bibite assortite in bottiglia da 33 cl',
      price: 2.90,
      image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      allergens: [],
      dietary: []
    },
    {
      id: 30,
      name: 'Bibite in bottiglia PET 45 cl',
      type: 'BIBITA',
      description: 'Bibite assortite in bottiglia PET da 45 cl',
      price: 2.90,
      image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      allergens: [],
      dietary: []
    },
    {
      id: 31,
      name: 'Bibite in bottiglia PET 50 cl',
      type: 'BIBITA',
      description: 'Bibite assortite in bottiglia PET da 50 cl',
      price: 2.90,
      image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      allergens: [],
      dietary: []
    },
    {
      id: 32,
      name: 'Bibite in lattina 250 cl',
      type: 'BIBITA',
      description: 'Bibite assortite in lattina da 250 cl',
      price: 2.10,
      image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      allergens: [],
      dietary: []
    },
    {
      id: 33,
      name: 'Red Bull in lattina',
      type: 'ENERGY DRINK',
      description: 'Red Bull energy drink in lattina',
      price: 3.20,
      image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      allergens: [],
      dietary: []
    },
    {
      id: 34,
      name: 'Estathé brick',
      type: 'TÈ',
      description: 'Tè freddo Estathé in brick',
      price: 1.50,
      image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      allergens: [],
      dietary: []
    }
  ],

  bevande_alcoliche: [
    {
      id: 35,
      name: 'Birra Artigianale IPA',
      type: 'BIRRA',
      description: 'Birra artigianale IPA, 5.5% vol.',
      price: 5.00,
      image: 'https://images.unsplash.com/photo-1590080875830-57886b1b8f21?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      allergens: ['gluten'],
      dietary: []
    },
    {
      id: 36,
      name: 'Calice di Vino Rosso',
      type: 'VINO',
      description: 'Calice di vino rosso selezionato',
      price: 4.50,
      image: 'https://images.unsplash.com/photo-1590080875830-57886b1b8f21?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      allergens: ['sulfites'],
      dietary: []
    },
    {
      id: 37,
      name: 'Mojito',
      type: 'COCKTAIL',
      description: 'Cocktail classico con rum, menta, lime e soda',
      price: 8.00,
      image: 'https://images.unsplash.com/photo-1590080875830-57886b1b8f21?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      allergens: [],
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
      image: 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      allergens: ['gluten', 'eggs', 'lactose'],
      dietary: []
    },
    {
      id: 18,
      name: 'Insalata Caesar',
      type: 'SECONDO',
      description: 'Insalata Caesar con pollo grigliato',
      price: 7.00,
      image: 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      allergens: ['eggs', 'lactose'],
      dietary: []
    },
    {
      id: 19,
      name: 'Risotto ai Porcini',
      type: 'PRIMO',
      description: 'Risotto cremoso con funghi porcini freschi',
      price: 12.00,
      image: 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
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


