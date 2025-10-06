import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Search, ShoppingCart, Plus, Minus, X, Menu, Moon, Sun } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { categories, products, allergenIcons, dietaryIcons } from './data.js'
import logoImage from './assets/logo.jpeg'
import './App.css'

function App() {
  const [selectedCategory, setSelectedCategory] = useState('caffetteria')
  const [searchTerm, setSearchTerm] = useState('')
  const [cart, setCart] = useState([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)

  // Carica il carrello dal localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('manus-cart')
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
    
    const savedTheme = localStorage.getItem('manus-theme')
    if (savedTheme === 'dark') {
      setIsDarkMode(true)
      document.documentElement.classList.add('dark')
    }
  }, [])

  // Salva il carrello nel localStorage
  useEffect(() => {
    localStorage.setItem('manus-cart', JSON.stringify(cart))
  }, [cart])

  // Gestione tema scuro/chiaro
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle('dark')
    localStorage.setItem('manus-theme', !isDarkMode ? 'dark' : 'light')
  }

  // Filtra i prodotti in base alla categoria e al termine di ricerca
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  // Aggiungi prodotto al carrello
  const addToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id)
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      } else {
        return [...prevCart, { ...product, quantity: 1 }]
      }
    })
  }

  // Rimuovi prodotto dal carrello
  const removeFromCart = (productId) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === productId)
      if (existingItem && existingItem.quantity > 1) {
        return prevCart.map(item =>
          item.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
      } else {
        return prevCart.filter(item => item.id !== productId)
      }
    })
  }

  // Rimuovi completamente un prodotto dal carrello
  const removeCompletelyFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId))
  }

  // Calcola il totale del carrello
  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0)
  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <img 
                src={logoImage} 
                alt="Manus Logo" 
                className="h-12 w-auto object-contain rounded-lg"
              />
              <div>
                <h1 className="text-2xl font-bold text-primary">Manus</h1>
                <p className="text-sm text-muted-foreground">Menu Digitale</p>
              </div>
            </div>

            {/* Azioni Header */}
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="rounded-full"
              >
                {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>

              <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="relative">
                    <ShoppingCart className="h-5 w-5" />
                    {cartItemsCount > 0 && (
                      <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs">
                        {cartItemsCount}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Carrello</SheetTitle>
                    <SheetDescription>
                      {cartItemsCount} {cartItemsCount === 1 ? 'articolo' : 'articoli'} nel carrello
                    </SheetDescription>
                  </SheetHeader>
                  
                  <div className="mt-6 space-y-4">
                    {cart.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">
                        Il carrello è vuoto
                      </p>
                    ) : (
                      <>
                        {cart.map(item => (
                          <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex-1">
                              <h4 className="font-medium">{item.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                €{item.price.toFixed(2)} x {item.quantity}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => removeFromCart(item.id)}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span className="w-8 text-center">{item.quantity}</span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => addToCart(item)}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive"
                                onClick={() => removeCompletelyFromCart(item.id)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                        
                        <div className="border-t pt-4">
                          <div className="flex justify-between items-center text-lg font-semibold">
                            <span>Totale:</span>
                            <span>€{cartTotal.toFixed(2)}</span>
                          </div>
                          <Button className="w-full mt-4" size="lg">
                            Procedi all'ordine
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Barra di ricerca */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Cerca prodotti..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Tabs per categorie */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-5 xl:grid-cols-9 mb-6">
            {categories.map(category => (
              <TabsTrigger key={category.id} value={category.id} className="text-xs">
                <span className="mr-1">{category.icon}</span>
                <span className="hidden sm:inline">{category.name}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Griglia prodotti */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {filteredProducts.map(product => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-video relative overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform hover:scale-105"
                      />
                    </div>
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{product.name}</CardTitle>
                        <Badge variant="secondary" className="text-lg font-semibold">
                          €{product.price.toFixed(2)}
                        </Badge>
                      </div>
                      <CardDescription className="text-sm">
                        {product.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      {/* Allergeni e info dietetiche */}
                      <div className="flex flex-wrap gap-1 mb-4">
                        {product.allergens.map(allergen => (
                          <Badge key={allergen} variant="outline" className="text-xs">
                            {allergenIcons[allergen]} {allergen}
                          </Badge>
                        ))}
                        {product.dietary.map(diet => (
                          <Badge key={diet} variant="secondary" className="text-xs">
                            {dietaryIcons[diet]} {diet}
                          </Badge>
                        ))}
                      </div>
                      
                      <Button 
                        onClick={() => addToCart(product)}
                        className="w-full"
                        size="sm"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Aggiungi al carrello
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                Nessun prodotto trovato per "{searchTerm}"
              </p>
            </div>
          )}
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/50 mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Manus - Menu Digitale</h3>
            <p className="text-muted-foreground">
              Un'esperienza culinaria moderna e interattiva
            </p>
            <div className="mt-4 text-sm text-muted-foreground">
              <p>Sviluppato con ❤️ per il settore della ristorazione</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
