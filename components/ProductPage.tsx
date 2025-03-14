import React, { useState } from 'react';
import { View, ScrollView, Image, StyleSheet, TouchableOpacity, Dimensions, Modal, SafeAreaView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { GameChallenge } from '@/components/GameChallenge';

// Types
interface ProductScreenProps {
  route: { params: { product: Product } };
  navigation: any;
}

interface Product {
  id: string;
  imageUrl: string;
  title: string;
  price: string;
  originalPrice?: string;
  discount?: string;
  rating?: number;
  reviewCount?: number;
  prime?: boolean;
}

// Mock data for recommendations 
const SIMILAR_PRODUCTS = [
  {
    id: 'sim1',
    imageUrl: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    title: 'NFL Team Sweatshirt - Premium',
    price: '$49.99',
    rating: 4.3,
    reviewCount: 2145,
    prime: true
  },
  {
    id: 'sim2',
    imageUrl: 'https://images.unsplash.com/photo-1587868578665-ec799bfe592e?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    title: 'NFL Team Beanie - Cold Weather Edition',
    price: '$24.99',
    rating: 4.5,
    reviewCount: 876,
    prime: true
  },
  {
    id: 'sim3',
    imageUrl: 'https://images.unsplash.com/photo-1621604474214-a64b3d182e4d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    title: 'NFL Autographed Mini Helmet - Collectible',
    price: '$159.99',
    rating: 4.8,
    reviewCount: 456,
    prime: true
  },
];

// Game challenge options
const GAME_RECOMMENDATIONS = [
  {
    id: 'rec1',
    imageUrl: 'https://images.unsplash.com/photo-1628891890467-b79f2c8ba9dc?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    title: 'NFL Team Logo Hat',
    price: '$24.99',
    originalPrice: '$34.99',
    discount: '29%'
  },
  {
    id: 'rec2',
    imageUrl: 'https://images.unsplash.com/photo-1518002171953-a080ee817e1f?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    title: 'Game Day Cap',
    price: '$29.99',
    originalPrice: '$39.99',
    discount: '25%'
  },
  {
    id: 'rec3',
    imageUrl: 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    title: 'Team Football',
    price: '$39.99',
    originalPrice: '$59.99',
    discount: '33%'
  }
];

const PRODUCT_IMAGES = [
  'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80&fit=facearea&facepad=20',
  'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80&sat=-100',
  'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80&flip=h',
];

export default function ProductScreen({ route, navigation }: ProductScreenProps) {
  const { product } = route.params;
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');
  const cardBgColor = useThemeColor({}, 'cardBackground');
  const borderColor = useThemeColor({}, 'border');
  
  const [currentImage, setCurrentImage] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [quantity, setQuantity] = useState(1);
  
  // Function to open the game challenge modal
  const openGameChallenge = () => {
    setModalVisible(true);
  };
  
  // Function to close the modal
  const closeModal = () => {
    setModalVisible(false);
  };
  
  // Function to go back
  const goBack = () => {
    navigation.goBack();
  };
  
  // Function to render stars based on rating
  const renderStars = (rating = 0, size = 16) => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map(star => (
          <Ionicons
            key={star}
            name={star <= Math.floor(rating) ? "star" : star <= rating ? "star-half" : "star-outline"}
            size={size}
            color="#FF9900"
            style={{ marginRight: 1 }}
          />
        ))}
      </View>
    );
  };
  
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor }}>
      {/* Header */}
      <ThemedView style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={textColor} />
        </TouchableOpacity>
        
        <ThemedView style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#777" style={styles.searchIcon} />
          <ThemedText style={styles.searchText}>Search NFL Shop</ThemedText>
        </ThemedView>
        
        <TouchableOpacity style={styles.cartButton}>
          <Ionicons name="cart-outline" size={24} color={textColor} />
          <View style={styles.cartBadge}>
            <ThemedText style={styles.cartBadgeText}>3</ThemedText>
          </View>
        </TouchableOpacity>
      </ThemedView>
      
      <ScrollView style={{ backgroundColor }} showsVerticalScrollIndicator={false}>
        {/* Product Images */}
        <ThemedView style={styles.imageGallery}>
          <Image
            source={{ uri: PRODUCT_IMAGES[currentImage] }}
            style={styles.mainImage}
            resizeMode="contain"
          />
          {/* Image selector */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.thumbnailScroll}>
            {PRODUCT_IMAGES.map((image, index) => (
              <TouchableOpacity 
                key={index}
                onPress={() => setCurrentImage(index)}
                style={[
                  styles.thumbnail,
                  currentImage === index && styles.selectedThumbnail
                ]}
              >
                <Image source={{ uri: image }} style={styles.thumbnailImage} />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </ThemedView>
        
        {/* Product Info Section */}
        <ThemedView style={styles.productInfo}>
          <ThemedText style={styles.title}>{product.title}</ThemedText>
          
          {/* Brand & Rating */}
          <TouchableOpacity style={styles.brandContainer}>
            <ThemedText style={styles.brand}>Visit the Official NFL Store</ThemedText>
          </TouchableOpacity>
          
          <ThemedView style={styles.ratingContainer}>
            {renderStars(product.rating)}
            <TouchableOpacity>
              <ThemedText style={styles.ratingText}>
                {product.rating?.toFixed(1)} ({product.reviewCount?.toLocaleString()} ratings)
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>
          
          {/* Amazon's Choice & Earn Button */}
          <ThemedView style={styles.badgeRow}>
            <View style={styles.amazonChoiceBadge}>
              <ThemedText style={styles.amazonChoiceText}>Amazon's <ThemedText style={{ fontWeight: 'bold' }}>Choice</ThemedText></ThemedText>
            </View>
            <TouchableOpacity 
              style={styles.earnButton}
              onPress={openGameChallenge}
            >
              <ThemedText style={styles.earnButtonText}>Earn</ThemedText>
            </TouchableOpacity>
          </ThemedView>
          
          {/* Price */}
          <ThemedView style={styles.priceContainer}>
            <ThemedText style={styles.priceText}>
              <ThemedText style={styles.priceSymbol}>$</ThemedText>
              <ThemedText style={styles.price}>{product.price.substring(1)}</ThemedText>
            </ThemedText>
            
            {product.originalPrice && (
              <ThemedView style={styles.originalPriceContainer}>
                <ThemedText style={styles.listPriceText}>List Price: </ThemedText>
                <ThemedText style={styles.originalPrice}>{product.originalPrice}</ThemedText>
              </ThemedView>
            )}
          </ThemedView>
          
          {/* Prime */}
          {product.prime && (
            <ThemedView style={styles.primeContainer}>
              <FontAwesome5 name="amazon" size={16} color="#00A8E1" />
              <ThemedText style={styles.primeText}>prime</ThemedText>
            </ThemedView>
          )}
          
          <ThemedText style={styles.deliveryText}>
            FREE delivery <ThemedText style={{ fontWeight: 'bold' }}>Tomorrow</ThemedText> if you order within 
            <ThemedText style={{ fontWeight: 'bold' }}> 12 hrs 30 mins</ThemedText>
          </ThemedText>
          
          {/* Location */}
          <TouchableOpacity style={styles.locationButton}>
            <Ionicons name="location-outline" size={16} color={tintColor} />
            <ThemedText style={styles.locationText}>Deliver to John - New York 10001</ThemedText>
          </TouchableOpacity>
          
          {/* In Stock */}
          <ThemedText style={styles.inStockText}>In Stock</ThemedText>
          
          {/* Quantity Selector */}
          <ThemedView style={styles.quantityContainer}>
            <ThemedText style={styles.quantityLabel}>Quantity: </ThemedText>
            <TouchableOpacity 
              style={[styles.quantityButton, styles.quantityDecrease]} 
              disabled={quantity <= 1}
              onPress={() => setQuantity(quantity - 1)}
            >
              <ThemedText style={styles.quantityButtonText}>-</ThemedText>
            </TouchableOpacity>
            <ThemedView style={styles.quantityValue}>
              <ThemedText>{quantity}</ThemedText>
            </ThemedView>
            <TouchableOpacity 
              style={[styles.quantityButton, styles.quantityIncrease]}
              onPress={() => setQuantity(quantity + 1)}
            >
              <ThemedText style={styles.quantityButtonText}>+</ThemedText>
            </TouchableOpacity>
          </ThemedView>
          
          {/* Buy Buttons */}
          <TouchableOpacity style={styles.addToCartButton}>
            <Ionicons name="cart" size={18} color="#000" style={{ marginRight: 8 }} />
            <ThemedText style={styles.addToCartText}>Add to Cart</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.buyNowButton}>
            <ThemedText style={styles.buyNowText}>Buy Now</ThemedText>
          </TouchableOpacity>
          
          <ThemedView style={styles.secureTransaction}>
            <Ionicons name="lock-closed" size={14} color="#555" />
            <ThemedText style={styles.secureText}>Secure transaction</ThemedText>
          </ThemedView>
          
          {/* Ships from */}
          <ThemedView style={styles.shipsFromContainer}>
            <ThemedText style={styles.shipsFromLabel}>Ships from</ThemedText>
            <ThemedText style={styles.shipsFromValue}>Amazon.com</ThemedText>
          </ThemedView>
          
          <ThemedView style={styles.soldByContainer}>
            <ThemedText style={styles.soldByLabel}>Sold by</ThemedText>
            <ThemedText style={styles.soldByValue}>Official NFL Shop</ThemedText>
          </ThemedView>
          
          {/* Return policy */}
          <ThemedView style={styles.returnContainer}>
            <ThemedText style={styles.returnLabel}>Return policy: </ThemedText>
            <ThemedText style={styles.returnValue}>Eligible for Return, Refund or Replacement within 30 days</ThemedText>
          </ThemedView>
          
          {/* Payment methods */}
          <TouchableOpacity style={styles.paymentContainer}>
            <ThemedText style={styles.paymentText}>Payment methods</ThemedText>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80' }} 
              style={styles.paymentImage} 
            />
          </TouchableOpacity>
        </ThemedView>
        
        {/* Divider */}
        <ThemedView style={styles.divider} />
        
        {/* About this item section */}
        <ThemedView style={styles.aboutSection}>
          <ThemedText style={styles.sectionTitle}>About this item</ThemedText>
          <ThemedView style={styles.bulletPoints}>
            <ThemedView style={styles.bulletPoint}>
              <ThemedText style={styles.bulletDot}>•</ThemedText>
              <ThemedText style={styles.bulletText}>Official NFL merchandise with authentic team colors and logos</ThemedText>
            </ThemedView>
            <ThemedView style={styles.bulletPoint}>
              <ThemedText style={styles.bulletDot}>•</ThemedText>
              <ThemedText style={styles.bulletText}>Made from high-quality, durable materials for long-lasting wear</ThemedText>
            </ThemedView>
            <ThemedView style={styles.bulletPoint}>
              <ThemedText style={styles.bulletDot}>•</ThemedText>
              <ThemedText style={styles.bulletText}>Perfect for game day, showing team pride, or as a gift for NFL fans</ThemedText>
            </ThemedView>
            <ThemedView style={styles.bulletPoint}>
              <ThemedText style={styles.bulletDot}>•</ThemedText>
              <ThemedText style={styles.bulletText}>Machine washable for easy care and maintenance</ThemedText>
            </ThemedView>
            <ThemedView style={styles.bulletPoint}>
              <ThemedText style={styles.bulletDot}>•</ThemedText>
              <ThemedText style={styles.bulletText}>Officially licensed product - guaranteed authentic</ThemedText>
            </ThemedView>
          </ThemedView>
        </ThemedView>
        
        {/* Divider */}
        <ThemedView style={styles.divider} />
        
        {/* Customer reviews section */}
        <ThemedView style={styles.reviewsSection}>
          <ThemedText style={styles.sectionTitle}>Customer Reviews</ThemedText>
          <ThemedView style={styles.reviewSummary}>
            <ThemedView style={styles.overallRating}>
              {renderStars(product.rating, 20)}
              <ThemedText style={styles.ratingAverage}>{product.rating?.toFixed(1)} out of 5</ThemedText>
            </ThemedView>
            <ThemedText style={styles.totalRatings}>{product.reviewCount?.toLocaleString()} global ratings</ThemedText>
            
            {/* Rating bars */}
            <ThemedView style={styles.ratingBars}>
              <TouchableOpacity style={styles.ratingBar}>
                <ThemedText style={styles.ratingBarLabel}>5 star</ThemedText>
                <View style={styles.ratingBarContainer}>
                  <View style={[styles.ratingBarFill, { width: '70%' }]} />
                </View>
                <ThemedText style={styles.ratingBarPercent}>70%</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity style={styles.ratingBar}>
                <ThemedText style={styles.ratingBarLabel}>4 star</ThemedText>
                <View style={styles.ratingBarContainer}>
                  <View style={[styles.ratingBarFill, { width: '15%' }]} />
                </View>
                <ThemedText style={styles.ratingBarPercent}>15%</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity style={styles.ratingBar}>
                <ThemedText style={styles.ratingBarLabel}>3 star</ThemedText>
                <View style={styles.ratingBarContainer}>
                  <View style={[styles.ratingBarFill, { width: '8%' }]} />
                </View>
                <ThemedText style={styles.ratingBarPercent}>8%</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity style={styles.ratingBar}>
                <ThemedText style={styles.ratingBarLabel}>2 star</ThemedText>
                <View style={styles.ratingBarContainer}>
                  <View style={[styles.ratingBarFill, { width: '4%' }]} />
                </View>
                <ThemedText style={styles.ratingBarPercent}>4%</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity style={styles.ratingBar}>
                <ThemedText style={styles.ratingBarLabel}>1 star</ThemedText>
                <View style={styles.ratingBarContainer}>
                  <View style={[styles.ratingBarFill, { width: '3%' }]} />
                </View>
                <ThemedText style={styles.ratingBarPercent}>3%</ThemedText>
              </TouchableOpacity>
            </ThemedView>
          </ThemedView>
          
          {/* Review CTA */}
          <TouchableOpacity style={styles.reviewCTA}>
            <ThemedText style={styles.reviewCTAText}>Write a customer review</ThemedText>
          </TouchableOpacity>
          
          {/* Sample review */}
          <ThemedView style={styles.reviewItem}>
            <ThemedView style={styles.reviewerInfo}>
              <Ionicons name="person-circle-outline" size={24} color={textColor} />
              <ThemedText style={styles.reviewerName}>John D.</ThemedText>
            </ThemedView>
            <ThemedView style={styles.reviewRating}>
              {renderStars(5, 14)}
              <ThemedText style={styles.reviewTitle}>Great quality, perfect fit!</ThemedText>
            </ThemedView>
            <ThemedText style={styles.reviewDate}>Reviewed in the United States on October 12, 2023</ThemedText>
            <ThemedText style={styles.verifiedPurchase}>Verified Purchase</ThemedText>
            <ThemedText style={styles.reviewContent}>
              This NFL merchandise exceeded my expectations! The quality is top-notch and it fits perfectly. 
              The colors are vibrant and match my team's colors exactly. I've already worn it to two games 
              and received many compliments. Highly recommend for any true fan!
            </ThemedText>
            <ThemedView style={styles.reviewHelp}>
              <ThemedText style={styles.reviewHelpText}>Was this review helpful?</ThemedText>
              <ThemedView style={styles.reviewButtons}>
                <TouchableOpacity style={styles.reviewButton}>
                  <ThemedText style={styles.reviewButtonText}>Yes</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity style={styles.reviewButton}>
                  <ThemedText style={styles.reviewButtonText}>No</ThemedText>
                </TouchableOpacity>
              </ThemedView>
            </ThemedView>
          </ThemedView>
          
          {/* See all reviews button */}
          <TouchableOpacity style={styles.seeAllButton}>
            <ThemedText style={styles.seeAllText}>See all reviews</ThemedText>
          </TouchableOpacity>
        </ThemedView>
        
        {/* Divider */}
        <ThemedView style={styles.divider} />
        
        {/* Similar products section */}
        <ThemedView style={styles.similarSection}>
          <ThemedText style={styles.sectionTitle}>Similar products you might like</ThemedText>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.similarScroll}>
            {SIMILAR_PRODUCTS.map(item => (
              <TouchableOpacity key={item.id} style={styles.similarItem}>
                <Image source={{ uri: item.imageUrl }} style={styles.similarImage} />
                <ThemedText numberOfLines={2} style={styles.similarTitle}>{item.title}</ThemedText>
                <ThemedView style={{ flexDirection: 'row' }}>
                  {renderStars(item.rating, 12)}
                  <ThemedText style={styles.similarReviews}>{item.reviewCount}</ThemedText>
                </ThemedView>
                <ThemedText style={styles.similarPrice}>{item.price}</ThemedText>
                {item.prime && (
                  <ThemedView style={styles.similarPrime}>
                    <FontAwesome5 name="amazon" size={10} color="#00A8E1" />
                    <ThemedText style={styles.similarPrimeText}>prime</ThemedText>
                  </ThemedView>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </ThemedView>
        
        {/* Bottom spacing */}
        <ThemedView style={{ height: 80 }} />
      </ScrollView>
      
      {/* Sticky Buy Bar at bottom */}
      <ThemedView style={[styles.stickyBar, { backgroundColor, borderTopColor: borderColor }]}>
        <ThemedView style={styles.stickyPrice}>
          <ThemedText style={styles.stickyPriceText}>{product.price}</ThemedText>
          {product.prime && (
            <ThemedView style={styles.stickyPrime}>
              <FontAwesome5 name="amazon" size={12} color="#00A8E1" />
              <ThemedText style={styles.stickyPrimeText}>prime</ThemedText>
            </ThemedView>
          )}
        </ThemedView>
        <TouchableOpacity style={styles.stickyButton}>
          <ThemedText style={styles.stickyButtonText}>Add to Cart</ThemedText>
        </TouchableOpacity>
      </ThemedView>
      
      {/* Game Challenge Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor }]}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                <Ionicons name="close" size={24} color={textColor} />
              </TouchableOpacity>
              <ThemedText style={styles.modalTitle}>NFL Game Challenge</ThemedText>
              <View style={{ width: 24 }} />
            </View>
            
            <View style={styles.selectedProductContainer}>
              <Image 
                source={{ uri: product.imageUrl }} 
                style={styles.selectedProductImage} 
              />
              <View style={styles.selectedProductInfo}>
                <ThemedText numberOfLines={2} style={styles.selectedProductTitle}>
                  {product.title}
                </ThemedText>
                <ThemedText style={styles.selectedProductPrice}>
                  {product.price}
                </ThemedText>
              </View>
            </View>
            
            {/* Game Challenge Component */}
            <GameChallenge 
              gameOptions={GAME_RECOMMENDATIONS} 
              onComplete={() => {
                // Handle game completion if needed
                setTimeout(() => {
                  closeModal();
                }, 5000); // Auto close after reward is shown
              }}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  backButton: {
    marginRight: 10,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchText: {
    color: '#777',
    fontSize: 14,
  },
  cartButton: {
    marginLeft: 10,
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    right: -6,
    top: -6,
    backgroundColor: '#FF9900',
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  imageGallery: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  mainImage: {
    width: Dimensions.get('window').width,
    height: 320,
  },
  thumbnailScroll: {
    paddingVertical: 10,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderWidth: 1,
    borderColor: '#ddd',
    marginHorizontal: 5,
    borderRadius: 3,
    overflow: 'hidden',
  },
  selectedThumbnail: {
    borderColor: '#FF9900',
    borderWidth: 2,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  productInfo: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    lineHeight: 24,
  },
  brandContainer: {
    marginBottom: 6,
  },
  brand: {
    fontSize: 14,
    color: '#007185',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: 6,
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    color: '#007185',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  amazonChoiceBadge: {
    backgroundColor: '#232F3E',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 3,
  },
  amazonChoiceText: {
    color: '#FFF',
    fontSize: 12,
  },
  earnButton: {
    marginLeft: 10,
    backgroundColor: '#013087',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 3,
  },
  earnButtonText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  priceContainer: {
    marginBottom: 8,
  },
  priceText: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  priceSymbol: {
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 1,
  },
  price: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  originalPriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  listPriceText: {
    fontSize: 13,
    color: '#565959',
  },
  originalPrice: {
    fontSize: 13,
    color: '#565959',
    textDecorationLine: 'line-through',
  },
  primeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  primeText: {
    color: '#00A8E1',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  deliveryText: {
    fontSize: 14,
    marginBottom: 8,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  locationText: {
    fontSize: 14,
    color: '#007185',
    marginLeft: 4,
  },
  inStockText: {
    fontSize: 16,
    color: '#007600',
    marginBottom: 10,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  quantityLabel: {
    fontSize: 14,
    marginRight: 8,
  },
  quantityButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  quantityDecrease: {
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
  },
  quantityIncrease: {
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  quantityButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  quantityValue: {
    width: 40,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  addToCartButton: {
    backgroundColor: '#FFD814',
    borderRadius: 20,
    padding: 12,
    alignItems: 'center',
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  addToCartText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000',
  },
  buyNowButton: {
    backgroundColor: '#FFA41C',
    borderRadius: 20,
    padding: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  buyNowText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000',
  },
  secureTransaction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  secureText: {
    fontSize: 12,
    color: '#565959',
    marginLeft: 4,
  },
  shipsFromContainer: {
    flexDirection: 'row',
    marginBottom: 3,
  },
  shipsFromLabel: {
    fontSize: 14,
    color: '#565959',
    width: 80,
  },
  shipsFromValue: {
    fontSize: 14,
  },
  soldByContainer: {
    flexDirection: 'row',
    marginBottom: 3,
  },
  soldByLabel: {
    fontSize: 14,
    color: '#565959',
    width: 80,
  },
  soldByValue: {
    fontSize: 14,
    color: '#007185',
  },
  returnContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  returnLabel: {
    fontSize: 14,
    color: '#565959',
  },
  returnValue: {
    fontSize: 14,
    flex: 1,
  },
  paymentContainer: {
    marginTop: 6,
  },
  paymentText: {
    fontSize: 14,
    color: '#007185',
    marginBottom: 4,
  },
  paymentImage: {
    height: 25,
    width: 150,
    resizeMode: 'contain',
  },
  divider: {
    height: 8,
    backgroundColor: '#f0f0f0',
  },
  aboutSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  bulletPoints: {
    marginLeft: 4,
  },
  bulletPoint: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  bulletDot: {
    fontSize: 14,
    marginRight: 8,
    width: 10,
  },
  bulletText: {
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
  },
  reviewsSection: {
    padding: 16,
  },
  reviewSummary: {
    marginBottom: 16,
  },
  overallRating: {
    marginBottom: 8,
  },
  ratingAverage: {
    fontSize: 16,
    marginTop: 4,
  },
  totalRatings: {
    fontSize: 14,
    color: '#565959',
    marginBottom: 12,
  },
  ratingBars: {
    marginVertical: 8,
  },
  ratingBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  ratingBarLabel: {
    width: 50,
    fontSize: 13,
    color: '#007185',
  },
  ratingBarContainer: {
    flex: 1,
    height: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginHorizontal: 8,
  },
  ratingBarFill: {
    height: '100%',
    backgroundColor: '#FFA41C',
    borderRadius: 8,
  },
  ratingBarPercent: {
    width: 40,
    fontSize: 13,
    textAlign: 'right',
  },
  reviewCTA: {
    backgroundColor: '#F0F2F2',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#D5D9D9',
    marginBottom: 16,
  },
  reviewCTAText: {
    fontSize: 14,
    textAlign: 'center',
  },
  reviewItem: {
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingVertical: 12,
  },
  reviewerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewerName: {
    fontSize: 14,
    marginLeft: 8,
  },
  reviewRating: {
    marginBottom: 4,
  },
  reviewTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 4,
  },
  reviewDate: {
    fontSize: 12,
    color: '#565959',
    marginBottom: 2,
  },
  verifiedPurchase: {
    fontSize: 12,
    color: '#C45500',
    marginBottom: 8,
  },
  reviewContent: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  reviewHelp: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewHelpText: {
    fontSize: 12,
    color: '#565959',
    marginRight: 10,
  },
  reviewButtons: {
    flexDirection: 'row',
  },
  reviewButton: {
    backgroundColor: '#F0F2F2',
    padding: 6,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#D5D9D9',
    marginRight: 8,
    minWidth: 40,
    alignItems: 'center',
  },
  reviewButtonText: {
    fontSize: 12,
  },
  seeAllButton: {
    marginTop: 12,
  },
  seeAllText: {
    fontSize: 14,
    color: '#007185',
    textAlign: 'center',
  },
  similarSection: {
    padding: 16,
  },
  similarScroll: {
    paddingVertical: 8,
  },
  similarItem: {
    width: 160,
    marginRight: 12,
  },
  similarImage: {
    width: 160,
    height: 160,
    marginBottom: 8,
    borderRadius: 4,
  },
  similarTitle: {
    fontSize: 13,
    marginBottom: 4,
    height: 36,
  },
  similarReviews: {
    fontSize: 12,
    color: '#007185',
    marginLeft: 4,
  },
  similarPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 4,
  },
  similarPrime: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  similarPrimeText: {
    color: '#00A8E1',
    fontSize: 11,
    fontWeight: 'bold',
    marginLeft: 3,
  },
  stickyBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    alignItems: 'center',
  },
  stickyPrice: {
    marginRight: 12,
  },
  stickyPriceText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  stickyPrime: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  stickyPrimeText: {
    color: '#00A8E1',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 2,
  },
  stickyButton: {
    flex: 1,
    backgroundColor: '#FFD814',
    borderRadius: 20,
    padding: 10,
    alignItems: 'center',
  },
  stickyButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  closeButton: {
    padding: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  selectedProductContainer: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  selectedProductImage: {
    width: 80,
    height: 80,
    borderRadius: 4,
  },
  selectedProductInfo: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'center',
  },
  selectedProductTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  selectedProductPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#013087',
  },
});