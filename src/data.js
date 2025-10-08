export const categories = [
  {
    id: 'caffetteria',
    name: 'CAFFETTERIA',
    description: 'Caffè, cappuccini e altre bevande calde',
    image: '/images/caffetteria.jpg'
  },
  {
    id: 'colazioni',
    name: 'COLAZIONI & AMERICAN LIFESTYLE',
    description: 'Croissant, torte e altre dolcezze',
    image: '/images/colazioni.jpg'
  },
  {
    id: 'bevande_analcoliche',
    name: 'BEVANDE ANALCOLICHE',
    description: 'Acque, bibite, succhi e altre bevande',
    image: '/images/bevande_analcoliche.jpg'
  },
  {
    id: 'bevande_alcoliche',
    name: 'BEVANDE ALCOLICHE',
    description: 'Birre, vini e cocktail',
    image: '/images/bevande_alcoliche.jpg'
  },
  {
    id: 'pranzo',
    name: 'Pranzo',
    description: 'Piatti principali e primi',
    image: '/images/pranzo.jpg'
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
      image: '/images/caffe_espresso.jpg',
      allergens: [],
      dietary: ['vegan']
    },
    {
      id: 2,
      name: 'Caffè decaffeinato',
      type: 'CAFFÈ',
      description: 'Caffè espresso decaffeinato',
      price: 1.20,
      image: '/images/caffe_decaffeinato.jpg',
      allergens: [],
      dietary: ['vegan']
    },
    {
      id: 3,
      name: 'Caffè d’orzo piccolo',
      type: 'CAFFÈ D\'ORZO',
      description: 'Caffè d’orzo in tazza piccola',
      price: 1.30,
      image: '/images/caffe_dorzo_piccolo.jpg',
      allergens: ['gluten'],
      dietary: ['vegan']
    },
    {
      id: 4,
      name: 'Caffè d’orzo grande',
      type: 'CAFFÈ D\'ORZO',
      description: 'Caffè d’orzo in tazza grande',
      price: 1.30,
      image: '/images/caffe_dorzo_grande.jpg',
      allergens: ['gluten'],
      dietary: ['vegan']
    },
    {
      id: 5,
      name: 'Caffè marocchino',
      type: 'CAFFÈ SPECIALE',
      description: 'Caffè con cacao e schiuma di latte',
      price: 1.60,
      image: '/images/caffe_marocchino.jpg',
      allergens: ['lactose'],
      dietary: []
    },
    {
      id: 6,
      name: 'Caffè al ginseng piccolo',
      type: 'CAFFÈ AL GINSENG',
      description: 'Caffè al ginseng in tazza piccola',
      price: 1.50,
      image: '/images/caffe_ginseng_piccolo.webp',
      allergens: [],
      dietary: ['vegan']
    },
    {
      id: 7,
      name: 'Caffè al ginseng grande',
      type: 'CAFFÈ AL GINSENG',
      description: 'Caffè al ginseng in tazza grande',
      price: 1.70,
      image: '/images/caffe_ginseng_grande.webp',
      allergens: [],
      dietary: ['vegan']
    },
    {
      id: 8,
      name: 'Caffè shakerato',
      type: 'CAFFÈ FREDDO',
      description: 'Caffè shakerato con ghiaccio',
      price: 2.00,
      image: '/images/caffe_shakerato.jpg',
      allergens: [],
      dietary: ['vegan']
    },
    {
      id: 9,
      name: 'Caffè speciali',
      type: 'CAFFÈ SPECIALE',
      description: 'Caffè con aromi speciali',
      price: 2.30,
      image: '/images/caffe_speciali.jpg',
      allergens: [],
      dietary: []
    },
    {
      id: 10,
      name: 'Macchiatone',
      type: 'CAFFÈ MACCHIATO',
      description: 'Caffè macchiato con più schiuma di latte',
      price: 1.50,
      image: '/images/macchiatone.jpg',
      allergens: ['lactose'],
      dietary: []
    },
    {
      id: 11,
      name: 'Cappuccino',
      type: 'CAFFÈ',
      description: 'Cappuccino cremoso con latte montato',
      price: 1.60,
      image: '/images/cappuccino.jpg',
      allergens: ['lactose'],
      dietary: []
    },
    {
      id: 12,
      name: 'Cappuccino decaffeinato',
      type: 'CAFFÈ',
      description: 'Cappuccino con caffè decaffeinato',
      price: 1.50,
      image: '/images/cappuccino_decaffeinato.jpg',
      allergens: ['lactose'],
      dietary: []
    },
    {
      id: 13,
      name: 'Cappuccino d’orzo',
      type: 'CAFFÈ D\'ORZO',
      description: 'Cappuccino con caffè d’orzo',
      price: 1.60,
      image: '/images/cappuccino_dorzo.jpg',
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
      image: '/images/croissant.jpg',
      allergens: ['gluten', 'lactose'],
      dietary: []
    },
    {
      id: 15,
      name: 'Mini croissant',
      type: 'DOLCE',
      description: 'Mini croissant classico',
      price: 1.10,
      image: '/images/mini_croissant.jpg',
      allergens: ['gluten', 'lactose'],
      dietary: []
    },
    {
      id: 16,
      name: 'Crostate e frolle',
      type: 'DOLCE',
      description: 'Assortimento di crostate e frolle',
      price: 1.50,
      image: '/images/crostate_e_frolle.jpg',
      allergens: ['gluten', 'lactose', 'eggs'],
      dietary: []
    },
    {
       id: 17,
      name: 'Biscotti assortiti',
      type: 'DOLCE',
      description: 'Biscotti di vario tipo',
      price: 0.50,
      image: '/images/biscotti_assortiti.jpg',
      allergens: ['gluten', 'lactose', 'eggs'],
      dietary: []
    },
    {
      id: 18,
      name: 'Mini crostate pesche',
      type: 'DOLCE',
      description: 'Mini crostate con pesche fresche',
      price: 1.00,
      image: '/images/mini_crostate_pesche.jpg',
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
      image: '/images/acqua_minerale_50cl.jpg',
      allergens: [],
      dietary: ['vegan']
    },
    {
      id: 21,
      name: 'Acqua minerale bottiglia 75 cl',
      type: 'ACQUA',
      description: 'Acqua minerale naturale in bottiglia da 75 cl',
      price: 1.80,
      image: '/images/acqua_minerale_75cl.jpg',
      allergens: [],
      dietary: ['vegan']
    },
    {
      id: 22,
      name: 'Acqua minerale bottiglia 150 cl',
      type: 'ACQUA',
      description: 'Acqua minerale naturale in bottiglia da 150 cl',
      price: 1.90,
      image: '/images/acqua_minerale_150cl.jpg',
      allergens: [],
      dietary: ['vegan']
    },
    {
      id: 23,
      name: 'Effervescente digestivo',
      type: 'DIGESTIVO',
      description: 'Bevanda effervescente digestiva',
      price: 1.50,
      image: '/images/effervescente_digestivo.jpg',
      allergens: [],
      dietary: ['vegan']
    },
    {
      id: 24,
      name: 'Succo di frutta 200 cl',
      type: 'SUCCO',
      description: 'Succo di frutta naturale da 200 cl',
      price: 2.80,
      image: '/images/succo_di_frutta_200cl.jpg',
      allergens: [],
      dietary: ['vegan']
    },
    {
      id: 25,
      name: 'Succo di frutta bio',
      type: 'SUCCO',
      description: 'Succo di frutta biologico',
      price: 3.50,
      image: '/images/succo_di_frutta_bio.jpg',
      allergens: [],
      dietary: ['vegan', 'organic']
    },
    {
      id: 26,
      name: 'Spremuta di agrumi',
      type: 'SPREMUTA',
      description: 'Spremuta fresca di agrumi',
      price: 3.50,
      image: '/images/spremuta_di_agrumi.jpg',
      allergens: [],
      dietary: ['vegan']
    },
    {
      id: 27,
      name: 'Spremuta di melograno',
      type: 'SPREMUTA',
      description: 'Spremuta fresca di melograno',
      price: 4.00,
      image: '/images/spremuta_di_melograno.jpg',
      allergens: [],
      dietary: ['vegan']
    },
    {
      id: 28,
      name: 'Bibite in bottiglia 20 cl',
      type: 'BIBITA',
      description: 'Bibite assortite in bottiglia da 20 cl',
      price: 2.60,
      image: '/images/bibite_20cl.jpg',
      allergens: [],
      dietary: []
    },
    {
      id: 29,
      name: 'Bibite in bottiglia 33 cl',
      type: 'BIBITA',
      description: 'Bibite assortite in bottiglia da 33 cl',
      price: 2.90,
      image: '/images/bibite_33cl.jpg',
      allergens: [],
      dietary: []
    },
    {
      id: 30,
      name: 'Bibite in bottiglia PET 45 cl',
      type: 'BIBITA',
      description: 'Bibite assortite in bottiglia PET da 45 cl',
      price: 2.90,
      image: '/images/bibite_pet_45cl.jpg',
      allergens: [],
      dietary: []
    },
    {
      id: 31,
      name: 'Bibite in bottiglia PET 50 cl',
      type: 'BIBITA',
      description: 'Bibite assortite in bottiglia PET da 50 cl',
      price: 2.90,
      image: '/images/bibite_pet_50cl.jpg',
      allergens: [],
      dietary: []
    },
    {
      id: 32,
      name: 'Bibite in lattina 250 cl',
      type: 'BIBITA',
      description: 'Bibite assortite in lattina da 250 cl',
      price: 2.10,
      image: '/images/bibite_lattina_250cl.jpg',
      allergens: [],
      dietary: []
    },
    {
      id: 33,
      name: 'Red Bull in lattina',
      type: 'ENERGY DRINK',
      description: 'Red Bull energy drink in lattina',
      price: 3.20,
      image: '/images/red_bull.jpg',
      allergens: [],
      dietary: []
    },
    {
      id: 34,
      name: 'Estathé brick',
      type: 'TÈ',
      description: 'Tè freddo Estathé in brick',
      price: 1.50,
      image: '/images/estathe.jpg',
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
      image: '/images/birra_ipa.jpg',
      allergens: ['gluten'],
      dietary: []
    },
    {
      id: 36,
      name: 'Calice di Vino Rosso',
      type: 'VINO',
      description: 'Calice di vino rosso selezionato',
      price: 4.50,
      image: '/images/vino_rosso.jpg',
      allergens: ['sulfites'],
      dietary: []
    },
    {
      id: 37,
      name: 'Mojito',
      type: 'COCKTAIL',
      description: 'Cocktail classico con rum, menta, lime e soda',
      price: 8.00,
      image: '/images/mojito.jpg',
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
      image: '/images/pasta_carbonara.jpg',
      allergens: ['gluten', 'eggs', 'lactose'],
      dietary: []
    },
    {
      id: 18,
      name: 'Insalata Caesar',
      type: 'SECONDO',
      description: 'Insalata Caesar con pollo grigliato',
      price: 7.00,
      image: '/images/insalata_caesar.jpg',
      allergens: ['eggs', 'lactose'],
      dietary: []
    },
    {
      id: 19,
      name: 'Risotto ai Porcini',
      type: 'PRIMO',
      description: 'Risotto cremoso con funghi porcini',
      price: 9.00,
      image: '/images/risotto_porcini.jpg',
      allergens: ['lactose'],
      dietary: []
    }
  ]
}

export const allergenIcons = {
  gluten: '🌾',
  lactose: '🥛',
  eggs: '🥚',
  peanuts: '🥜',
  nuts: '🌰',
  soy: '🌱',
  fish: '🐟',
  shellfish: '🦐',
  sulfites: '🍇'
}

export const dietaryIcons = {
  vegan: '🌱',
  vegetarian: '🥕',
  organic: '🌿'
}

