import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  TouchableOpacity, 
  Image, 
  Animated 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';

// You can reuse the same Product type from your models:
interface Product {
  id: string;
  imageUrl: string;
  title: string;
  price: string;
  originalPrice?: string;
  discount?: string;
}

interface GameChallengeProps {
  /** Any recommended products or items for the "Choose a Product" portion */
  gameOptions: Product[];
  /** Optional callback when game is completed */
  onComplete?: () => void;
  /** Product that was initially selected, if any */
  selectedProduct?: Product;
}

// Global cart state (in a real app, you'd use a state management solution)
let globalCart: {items: Product[], discounts: {productId: string, percent: number}[]} = {
  items: [],
  discounts: []
};

export const getCart = () => globalCart;
export const addToCart = (product: Product, discountPercent?: number) => {
  globalCart.items.push(product);
  if (discountPercent) {
    globalCart.discounts.push({
      productId: product.id,
      percent: discountPercent
    });
  }
};

export const GameChallenge: React.FC<GameChallengeProps> = ({ gameOptions, onComplete, selectedProduct }) => {
  const tintColor = useThemeColor({}, 'tint');
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({}, 'border');

  // State for spin wheel
  const [spinValue] = useState(new Animated.Value(0));
  // State controlling game flow
  const [showGameResult, setShowGameResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [gameReward, setGameReward] = useState<string>('');
  const [rewardPercent, setRewardPercent] = useState<number>(0);
  const [addedToCart, setAddedToCart] = useState(false);

  // Initialize with selected product if provided
  useEffect(() => {
    if (selectedProduct) {
      setSelectedOption(selectedProduct.id);
    }
  }, [selectedProduct]);

  const spinWheel = () => {
    Animated.timing(spinValue, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start(() => {
      // Once the spin finishes, show the result
      setShowGameResult(true);
      // Generate random reward between 5% and 30%
      const randomReward = Math.floor(Math.random() * 26) + 5;
      setRewardPercent(randomReward);
      setGameReward(`${randomReward}%`);
      // Call onComplete if provided
      onComplete?.();
    });
  };

  // Convert the animated value to a rotation (multiple full spins)
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '1080deg'],
  });

  const resetGame = () => {
    setShowGameResult(false);
    setSelectedOption(null);
    setGameCompleted(false);
    setGameReward('');
    setRewardPercent(0);
    setAddedToCart(false);
    spinValue.setValue(0);
  };

  const handleSelectOption = (id: string) => {
    setSelectedOption(id);
    setGameCompleted(true);
    // Generate random reward between 5% and 30%
    const randomReward = Math.floor(Math.random() * 26) + 5;
    setRewardPercent(randomReward);
    setGameReward(`${randomReward}%`);
    // Call onComplete if provided
    onComplete?.();
  };

  const handleAddToCart = () => {
    const productToAdd = selectedOption 
      ? gameOptions.find(p => p.id === selectedOption) 
      : selectedProduct || gameOptions[0];
    
    if (productToAdd) {
      addToCart(productToAdd, rewardPercent);
      setAddedToCart(true);
    }
  };

  const navigateToCart = () => {
    router.push('/cart');
  };

  const continueShopping = () => {
    // Close the game challenge if there's an onComplete callback
    if (onComplete) {
      onComplete();
    } else {
      // Otherwise just reset the game
      resetGame();
    }
  };

  return (
    <ThemedView style={[styles.gameContainer, { backgroundColor, borderColor }]}>
      {/* If the user hasn't finished either path (spin or pick) yet */}
      {!showGameResult && !gameCompleted ? (
        <>
          <ThemedText style={styles.gameInstructions}>
            Spin the wheel or pick your favorite team item to unlock exclusive NFL discounts!
          </ThemedText>
          <ThemedView style={styles.gameOptions}>
            {/* Spin Side */}
            <TouchableOpacity
              style={styles.spinContainer}
              onPress={spinWheel}
            >
              <ThemedText style={[styles.spinTitle, { color: '#013087' }]}>Spin To Win</ThemedText>
              <Animated.View
                style={[styles.wheel, { 
                  borderColor: '#013087', 
                  transform: [{ rotate: spin }],
                }]}
              >
                <Image
                  source={{
                    uri: 'https://images.unsplash.com/photo-1508098682722-e99c643e7820?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80'
                  }}
                  style={styles.wheelImage}
                  resizeMode="contain"
                />
                <Ionicons 
                  name="arrow-down" 
                  size={24} 
                  color="#013087" 
                  style={styles.wheelPointer} 
                />
              </Animated.View>
              <TouchableOpacity style={[styles.spinButton, { backgroundColor: '#013087' }]} onPress={spinWheel}>
                <ThemedText style={styles.spinButtonText}>SPIN NOW</ThemedText>
              </TouchableOpacity>
            </TouchableOpacity>

            {/* OR Divider */}
            <ThemedView style={styles.orDivider}>
              <ThemedText style={styles.orText}>OR</ThemedText>
            </ThemedView>

            {/* Choose a Product */}
            <ThemedView style={styles.recommendationOptions}>
              <ThemedText style={[styles.recommendationTitle, { color: '#013087' }]}>
                Choose a Product
              </ThemedText>
              {gameOptions.map(rec => (
                <TouchableOpacity
                  key={rec.id}
                  style={[
                    styles.recommendationOption,
                    {
                      borderColor: selectedOption === rec.id ? tintColor : borderColor
                    }
                  ]}
                  onPress={() => handleSelectOption(rec.id)}
                >
                  <Image source={{ uri: rec.imageUrl }} style={styles.recommendationImage} />
                  <ThemedView style={styles.recommendationInfo}>
                    <ThemedText numberOfLines={1} style={styles.recommendationName}>
                      {rec.title}
                    </ThemedText>
                    <ThemedText style={styles.recommendationPrice}>
                      {rec.price}
                    </ThemedText>
                  </ThemedView>
                </TouchableOpacity>
              ))}
            </ThemedView>
          </ThemedView>
        </>
      ) : (
        // If the user spun the wheel or selected a product, show the results
        <ThemedView style={styles.gameResultContainer}>
          <View style={styles.confetti}>
            <Ionicons name="trophy" size={40} color="#013087" />
          </View>
          <ThemedText style={styles.congratsText}>Congratulations!</ThemedText>
          <ThemedText style={styles.rewardText}>
            You've unlocked a{' '}
            <ThemedText style={{ fontWeight: 'bold', color: tintColor }}>
              {gameReward} discount
            </ThemedText>{' '}
            on your selected items!
          </ThemedText>
          <Image
            source={{
              uri: selectedOption
                ? gameOptions.find(r => r.id === selectedOption)?.imageUrl
                : selectedProduct?.imageUrl || gameOptions[0].imageUrl
            }}
            style={styles.rewardImage}
          />
          <ThemedText style={styles.rewardInstructions}>
            {addedToCart 
              ? 'Item has been added to your cart with your special discount!' 
              : 'Add this item to your cart with your special discount.'}
          </ThemedText>
          
          {!addedToCart ? (
            <TouchableOpacity 
              style={[styles.shopNowButton, { backgroundColor: tintColor }]}
              onPress={handleAddToCart}
            >
              <ThemedText style={styles.shopNowText}>ADD TO CART</ThemedText>
            </TouchableOpacity>
          ) : (
            <ThemedView style={styles.actionButtons}>
              <TouchableOpacity 
                style={[styles.checkoutButton, { backgroundColor: tintColor }]}
                onPress={navigateToCart}
              >
                <ThemedText style={styles.checkoutText}>CHECKOUT</ThemedText>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.continueShoppingButton, { borderColor: tintColor }]}
                onPress={continueShopping}
              >
                <ThemedText style={[styles.continueShoppingText, { color: tintColor }]}>
                  CONTINUE SHOPPING
                </ThemedText>
              </TouchableOpacity>
            </ThemedView>
          )}
        </ThemedView>
      )}

      {/* Footer */}
      <ThemedView style={styles.gameFooter}>
        <ThemedText style={styles.gameFooterText}>
          Official NFL Shop - Authentic Team Merchandise
        </ThemedText>
        <Ionicons name="football" size={14} color={tintColor} style={{ marginLeft: 5 }} />
      </ThemedView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  gameContainer: {
    borderWidth: 1,
    borderRadius: 4,
    padding: 16,
    marginBottom: 16,
  },
  gameInstructions: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 15,
    lineHeight: 20,
  },
  gameOptions: {
    flexDirection: 'row',
  },
  spinContainer: {
    width: '40%',
    alignItems: 'center',
  },
  spinTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  wheel: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 4,
  },
  wheelImage: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  wheelPointer: {
    position: 'absolute',
    top: -12,
    alignSelf: 'center',
  },
  spinButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginTop: 5,
  },
  spinButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  orDivider: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '10%',
    paddingHorizontal: 5,
  },
  orText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#565959',
  },
  recommendationOptions: {
    width: '50%',
  },
  recommendationTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  recommendationOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    padding: 5,
    borderWidth: 1,
    borderRadius: 4,
  },
  recommendationImage: {
    width: 40,
    height: 40,
    borderRadius: 3,
    marginRight: 8,
  },
  recommendationInfo: {
    flex: 1,
  },
  recommendationName: {
    fontSize: 12,
    marginBottom: 2,
  },
  recommendationPrice: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  gameResultContainer: {
    alignItems: 'center',
    padding: 10,
  },
  confetti: {
    marginBottom: 10,
  },
  congratsText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#013087',
    marginBottom: 10,
  },
  rewardText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 15,
    lineHeight: 22,
  },
  rewardImage: {
    width: 120,
    height: 120,
    borderRadius: 4,
    marginVertical: 15,
  },
  rewardInstructions: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  shopNowButton: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 4,
    marginBottom: 10,
  },
  shopNowText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  actionButtons: {
    width: '100%',
    alignItems: 'center',
  },
  checkoutButton: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 4,
    marginBottom: 10,
    width: '80%',
    alignItems: 'center',
  },
  checkoutText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  continueShoppingButton: {
    paddingVertical: 9,
    paddingHorizontal: 30,
    borderRadius: 4,
    marginBottom: 10,
    borderWidth: 1,
    width: '80%',
    alignItems: 'center',
  },
  continueShoppingText: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  playAgainButton: {
    paddingVertical: 8,
  },
  playAgainText: {
    color: '#007185',
    fontSize: 14,
  },
  gameFooter: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gameFooterText: {
    fontSize: 11,
    color: '#565959',
  }
});