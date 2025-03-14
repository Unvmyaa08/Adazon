import React, { useState } from 'react';
import { View, ScrollView, Image, StyleSheet, TouchableOpacity, Dimensions, Modal, SafeAreaView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { GameChallenge } from '@/components/GameChallenge';
import { useLocalSearchParams, router } from 'expo-router';

// Types
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

// Product images for the gallery
const PRODUCT_IMAGES = [
  'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80&fit=facearea&facepad=20',
  'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80&sat=-100',
  'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80&flip=h',
];

// Similar products recommendations
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

export default function ProductScreen() {
  // Get the product ID from the URL params
  const params = useLocalSearchParams();
  
  // Create a product object from URL params
  const product = {
    id: params.id as string,
    imageUrl: params.imageUrl as string,
    title: params.title as string,
    price: params.price as string,
    originalPrice: params.originalPrice as string,
    discount: params.discount as string,
    rating: parseFloat(params.rating as string),
    reviewCount: parseInt(params.reviewCount as string),
    prime: params.prime === 'true',
  };
  
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');
  const borderColor = useThemeColor({}, 'border');
  
  const [currentImage, setCurrentImage] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [quantity, setQuantity] = useState(1);
  
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
                  { borderColor: currentImage === index ? '#FF9900' : borderColor },
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
            <ThemedText style={{ fontWeight: 'bold' }}> 12 hrs 45 mins</ThemedText>
          </ThemedText>
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
              
              <GameChallenge 
                gameOptions={GAME_RECOMMENDATIONS}
                onComplete={() => {
                  setTimeout(() => {
                    closeModal();
                  }, 5000);
                }}
              />
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
    padding: 10,
    borderBottomWidth: 1,
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
  imageGallery: {
    padding: 10,
  },
  mainImage: {
    width: '100%',
    height: 300,
    marginBottom: 10,
  },
  thumbnailScroll: {
    flexDirection: 'row',
  },
  thumbnail: {
    width: 60,
    height: 60,
    marginRight: 8,
    borderWidth: 1,
    borderRadius: 4,
    overflow: 'hidden',
  },
  selectedThumbnail: {
    borderWidth: 2,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
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
    alignItems: 'center',
    marginBottom: 12,
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
    backgroundColor: '#013087',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 3,
    marginLeft: 10,
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
  },
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