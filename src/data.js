// Dati del menu per Manus - Menu Digitale Interattivo

export const categories = [
  {
    id: 'caffetteria',
    name: 'Caffetteria',
    icon: '☕',
    description: 'Caffè, cappuccini e bevande calde'
  },
  {
    id: 'pasticceria',
    name: 'Pasticceria',
    icon: '🧁',
    description: 'Dolci freschi e pasticcini'
  },
  {
    id: 'yogurt',
    name: 'Yogurt',
    icon: '🥛',
    description: 'Yogurt freschi e frullati'
  },
  {
    id: 'merenda-salata',
    name: 'Merenda Salata',
    icon: '🥪',
    description: 'Panini e snack salati'
  },
  {
    id: 'pranzo',
    name: 'Pranzo',
    icon: '🍽️',
    description: 'Piatti principali e primi'
  },
  {
    id: 'apericena',
    name: 'Apericena',
    icon: '🍷',
    description: 'Aperitivi e stuzzichini'
  },
  {
    id: 'bevande',
    name: 'Bevande',
    icon: '🥤',
    description: 'Bibite e bevande fresche'
  },
  {
    id: 'vini-bollicine',
    name: 'Vini e Bollicine',
    icon: '🍾',
    description: 'Selezione di vini e spumanti'
  },
  {
    id: 'distillati',
    name: 'Distillati',
    icon: '🥃',
    description: 'Liquori e distillati pregiati'
  }
];

export const products = [
  // Caffetteria
  {
    id: 1,
    name: 'Espresso',
    category: 'caffetteria',
    price: 1.20,
    description: 'Caffè espresso italiano tradizionale',
    image: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=400',
    allergens: [],
    dietary: ['vegan']
  },
  {
    id: 2,
    name: 'Cappuccino',
    category: 'caffetteria',
    price: 1.80,
    description: 'Cappuccino cremoso con latte montato',
    image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400',
    allergens: ['lactose'],
    dietary: []
  },
  {
    id: 3,
    name: 'Caffè Americano',
    category: 'caffetteria',
    price: 1.50,
    description: 'Caffè lungo americano',
    image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=400',
    allergens: [],
    dietary: ['vegan']
  },

  // Pasticceria
  {
    id: 4,
    name: 'Cornetto alla Crema',
    category: 'pasticceria',
    price: 1.50,
    description: 'Cornetto fresco ripieno di crema pasticcera',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400',
    allergens: ['gluten', 'eggs', 'lactose'],
    dietary: []
  },
  {
    id: 5,
    name: 'Maritozzo',
    category: 'pasticceria',
    price: 2.50,
    description: 'Maritozzo romano con panna montata',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400',
    allergens: ['gluten', 'eggs', 'lactose'],
    dietary: []
  },

  // Yogurt
  {
    id: 6,
    name: 'Yogurt Greco con Miele',
    category: 'yogurt',
    price: 3.50,
    description: 'Yogurt greco cremoso con miele biologico',
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400',
    allergens: ['lactose'],
    dietary: ['organic']
  },
  {
    id: 7,
    name: 'Smoothie ai Frutti di Bosco',
    category: 'yogurt',
    price: 4.00,
    description: 'Frullato con yogurt e frutti di bosco freschi',
    image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=400',
    allergens: ['lactose'],
    dietary: []
  },

  // Merenda Salata
  {
    id: 8,
    name: 'Panino Prosciutto e Mozzarella',
    category: 'merenda-salata',
    price: 4.50,
    description: 'Panino con prosciutto crudo e mozzarella di bufala',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
    allergens: ['gluten', 'lactose'],
    dietary: []
  },
  {
    id: 9,
    name: 'Toast Vegetariano',
    category: 'merenda-salata',
    price: 3.50,
    description: 'Toast con verdure grigliate e formaggio',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400',
    allergens: ['gluten', 'lactose'],
    dietary: ['vegetarian']
  },

  // Pranzo
  {
    id: 10,
    name: 'Pasta alla Carbonara',
    category: 'pranzo',
    price: 8.50,
    description: 'Spaghetti alla carbonara tradizionale romana',
    image: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400',
    allergens: ['gluten', 'eggs', 'lactose'],
    dietary: []
  },
  {
    id: 11,
    name: 'Insalata Caesar',
    category: 'pranzo',
    price: 7.00,
    description: 'Insalata Caesar con pollo grigliato',
    image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400',
    allergens: ['eggs', 'lactose'],
    dietary: []
  },

  // Apericena
  {
    id: 12,
    name: 'Tagliere di Salumi',
    category: 'apericena',
    price: 12.00,
    description: 'Selezione di salumi italiani con formaggi',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400',
    allergens: ['lactose'],
    dietary: []
  },
  {
    id: 13,
    name: 'Bruschette Miste',
    category: 'apericena',
    price: 6.50,
    description: 'Bruschette con pomodoro, olive e basilico',
    image: 'https://images.unsplash.com/photo-1572441713132-51c75654db73?w=400',
    allergens: ['gluten'],
    dietary: ['vegan']
  },

  // Bevande
  {
    id: 14,
    name: 'Coca Cola',
    category: 'bevande',
    price: 2.50,
    description: 'Coca Cola 33cl',
    image: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=400',
    allergens: [],
    dietary: ['vegan']
  },
  {
    id: 15,
    name: 'Acqua Naturale',
    category: 'bevande',
    price: 1.50,
    description: 'Acqua naturale 50cl',
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400',
    allergens: [],
    dietary: ['vegan']
  },

  // Vini e Bollicine
  {
    id: 16,
    name: 'Prosecco di Valdobbiadene',
    category: 'vini-bollicine',
    price: 18.00,
    description: 'Prosecco DOCG Valdobbiadene',
    image: 'https://images.unsplash.com/photo-1510972527921-ce03766a1cf1?w=400',
    allergens: ['sulfites'],
    dietary: ['vegan']
  },
  {
    id: 17,
    name: 'Chianti Classico',
    category: 'vini-bollicine',
    price: 22.00,
    description: 'Chianti Classico DOCG',
    image: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=400',
    allergens: ['sulfites'],
    dietary: ['vegan']
  },

  // Distillati
  {
    id: 18,
    name: 'Grappa di Nebbiolo',
    category: 'distillati',
    price: 6.00,
    description: 'Grappa di Nebbiolo invecchiata',
    image: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=400',
    allergens: [],
    dietary: ['vegan']
  },
  {
    id: 19,
    name: 'Amaro del Capo',
    category: 'distillati',
    price: 4.50,
    description: 'Amaro calabrese alle erbe',
    image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400',
    allergens: [],
    dietary: ['vegan']
  }
];

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
