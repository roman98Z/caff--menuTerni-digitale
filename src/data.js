// Dati del menu per Manus - Menu Digitale Interattivo

export const categories = [
  {
    id: 'caffetteria',
    name: 'CAFFETTERIA',
    description: 'Caffè, cappuccini e altre bevande calde',
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&h=400&fit=crop'
  },
  {
    id: 'colazioni',
    name: 'COLAZIONI & AMERICAN LIFESTYLE',
    description: 'Croissant, torte e altre dolcezze',
    image: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=600&h=400&fit=crop'
  },
  {
    id: 'bevande_analcoliche',
    name: 'BEVANDE ANALCOLICHE',
    description: 'Acque, bibite, succhi e altre bevande',
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&h=400&fit=crop'
  },
  {
    id: 'bevande_alcoliche',
    name: 'BEVANDE ALCOLICHE',
    description: 'Birre, vini e cocktail',
    image: 'https://images.unsplash.com/photo-1590080875830-57886b1b8f21?w=600&h=400&fit=crop'
  },
  {
    id: 'pranzo',
    name: 'Pranzo',
    description: 'Piatti principali e primi',
    image: 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=600&h=400&fit=crop'
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
      image: 'https://www.coffeebybeans.com/cdn/shop/articles/Espresso_What_is_it_1696x954.jpg?v=1618338920',
      allergens: [],
      dietary: ['vegan']
    },
    {
      id: 2,
      name: 'Caffè decaffeinato',
      type: 'CAFFÈ',
      description: 'Caffè espresso decaffeinato',
      price: 1.20,
      image: 'https://www.mokabar.it/wp-content/uploads/2023/05/caffe-decaffeinato-proprieta-rischi-salute.jpg',
      allergens: [],
      dietary: ['vegan']
    },
    {
      id: 3,
      name: 'Caffè d’orzo piccolo',
      type: 'CAFFÈ D\'ORZO',
      description: 'Caffè d’orzo in tazza piccola',
      price: 1.30,
      image: 'https://www.tasteatlas.com/images/dishes/201867181054_Caffe-d-Orzo.jpg?w=2800&h=1220&fit=max',
      allergens: ['gluten'],
      dietary: ['vegan']
    },
    {
      id: 4,
      name: 'Caffè d’orzo grande',
      type: 'CAFFÈ D\'ORZO',
      description: 'Caffè d’orzo in tazza grande',
      price: 1.30,
      image: 'https://www.chiringuitocarugate.it/wp-content/uploads/2020/07/Caffe-dOrzo-Grande.jpeg',
      allergens: ['gluten'],
      dietary: ['vegan']
    },
    {
      id: 5,
      name: 'Caffè marocchino',
      type: 'CAFFÈ SPECIALE',
      description: 'Caffè con cacao e schiuma di latte',
      price: 1.60,
      image: 'https://www.lacucinaitaliana.com/content/uploads/2022/01/Marocchino-coffee-recipe.jpg',
      allergens: ['lactose'],
      dietary: []
    },
    {
      id: 6,
      name: 'Caffè al ginseng piccolo',
      type: 'CAFFÈ AL GINSENG',
      description: 'Caffè al ginseng in tazza piccola',
      price: 1.50,
      image: 'https://www.caffeaiello.it/wp-content/uploads/2021/07/caffe-ginseng-come-si-fa.jpg',
      allergens: [],
      dietary: ['vegan']
    },
    {
      id: 7,
      name: 'Caffè al ginseng grande',
      type: 'CAFFÈ AL GINSENG',
      description: 'Caffè al ginseng in tazza grande',
      price: 1.70,
      image: 'https://www.officinegastronomiche.it/wp-content/uploads/2020/09/ginseng-platinum.jpg',
      allergens: [],
      dietary: ['vegan']
    },
    {
      id: 8,
      name: 'Caffè shakerato',
      type: 'CAFFÈ FREDDO',
      description: 'Caffè shakerato con ghiaccio',
      price: 2.00,
      image: 'https://www.seriousseats.com/thmb/T-2-hR4H-v-i-o-I-m-m-m-I=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/caffe-shakerato-hero-01-4c5cf9b1c99e45a08070337b34d9a944.jpg',
      allergens: [],
      dietary: ['vegan']
    },
    {
      id: 9,
      name: 'Caffè speciali',
      type: 'CAFFÈ SPECIALE',
      description: 'Caffè con aromi speciali',
      price: 2.30,
      image: 'https://www.tripadvisor.com/LocationPhotoDirectLink-g187801-d10260640-i214777904-Dolce_Vita_Caffe-Bologna_Province_of_Bologna_Emilia_Romagna.html',
      allergens: [],
      dietary: []
    },
    {
      id: 10,
      name: 'Macchiatone',
      type: 'CAFFÈ MACCHIATO',
      description: 'Caffè macchiato con più schiuma di latte',
      price: 1.50,
      image: 'https://www.caffevergnano.com/blog/wp-content/uploads/2021/02/macchiatone-caffe-vergnano.jpg',
      allergens: ['lactose'],
      dietary: []
    },
    {
      id: 11,
      name: 'Cappuccino',
      type: 'CAFFÈ',
      description: 'Cappuccino cremoso con latte montato',
      price: 1.60,
      image: 'https://www.acouplecooks.com/wp-content/uploads/2020/09/How-to-Make-Cappuccino-006.jpg',
      allergens: ['lactose'],
      dietary: []
    },
    {
      id: 12,
      name: 'Cappuccino decaffeinato',
      type: 'CAFFÈ',
      description: 'Cappuccino con caffè decaffeinato',
      price: 1.50,
      image: 'https://www.amazon.com/images/I/71Y-s-h-s-L._AC_SL1000_.jpg',
      allergens: ['lactose'],
      dietary: []
    },
    {
      id: 13,
      name: 'Cappuccino d’orzo',
      type: 'CAFFÈ D\'ORZO',
      description: 'Cappuccino con caffè d’orzo',
      price: 1.60,
      image: 'https://www.bellaitaliafoodstore.com/cdn/shop/products/orzo-bimbo-cappuccino-d-orzo-150-gr-1_1024x1024.jpg?v=1620923010',
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
      image: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=400&h=300&fit=crop',
      allergens: ['gluten', 'lactose'],
      dietary: []
    },
    {
      id: 15,
      name: 'Mini croissant',
      type: 'DOLCE',
      description: 'Mini croissant classico',
      price: 1.10,
      image: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=400&h=300&fit=crop',
      allergens: ['gluten', 'lactose'],
      dietary: []
    },
    {
      id: 16,
      name: 'Crostate e frolle',
      type: 'DOLCE',
      description: 'Assortimento di crostate e frolle',
      price: 1.50,
      image: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=400&h=300&fit=crop',
      allergens: ['gluten', 'lactose', 'eggs'],
      dietary: []
    },
    {
       id: 17,
      name: 'Biscotti assortiti',
      type: 'DOLCE',
      description: 'Biscotti di vario tipo',
      price: 0.50,
      image: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=400&h=300&fit=crop',
      allergens: ['gluten', 'lactose', 'eggs'],
      dietary: []
    },
    {
      id: 18,
      name: 'Mini crostate pesche',
      type: 'DOLCE',
      description: 'Mini crostate con pesche fresche',
      price: 1.00,
      image: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=400&h=300&fit=crop',
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
      image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=400&h=300&fit=crop',
      allergens: [],
      dietary: ['vegan']
    },
    {
      id: 21,
      name: 'Acqua minerale bottiglia 75 cl',
      type: 'ACQUA',
      description: 'Acqua minerale naturale in bottiglia da 75 cl',
      price: 1.80,
      image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=400&h=300&fit=crop',
      allergens: [],
      dietary: ['vegan']
    },
    {
      id: 22,
      name: 'Acqua minerale bottiglia 150 cl',
      type: 'ACQUA',
      description: 'Acqua minerale naturale in bottiglia da 150 cl',
      price: 1.90,
      image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=400&h=300&fit=crop',
      allergens: [],
      dietary: ['vegan']
    },
    {
      id: 23,
      name: 'Effervescente digestivo',
      type: 'DIGESTIVO',
      description: 'Bevanda effervescente digestiva',
      price: 1.50,
      image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=400&h=300&fit=crop',
      allergens: [],
      dietary: ['vegan']
    },
    {
      id: 24,
      name: 'Succo di frutta 200 cl',
      type: 'SUCCO',
      description: 'Succo di frutta naturale da 200 cl',
      price: 2.80,
      image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=400&h=300&fit=crop',
      allergens: [],
      dietary: ['vegan']
    },
    {
      id: 25,
      name: 'Succo di frutta bio',
      type: 'SUCCO',
      description: 'Succo di frutta biologico',
      price: 3.50,
      image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=400&h=300&fit=crop',
      allergens: [],
      dietary: ['vegan', 'organic']
    },
    {
      id: 26,
      name: 'Spremuta di agrumi',
      type: 'SPREMUTA',
      description: 'Spremuta fresca di agrumi',
      price: 3.50,
      image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=400&h=300&fit=crop',
      allergens: [],
      dietary: ['vegan']
    },
    {
      id: 27,
      name: 'Spremuta di melograno',
      type: 'SPREMUTA',
      description: 'Spremuta fresca di melograno',
      price: 4.00,
      image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=400&h=300&fit=crop',
      allergens: [],
      dietary: ['vegan']
    },
    {
      id: 28,
      name: 'Bibite in bottiglia 20 cl',
      type: 'BIBITA',
      description: 'Bibite assortite in bottiglia da 20 cl',
      price: 2.60,
      image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=400&h=300&fit=crop',
      allergens: [],
      dietary: []
    },
    {
      id: 29,
      name: 'Bibite in bottiglia 33 cl',
      type: 'BIBITA',
      description: 'Bibite assortite in bottiglia da 33 cl',
      price: 2.90,
      image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=400&h=300&fit=crop',
      allergens: [],
      dietary: []
    },
    {
      id: 30,
      name: 'Bibite in bottiglia PET 45 cl',
      type: 'BIBITA',
      description: 'Bibite assortite in bottiglia PET da 45 cl',
      price: 2.90,
      image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=400&h=300&fit=crop',
      allergens: [],
      dietary: []
    },
    {
      id: 31,
      name: 'Bibite in bottiglia PET 50 cl',
      type: 'BIBITA',
      description: 'Bibite assortite in bottiglia PET da 50 cl',
      price: 2.90,
      image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=400&h=300&fit=crop',
      allergens: [],
      dietary: []
    },
    {
      id: 32,
      name: 'Bibite in lattina 250 cl',
      type: 'BIBITA',
      description: 'Bibite assortite in lattina da 250 cl',
      price: 2.10,
      image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=400&h=300&fit=crop',
      allergens: [],
      dietary: []
    },
    {
      id: 33,
      name: 'Red Bull in lattina',
      type: 'ENERGY DRINK',
      description: 'Red Bull energy drink in lattina',
      price: 3.20,
      image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=400&h=300&fit=crop',
      allergens: [],
      dietary: []
    },
    {
      id: 34,
      name: 'Estathé brick',
      type: 'TÈ',
      description: 'Tè freddo Estathé in brick',
      price: 1.50,
      image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=400&h=300&fit=crop',
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
      image: 'https://images.unsplash.com/photo-1590080875830-57886b1b8f21?w=400&h=300&fit=crop',
      allergens: ['gluten'],
      dietary: []
    },
    {
      id: 36,
      name: 'Calice di Vino Rosso',
      type: 'VINO',
      description: 'Calice di vino rosso selezionato',
      price: 4.50,
      image: 'https://images.unsplash.com/photo-1590080875830-57886b1b8f21?w=400&h=300&fit=crop',
      allergens: ['sulfites'],
      dietary: []
    },
    {
      id: 37,
      name: 'Mojito',
      type: 'COCKTAIL',
      description: 'Cocktail classico con rum, menta, lime e soda',
      price: 8.00,
      image: 'https://images.unsplash.com/photo-1590080875830-57886b1b8f21?w=400&h=300&fit=crop',
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
      image: 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=400&h=300&fit=crop',
      allergens: ['gluten', 'eggs', 'lactose'],
      dietary: []
    },
    {
      id: 18,
      name: 'Insalata Caesar',
      type: 'SECONDO',
      description: 'Insalata Caesar con pollo grigliato',
      price: 7.00,
      image: 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=400&h=300&fit=crop',
      allergens: ['eggs', 'lactose'],
      dietary: []
    },
    {
      id: 19,
      name: 'Risotto ai Porcini',
      type: 'PRIMO',
      description: 'Risotto cremoso con funghi porcini freschi',
      price: 12.00,
      image: 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=400&h=300&fit=crop',
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

