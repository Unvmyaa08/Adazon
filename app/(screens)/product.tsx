import React, { useEffect, useState } from 'react';
import { View, ScrollView, Image, StyleSheet, TouchableOpacity, Modal, SafeAreaView, Pressable, Platform, StatusBar } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Ionicons, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, router, useNavigation } from 'expo-router';
import GameAdPreview from '@/components/GameAdPreview';
import { products, Product } from '@/constants/product_data';

export default function ProductScreen() {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const params = useLocalSearchParams();
  const productId = params.id as string;

  // Get the product from the products object using the ID from params
  const product = products[productId] || {
    id: productId,
    title: params.title as string,
    price: params.price as string,
    originalPrice: params.originalPrice as string,
    discount: params.discount as string,
    rating: parseFloat(params.rating as string),
    reviewCount: parseInt(params.reviewCount as string),
    apparel: params.apparel === 'true',
    prime: params.prime === 'true',
    imageUrl: null
  };

  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');
  const borderColor = useThemeColor({}, 'border');
  const cardBackgroundColor = useThemeColor({}, 'cardBackground');

  const [currentImage, setCurrentImage] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('M');

  // Available sizes
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  // Open game challenge modal
  const openGameChallenge = () => {
    setModalVisible(true);
  };

  // Close modal
  const closeModal = () => {
    setModalVisible(false);
  };

  // Navigate back
  const goBack = () => {
    router.back();
  };

  // Change quantity
  const changeQuantity = (delta: number) => {
    setQuantity(Math.max(1, quantity + delta));
  };

  // Render star rating
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
      <ThemedView style={[styles.header, { borderBottomColor: borderColor }]}>
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
            source={product.imageUrl}
            style={styles.mainImage}
            resizeMode="contain"
          />

          {/* Image Dots Indicator */}
          <View style={styles.imageDots}>
            {[0, 1, 2, 3].map((dot) => (
              <View
                key={dot}
                style={[
                  styles.dot,
                  dot === currentImage ? { backgroundColor: tintColor, width: 8 } : { backgroundColor: borderColor }
                ]}
              />
            ))}
          </View>
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
            {/* Fixed Amazon's Choice Badge */}
            <View style={styles.amazonChoiceBadge}>
              <View style={styles.amazonChoiceTop}>
                <FontAwesome5 name="amazon" size={14} color="#FFF" style={styles.amazonIcon} />
                <ThemedText style={styles.amazonChoiceText}>
                  Amazon's <ThemedText style={styles.amazonChoiceBold}>Choice</ThemedText>
                </ThemedText>
              </View>
              <View style={styles.amazonChoiceBottom}>
                <ThemedText style={styles.amazonChoiceSubtext}>for "NFL Team Jersey"</ThemedText>
              </View>
            </View>

            <TouchableOpacity
              style={styles.earnButton}
              onPress={openGameChallenge}
            >
              <ThemedText style={styles.earnButtonText}>Earn 15% Off</ThemedText>
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
                <ThemedText style={styles.saveText}> Save {product.discount}</ThemedText>
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
            <ThemedText style={{ fontWeight: 'bold' }}> 12 hrs 45 mins</ThemedText>
          </ThemedText>

          {/* In Stock */}
          <ThemedText style={styles.inStockText}>In Stock</ThemedText>

          {product.apparel && (
            <ThemedView style={styles.sizeSection}>
              <ThemedText style={styles.sectionTitle}>
                Size: <ThemedText style={styles.selectedSizeText}>{selectedSize}</ThemedText>
              </ThemedText>
              <View style={styles.sizeContainer}>
                {sizes.map(size => (
                  <TouchableOpacity
                    key={size}
                    style={[
                      styles.sizeBox,
                      { borderColor: borderColor },
                      selectedSize === size && { borderColor: tintColor, borderWidth: 2 }
                    ]}
                    onPress={() => setSelectedSize(size)}
                  >
                    <ThemedText style={[
                      styles.sizeText,
                      selectedSize === size && { color: tintColor, fontWeight: 'bold' }
                    ]}>
                      {size}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            </ThemedView>
          )}


          {/* Quantity Selector */}
          <ThemedView style={styles.quantitySection}>
            <ThemedText style={styles.sectionTitle}>Quantity:</ThemedText>
            <View style={styles.quantitySelector}>
              <TouchableOpacity
                style={[styles.quantityButton, { borderColor }]}
                onPress={() => changeQuantity(-1)}
                disabled={quantity <= 1}
              >
                <ThemedText style={[styles.quantityButtonText, quantity <= 1 && { opacity: 0.5 }]}>−</ThemedText>
              </TouchableOpacity>
              <ThemedView style={[styles.quantityValue, { borderColor }]}>
                <ThemedText>{quantity}</ThemedText>
              </ThemedView>
              <TouchableOpacity
                style={[styles.quantityButton, { borderColor }]}
                onPress={() => changeQuantity(1)}
              >
                <ThemedText style={styles.quantityButtonText}>+</ThemedText>
              </TouchableOpacity>
            </View>
          </ThemedView>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={[styles.addToCartButton, { backgroundColor: '#FFD814' }]}>
              <ThemedText style={styles.addToCartText}>Add to Cart</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.buyNowButton, { backgroundColor: '#FFA41C' }]}>
              <ThemedText style={styles.buyNowText}>Buy Now</ThemedText>
            </TouchableOpacity>
          </View>

          {/* Quick Links Section */}
          <View style={[styles.quickLinks, { borderColor }]}>
            <TouchableOpacity style={styles.quickLink}>
              <ThemedText style={styles.quickLinkText}>Share</ThemedText>
              <MaterialIcons name="share" size={18} color="#007185" />
            </TouchableOpacity>

            <View style={[styles.divider, { backgroundColor: borderColor }]} />

            <TouchableOpacity style={styles.quickLink}>
              <ThemedText style={styles.quickLinkText}>Add to List</ThemedText>
              <Ionicons name="list" size={18} color="#007185" />
            </TouchableOpacity>
          </View>
        </ThemedView>

        {/* Product Details Section */}
        <ThemedView style={[styles.detailsSection, { borderTopColor: borderColor, borderBottomColor: borderColor }]}>
          <ThemedText style={styles.detailsTitle}>Product details</ThemedText>

          <View style={styles.detailItem}>
            <ThemedText style={styles.detailBullet}>•</ThemedText>
            <ThemedText style={styles.detailText}>100% Polyester</ThemedText>
          </View>

          <View style={styles.detailItem}>
            <ThemedText style={styles.detailBullet}>•</ThemedText>
            <ThemedText style={styles.detailText}>Imported, machine washable</ThemedText>
          </View>

          <View style={styles.detailItem}>
            <ThemedText style={styles.detailBullet}>•</ThemedText>
            <ThemedText style={styles.detailText}>Official licensed product with team colors and logo</ThemedText>
          </View>

          <View style={styles.detailItem}>
            <ThemedText style={styles.detailBullet}>•</ThemedText>
            <ThemedText style={styles.detailText}>Perfect for game day or everyday wear</ThemedText>
          </View>

          <TouchableOpacity style={styles.seeMore}>
            <ThemedText style={styles.seeMoreText}>See more product details</ThemedText>
          </TouchableOpacity>
        </ThemedView>

        {/* Customer Reviews Section Preview */}
        <ThemedView style={[styles.reviewsSection, { borderBottomColor: borderColor }]}>
          <View style={styles.reviewsHeader}>
            <ThemedText style={styles.sectionTitle}>Customer reviews</ThemedText>
            <TouchableOpacity>
              <ThemedText style={styles.seeAllText}>See all reviews</ThemedText>
            </TouchableOpacity>
          </View>

          <View style={styles.overallRating}>
            {renderStars(product.rating, 20)}
            <ThemedText style={styles.overallRatingText}>
              {product.rating?.toFixed(1)} out of 5
            </ThemedText>
          </View>

          <ThemedText style={styles.totalReviewsText}>
            {product.reviewCount?.toLocaleString()} global ratings
          </ThemedText>

          <TouchableOpacity style={[styles.reviewButton, { borderColor }]}>
            <ThemedText style={styles.reviewButtonText}>Write a review</ThemedText>
          </TouchableOpacity>
        </ThemedView>

        {/* Game challenge modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor }]}>
              <View style={[styles.modalHeader, { borderBottomColor: borderColor }]}>
                <ThemedText style={styles.modalTitle}>Earn 15% Discount</ThemedText>
                <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                  <Ionicons name="close" size={24} color={textColor} />
                </TouchableOpacity>
              </View>

              <ScrollView
                style={styles.modalScrollView}
                contentContainerStyle={styles.modalScrollContent}
                showsVerticalScrollIndicator={false}
              >
                <View style={styles.challengeIntro}>
                  <ThemedText style={styles.challengeIntroTitle}>
                    Test your NFL knowledge to unlock a special discount!
                  </ThemedText>
                  <ThemedText style={styles.challengeIntroSubtitle}>
                    Answer correctly to receive 15% off your purchase
                  </ThemedText>
                </View>

                <View style={styles.gameAdWrapper}>
                  <GameAdPreview product={product} />
                </View>

                <ThemedText style={styles.termsText}>
                  Offer valid for this purchase only. Cannot be combined with other promotions.
                </ThemedText>
              </ScrollView>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderBottomWidth: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  backButton: {
    padding: 8,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    marginHorizontal: 8,
    padding: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchText: {
    color: '#777',
    flex: 1,
  },
  cartButton: {
    padding: 8,
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    right: 0,
    top: 0,
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
  // Fixed Amazon's Choice Badge styles
  amazonChoiceBadge: {
    borderRadius: 3,
    overflow: 'hidden',
    alignSelf: 'flex-start', // Important: This makes badge take only needed width
    minWidth: 130, // Give it a minimum width to look properly proportioned
  },
  amazonChoiceTop: {
    backgroundColor: '#232F3E',
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  amazonChoiceBottom: {
    backgroundColor: '#5a95dc',
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  amazonChoiceText: {
    color: '#FFF',
    fontSize: 12,
  },
  amazonChoiceBold: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  amazonChoiceSubtext: {
    color: '#FFF',
    fontSize: 10,
  },
  amazonIcon: {
    marginRight: 4,
  },
  imageGallery: {
    padding: 10,
  },
  mainImage: {
    width: '100%',
    height: 300,
    marginBottom: 10,
  },
  imageDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 20,
  },
  dot: {
    height: 6,
    width: 6,
    borderRadius: 3,
    marginHorizontal: 3,
  },
  productInfo: {
    padding: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  brandContainer: {
    marginBottom: 8,
  },
  brand: {
    color: '#007185',
    fontSize: 14,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: 5,
  },
  ratingText: {
    color: '#007185',
    fontSize: 14,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'flex-start', // Align items at top
    marginBottom: 12,
    justifyContent: 'space-between', // Space between the badges
  },
  earnButton: {
    backgroundColor: '#013087',
    paddingHorizontal: 12,
    paddingVertical: 6, // Slightly increased vertical padding
    borderRadius: 3,
    alignSelf: 'flex-start', // Make it only as wide as needed
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
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  originalPriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  listPriceText: {
    fontSize: 14,
    color: '#565959',
  },
  originalPrice: {
    fontSize: 14,
    color: '#565959',
    textDecorationLine: 'line-through',
  },
  saveText: {
    fontSize: 14,
    color: '#CC0C39',
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
    lineHeight: 20,
    marginBottom: 8,
  },
  inStockText: {
    fontSize: 16,
    color: '#007600',
    fontWeight: '500',
    marginBottom: 12,
  },
  sizeSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 8,
  },
  selectedSizeText: {
    fontWeight: 'bold',
  },
  sizeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 5,
  },
  sizeBox: {
    borderWidth: 1,
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
    minWidth: 45,
    alignItems: 'center',
  },
  sizeText: {
    fontSize: 14,
  },
  quantitySection: {
    marginBottom: 16,
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    borderWidth: 1,
    borderRadius: 4,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  quantityValue: {
    borderWidth: 1,
    borderRadius: 4,
    height: 36,
    minWidth: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  actionButtons: {
    marginBottom: 16,
  },
  addToCartButton: {
    borderRadius: 50,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  addToCartText: {
    color: '#111',
    fontSize: 15,
    fontWeight: '500',
  },
  buyNowButton: {
    borderRadius: 50,
    paddingVertical: 12,
    alignItems: 'center',
  },
  buyNowText: {
    color: '#111',
    fontSize: 15,
    fontWeight: '500',
  },
  quickLinks: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    paddingVertical: 12,
    marginTop: 8,
  },
  quickLink: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickLinkText: {
    color: '#007185',
    marginRight: 6,
  },
  divider: {
    width: 1,
    height: '100%',
  },
  detailsSection: {
    padding: 15,
    borderTopWidth: 8,
    borderBottomWidth: 8,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  detailItem: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  detailBullet: {
    marginRight: 8,
    fontSize: 16,
  },
  detailText: {
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
  },
  seeMore: {
    marginTop: 6,
  },
  seeMoreText: {
    color: '#007185',
    fontSize: 14,
  },
  reviewsSection: {
    padding: 15,
    borderBottomWidth: 8,
  },
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  seeAllText: {
    color: '#007185',
    fontSize: 14,
  },
  overallRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  overallRatingText: {
    fontSize: 16,
    marginLeft: 8,
  },
  totalReviewsText: {
    fontSize: 14,
    marginBottom: 12,
  },
  reviewButton: {
    borderWidth: 1,
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  reviewButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 16,
  },
  modalContent: {
    width: '100%',
    maxHeight: '90%',
    borderRadius: 16,
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
    padding: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 4,
  },
  modalScrollView: {
    width: '100%',
  },
  modalScrollContent: {
    paddingBottom: 24,
    alignItems: 'center',
  },
  challengeIntro: {
    padding: 16,
    width: '100%',
    alignItems: 'center',
  },
  challengeIntroTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  challengeIntroSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.8,
  },
  gameAdWrapper: {
    marginVertical: 16,
    alignItems: 'center',
    width: '100%',
  },
  termsText: {
    fontSize: 12,
    textAlign: 'center',
    opacity: 0.6,
    paddingHorizontal: 24,
    marginTop: 8,
  },
});