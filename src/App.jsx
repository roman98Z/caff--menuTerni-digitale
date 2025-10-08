import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog.jsx'
import { Moon, Sun } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { categories, menuData, allergenIcons, dietaryIcons } from './data.js'
import logoImage from '/caff--menuTerni-digitale/assets/logo.jpeg'
import LoadingScreen from './components/LoadingScreen.jsx' // Importa il componente LoadingScreen
import './App.css'

function App() {
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isLoading, setIsLoading] = useState(true) // Stato per gestire la schermata di caricamento

  useEffect(() => {
    const savedTheme = localStorage.getItem('manus-theme')
    if (savedTheme === 'dark') {
      setIsDarkMode(true)
      document.documentElement.classList.add('dark')
    }
  }, [])

  // Gestione tema scuro/chiaro
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle('dark')
    localStorage.setItem('manus-theme', !isDarkMode ? 'dark' : 'light')
  }

  // Ottieni i prodotti della categoria selezionata
  const selectedProducts = selectedCategory ? menuData[selectedCategory.id] || [] : []

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  return (
    <>
      <AnimatePresence>
        {isLoading && <LoadingScreen onLoaded={handleLoadingComplete} />}
      </AnimatePresence>

      {!isLoading && (
        <div className="min-h-screen bg-background">
          {/* Header */}
          <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center space-x-3">
                  <img 
                    src={logoImage} 
                    alt="Linc Caffè Zero Logo" 
                    className="h-12 w-auto object-contain rounded-lg"
                  />
                  <div>
                    <h1 className="text-2xl font-bold text-primary">Linc Caffè Zero</h1>
                    <p className="text-sm text-muted-foreground">Terni</p>
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
                </div>
              </div>
            </div>
          </header>

          {/* Main Content - Griglia Categorie */}
          <main className="container mx-auto px-4 py-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2">Il Nostro Menu</h2>
              <p className="text-muted-foreground">Scopri le nostre specialità</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {categories.map(category => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card 
                    className="category-card cursor-pointer"
                    onClick={() => setSelectedCategory(category)}
                  >
                    <div className="category-image-container">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="category-image"
                      />
                      <div className="category-overlay" />
                    </div>
                    <div className="category-text-content">
                      <CardTitle className="text-xl font-bold leading-tight line-clamp-2 mb-2">{category.name}</CardTitle>
                      <CardDescription className="text-sm text-muted-foreground leading-tight line-clamp-2">
                        {category.description}
                      </CardDescription>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </main>

          {/* Modal Prodotti */}
          <Dialog open={!!selectedCategory} onOpenChange={() => setSelectedCategory(null)}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-4 sm:p-6 md:p-8">
              <DialogHeader className="mb-4">
                <DialogTitle className="text-3xl font-bold text-center">{selectedCategory?.name}</DialogTitle>
                <DialogDescription className="text-base text-center text-muted-foreground">
                  {selectedCategory?.description}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                {selectedProducts.map(product => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card className="overflow-hidden h-full flex flex-col">
                      <div className="aspect-video relative overflow-hidden">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardHeader className="pb-2 flex-grow">
                        <div className="flex justify-between items-start">
                          <div className="flex-1 pr-2">
                            <CardTitle className="text-lg font-semibold leading-tight">{product.name}</CardTitle>
                            <Badge variant="secondary" className="text-xs mt-1">
                              {product.type}
                            </Badge>
                          </div>
                          <Badge variant="outline" className="text-lg font-bold text-orange-600 flex-shrink-0">
                            €{product.price.toFixed(2)}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-2">
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {product.description}
                        </p>
                        
                        {/* Allergeni e info dietetiche */}
                        <div className="flex flex-wrap gap-1 mb-3">
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
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </DialogContent>
          </Dialog>

          {/* Footer */}
          <footer className="border-t bg-muted/50 mt-12">
            <div className="container mx-auto px-4 py-8">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Linc Caffè Zero - Terni</h3>
                <p className="text-muted-foreground">
                  Menu Digitale Interattivo
                </p>
                <div className="mt-4 text-sm text-muted-foreground">
                  <p>Sviluppato con ❤️ per il settore della ristorazione</p>
                </div>
              </div>
            </div>
          </footer>
        </div>
      )}
    </>
  )
}

export default App

