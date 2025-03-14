import React, { useState, useRef, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Animated,
  Easing,
  Platform, 
  Vibration,
  Image,
  Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import { Product } from '@/constants/product_data';

const { width } = Dimensions.get('window');
const isSmallDevice = width < 380;

interface GameAdPreviewProps {
  product?: Product;
}

const GameAdPreview: React.FC<GameAdPreviewProps> = ({ product }) => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;
  const [gameActive, setGameActive] = useState(true);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showReward, setShowReward] = useState(false);
  const [couponRevealed, setCouponRevealed] = useState(false);
  const [couponCopied, setCouponCopied] = useState(false);
  
  // Animation references
  const gameOverlayAnim = useRef(new Animated.Value(1)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const rewardAnim = useRef(new Animated.Value(0)).current;
  const couponAnim = useRef(new Animated.Value(0)).current;
  const couponPulseAnim = useRef(new Animated.Value(1)).current;
  const optionAnimations = useRef([...Array(4)].map(() => new Animated.Value(0))).current;

  // Default product values (fallback if no product is provided)
  const productTitle = product?.title || "Official NFL Team Jerseys";
  const productPrice = product?.price || "$99.99";
  const productOriginalPrice = product?.originalPrice || "$133.32";
  const productDiscount = product?.discount || "25%";
  const productRating = product?.rating || 4.5;
  const productReviewCount = product?.reviewCount || 3721;
  const isPrime = product?.prime || false;

  // Calculate discount percentage if not provided
  const getDiscountPercentage = () => {
    if (product?.discount) return product.discount;
    if (product?.originalPrice && product?.price) {
      const original = parseFloat(product.originalPrice.replace('$', ''));
      const current = parseFloat(product.price.replace('$', ''));
      if (original > current) {
        const percentage = Math.round(((original - current) / original) * 100);
        return `${percentage}%`;
      }
    }
    return "25%"; // Default
  };

  // Staggered animation for options
  React.useEffect(() => {
    if (gameActive) {
      Animated.stagger(100, 
        optionAnimations.map(anim => 
          Animated.spring(anim, {
            toValue: 1,
            friction: 8,
            tension: 40,
            useNativeDriver: true,
          })
        )
      ).start();
    }
  }, [gameActive]);

  // Pulse animation for coupon
  React.useEffect(() => {
    if (couponRevealed) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(couponPulseAnim, {
            toValue: 1.05,
            duration: 1000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(couponPulseAnim, {
            toValue: 1,
            duration: 1000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          })
        ])
      ).start();
    }
  }, [couponRevealed]);

  const handleAnswerSelect = useCallback((index: number) => {
    setSelectedAnswer(index);
    
    // Provide haptic feedback
    if (Platform.OS !== 'web') {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } catch (e) {
        Vibration.vibrate(40);
      }
    }
    
    // Correct answer (first option)
    if (index === 0) {
      // Animate reward
      setShowReward(true);
      Animated.sequence([
        Animated.timing(rewardAnim, {
          toValue: 1,
          duration: 600,
          easing: Easing.out(Easing.back(1.7)),
          useNativeDriver: true,
        }),
        Animated.delay(1200),
        Animated.timing(rewardAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setShowReward(false);
        setGameCompleted(true);
        setGameActive(false);
        
        // Hide game overlay with slight delay for smoother transition
        Animated.timing(gameOverlayAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
          delay: 200
        }).start();
        
        // Show coupon after a delay
        setTimeout(() => {
          Animated.spring(couponAnim, {
            toValue: 1,
            friction: 8,
            tension: 40,
            useNativeDriver: true,
          }).start();
          setCouponRevealed(true);
        }, 800);
      });
    } else {
      // Wrong answer - enhanced shake effect
      Animated.sequence([
        Animated.timing(shakeAnim, {
          toValue: 10,
          duration: 80,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: -10,
          duration: 80,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: 8,
          duration: 80,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: -8,
          duration: 80,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: 4,
          duration: 80,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: 0,
          duration: 80,
          useNativeDriver: true,
        })
      ]).start(() => setSelectedAnswer(null));
    }
  }, []);

  const revealCoupon = useCallback(() => {
    if (!couponCopied) {
      setCouponCopied(true);
      
      if (Platform.OS !== 'web') {
        try {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } catch (e) {
          Vibration.vibrate([0, 50, 30, 100]);
        }
      }
      
      // Scale animation for feedback
      Animated.sequence([
        Animated.timing(couponPulseAnim, {
          toValue: 1.15,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(couponPulseAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        })
      ]).start();
    }
  }, [couponCopied]);

  return (
    <View style={[
      styles.adContainer, 
      { 
        backgroundColor: theme.cardBackground,
        borderColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)', 
      }
    ]}>
      {/* Ad Header */}
      <View style={[styles.adHeader, { borderBottomColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }]}>
        <View style={styles.adBadgeRow}>
          <View style={styles.adTitleGroup}>
            <Ionicons name="game-controller" size={16} color={theme.tint} />
            <Text style={[styles.adHeaderText, { color: theme.text }]}>
              Interactive Ad
            </Text>
          </View>
          <View style={[styles.sponsoredBadge, { backgroundColor: theme.tint + '20' }]}>
            <Text style={[styles.sponsoredText, { color: theme.tint }]}>Sponsored</Text>
          </View>
        </View>
      </View>

      {/* Content Container */}
      <View style={styles.contentContainer}>
        {/* Jersey Image with overlay */}
        <View style={styles.imageContainer}>
          <Image 
            source={product?.imageUrl || {uri: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80'}}
            style={styles.jerseyImage}
            resizeMode="cover"
          />
          <LinearGradient
            colors={[
              'rgba(0,0,0,0.3)', 
              'rgba(0,0,0,0.01)'
            ]}
            style={styles.imageOverlay}
          />
        </View>

        {/* Game Overlay */}
        <Animated.View 
          style={[
            styles.gameOverlay,
            {
              opacity: gameOverlayAnim,
              transform: [
                { scale: gameOverlayAnim },
                { translateX: shakeAnim }
              ]
            }
          ]}
        >
          <LinearGradient
            colors={['rgba(0,0,0,0.85)', 'rgba(0,0,0,0.65)']}
            style={styles.gameOverlayGradient}
          >
            <View style={styles.questionContainer}>
              <Text style={styles.questionText}>
                What makes official NFL jerseys different from replicas?
              </Text>
              
              <View style={styles.optionsContainer}>
                {[
                  "Stitched numbers and embroidered logos",
                  "They glow in the dark",
                  "They have built-in cooling systems",
                  "Made of recycled materials only"
                ].map((option, index) => (
                  <Animated.View 
                    key={index}
                    style={{
                      opacity: optionAnimations[index],
                      transform: [
                        { translateY: optionAnimations[index].interpolate({
                          inputRange: [0, 1], 
                          outputRange: [20, 0]
                        })}
                      ]
                    }}
                  >
                    <TouchableOpacity
                      style={[
                        styles.optionButton,
                        selectedAnswer === index && index === 0 && styles.correctOption,
                        selectedAnswer === index && index !== 0 && styles.incorrectOption,
                        { 
                          backgroundColor: colorScheme === 'dark' 
                            ? 'rgba(255,255,255,0.9)' 
                            : 'rgba(255,255,255,0.95)' 
                        }
                      ]}
                      onPress={() => handleAnswerSelect(index)}
                      disabled={selectedAnswer !== null}
                      activeOpacity={0.7}
                    >
                      <Text style={[
                        styles.optionText,
                        selectedAnswer === index && (index === 0 
                          ? styles.correctOptionText 
                          : styles.incorrectOptionText)
                      ]}>
                        {option}
                      </Text>
                    </TouchableOpacity>
                  </Animated.View>
                ))}
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Reward Animation */}
        {showReward && (
          <Animated.View 
            style={[
              styles.rewardOverlay,
              {
                opacity: rewardAnim,
                transform: [{ scale: rewardAnim }]
              }
            ]}
          >
            <LinearGradient
              colors={['rgba(0,0,0,0.9)', 'rgba(0,0,0,0.75)']}
              style={styles.rewardGradient}
            >
              <View style={styles.rewardContent}>
                <View style={styles.rewardIconContainer}>
                  <Ionicons name="checkmark-circle" size={70} color="#4CAF50" style={styles.rewardIcon} />
                </View>
                <Text style={styles.rewardText}>Correct!</Text>
                <Text style={styles.rewardSubtext}>Unlocking special offer...</Text>
              </View>
            </LinearGradient>
          </Animated.View>
        )}

        {/* Coupon Reward */}
        {couponRevealed && (
          <Animated.View 
            style={[
              styles.couponContainer,
              {
                opacity: couponAnim,
                transform: [
                  { scale: couponAnim },
                  { scale: couponPulseAnim }
                ]
              }
            ]}
          >
            <TouchableOpacity 
              style={styles.couponContent}
              onPress={revealCoupon}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={['#FF9900', '#F05D23']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.couponGradient}
              >
                <View style={styles.couponInnerBorder}>
                  <View style={styles.couponTop}>
                    <Ionicons name="pricetag" size={22} color="white" />
                    <Text style={styles.couponTitle}>EXCLUSIVE OFFER</Text>
                  </View>
                  
                  <View style={styles.couponDivider} />
                  
                  <Text style={styles.couponValue}>15% OFF</Text>
                  <View style={styles.couponCodeContainer}>
                    <Text style={styles.couponCode}>
                      {couponCopied ? "COPIED!" : "NFLGAME"}
                    </Text>
                  </View>
                  
                  <View style={styles.couponBottom}>
                    <Text style={styles.couponExpiry}>Limited time offer</Text>
                    <View style={styles.couponAction}>
                      <Text style={styles.couponTap}>
                        {couponCopied ? "✓" : "Tap to copy"}
                      </Text>
                    </View>
                  </View>
                </View>
              </LinearGradient>
              
              {/* Decorative elements */}
              <View style={[styles.couponCircle, styles.couponCircleLeft]} />
              <View style={[styles.couponCircle, styles.couponCircleRight]} />
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>

      {/* Product Information */}
      <View style={styles.productInfoContainer}>
        <View style={styles.productHeader}>
          <Text style={[styles.productTitle, { color: theme.text }]}>
            {productTitle}
          </Text>
          <View style={styles.priceContainer}>
            <View style={styles.priceRow}>
              <Text style={[styles.priceText, { color: theme.error }]}>{productPrice}</Text>
              {productOriginalPrice && (
                <Text style={[styles.originalPrice, { color: theme.icon }]}>{productOriginalPrice}</Text>
              )}
            </View>
            {productDiscount && (
              <View style={[styles.discountBadge, { backgroundColor: theme.error }]}>
                <Text style={styles.discountText}>{getDiscountPercentage()} OFF</Text>
              </View>
            )}
          </View>
        </View>
        
        <View style={styles.productDetails}>
          <View style={styles.ratingContainer}>
            <View style={styles.stars}>
              {[1, 2, 3, 4, 5].map(i => (
                <Ionicons
                  key={i}
                  name={i <= Math.floor(productRating) ? "star" : i <= productRating ? "star-half" : "star-outline"}
                  size={16}
                  color="#FFB900"
                  style={{ marginRight: 2 }}
                />
              ))}
            </View>
            <Text style={[styles.ratingText, { color: theme.icon }]}>
              {productRating.toFixed(1)} ({productReviewCount.toLocaleString()})
            </Text>
          </View>
          
          {isPrime && (
            <View style={styles.deliveryRow}>
              <Ionicons name="checkmark-circle" size={16} color={theme.success} /> 
              <Text style={[styles.deliveryText, { color: theme.success }]}>
                Free Prime Delivery
              </Text>
            </View>
          )}
          
          <TouchableOpacity 
            style={[
              styles.shopButton, 
              { backgroundColor: theme.tint }
            ]}
            activeOpacity={0.8}
          >
            <Text style={styles.shopButtonText}>Shop Now</Text>
            <Ionicons name="chevron-forward" size={16} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  adContainer: {
    width: '100%',
    maxWidth: 340,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    borderWidth: 1,
  },
  adHeader: {
    padding: 12,
    borderBottomWidth: 1,
  },
  adBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  adTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  adHeaderText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  sponsoredBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  sponsoredText: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  contentContainer: {
    position: 'relative',
    width: '100%',
    height: 240,
    overflow: 'hidden',
  },
  imageContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  jerseyImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 60,
  },
  gameOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5,
  },
  gameOverlayGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  questionContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  questionText: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    letterSpacing: 0.3,
  },
  optionsContainer: {
    width: '100%',
    marginTop: 4,
  },
  optionButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  correctOption: {
    backgroundColor: 'rgba(76,175,80,0.95)',
    borderColor: '#388E3C',
  },
  incorrectOption: {
    backgroundColor: 'rgba(244,67,54,0.95)',
    borderColor: '#D32F2F',
  },
  optionText: {
    color: '#222',
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
  },
  correctOptionText: {
    color: 'white',
    fontWeight: '600',
  },
  incorrectOptionText: {
    color: 'white',
    fontWeight: '600',
  },
  rewardOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 15,
  },
  rewardGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rewardContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  rewardIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  rewardIcon: {
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
  },
  rewardText: {
    color: 'white',
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 8,
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  rewardSubtext: {
    color: 'white',
    fontSize: 15,
    opacity: 0.9,
    letterSpacing: 0.3,
  },
  couponContainer: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    zIndex: 20,
  },
  couponContent: {
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    position: 'relative',
  },
  couponGradient: {
    borderRadius: 12,
    padding: 2,
  },
  couponInnerBorder: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    borderRadius: 10,
    padding: 12,
  },
  couponTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  couponTitle: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
    letterSpacing: 1.2,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  couponDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginBottom: 8,
  },
  couponValue: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  couponCodeContainer: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingVertical: 4,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignSelf: 'center',
    marginTop: 4,
    marginBottom: 2,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  couponCode: {
    color: 'white',
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 1,
  },
  couponBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    alignItems: 'center',
  },
  couponExpiry: {
    color: 'white',
    fontSize: 12,
    opacity: 0.8,
  },
  couponAction: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  couponTap: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  couponCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    position: 'absolute',
    top: '50%',
    marginTop: -10,
  },
  couponCircleLeft: {
    left: -10,
  },
  couponCircleRight: {
    right: -10,
  },
  productInfoContainer: {
    padding: 16,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  productTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
    letterSpacing: 0.2,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  priceText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 8,
  },
  originalPrice: {
    fontSize: 16,
    textDecorationLine: 'line-through',
  },
  discountBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  discountText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  productDetails: {
    marginTop: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  stars: {
    flexDirection: 'row',
    marginRight: 6,
  },
  ratingText: {
    fontSize: 14,
  },
  deliveryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  deliveryText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
  shopButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginTop: 4,
  },
  shopButtonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
    marginRight: 4,
    letterSpacing: 0.3,
  }
});

export default GameAdPreview;