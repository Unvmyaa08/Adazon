import React, { useState } from 'react';
import { Image, StyleSheet, TextInput, ScrollView, TouchableOpacity, Platform, Dimensions, View, Animated, SafeAreaView, Modal } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { GameChallenge } from '@/components/GameChallenge';
import { router } from 'expo-router';

// Define types for our data models
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

// Define types for our data models
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

interface Category {
  id: string;
  name: string;
  icon: string; // Ionicons name
}

// Mock data for products using Unsplash images for NFL merchandise
const FEATURED_DEALS: Product[] = [
  {
    id: '1',
    imageUrl: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    title: 'Official NFL Team Jersey - Premium Quality',
    price: '$99.99',
    originalPrice: '$129.99',
    discount: '23%',
    rating: 4.5,
    reviewCount: 8567,
    prime: true
  },
  {
    id: '2',
    imageUrl: 'https://images.unsplash.com/photo-1610792516307-ea5acd9c3b00?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    title: 'NFL Stadium Hoodie - Authentic Team Gear',
    price: '$64.99',
    originalPrice: '$89.99',
    discount: '28%',
    rating: 4.2,
    reviewCount: 3452,
    prime: true
  },
  {
    id: '3',
    imageUrl: 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    title: 'NFL Team Logo Football - Official Size',
    price: '$39.99',
    originalPrice: '$59.99',
    discount: '33%',
    rating: 4.7,
    reviewCount: 6932,
    prime: true
  },
  {
    id: '4',
    imageUrl: 'https://images.unsplash.com/photo-1518002171953-a080ee817e1f?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    title: 'NFL Championship Cap - Adjustable Fit',
    price: '$29.99',
    originalPrice: '$39.99',
    discount: '25%',
    rating: 4.4,
    reviewCount: 4521,
    prime: true
  },
];

// Featured recommendations
const RECOMMENDATIONS: Product[] = [
  {
    id: '5',
    imageUrl: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    title: 'NFL Stadium Blanket - Team Colors',
    price: '$49.99',
    rating: 4.3,
    reviewCount: 2145,
    prime: true
  },
  {
    id: '6',
    imageUrl: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    title: 'NFL Tailgate Folding Chair - Team Logo',
    price: '$39.99',
    rating: 4.1,
    reviewCount: 1890,
    prime: true
  },
  {
    id: '7',
    imageUrl: 'https://images.unsplash.com/photo-1551808525-51a94da548ce?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    title: 'NFL Team Backpack - Gameday Edition',
    price: '$54.99',
    rating: 4.5,
    reviewCount: 3823,
    prime: false
  },
  {
    id: '8',
    imageUrl: 'https://images.unsplash.com/photo-1575361013659-f0f68285bd89?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    title: 'NFL Player Bobblehead - Collectible Series',
    price: '$24.95',
    rating: 4.2,
    reviewCount: 2527,
    prime: true
  },
];

// Banner images from Unsplash
const BANNER_IMAGES = [
  'https://images.unsplash.com/photo-1504450758481-7338eba7524a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1566577134770-3d85bb3a9cc4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1587515724040-d2c48c02e1df?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'
];

// Mock categories
const CATEGORIES: Category[] = [
  { id: '1', name: 'Jerseys', icon: 'shirt' },
  { id: '2', name: 'Hats', icon: 'umbrella' },
  { id: '3', name: 'Collectibles', icon: 'trophy' },
  { id: '4', name: 'Tailgating', icon: 'flame' },
  { id: '5', name: 'Footwear', icon: 'footsteps' },
  { id: '6', name: 'Accessories', icon: 'watch' },
  { id: '7', name: 'Sale', icon: 'pricetag' },
  { id: '8', name: 'New Arrivals', icon: 'star' },
];

// Game recommendation options
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

export default function HomeScreen() {
  const tintColor = useThemeColor({}, 'tint');
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const cardBgColor = useThemeColor({}, 'cardBackground');
  const borderColor = useThemeColor({}, 'border');
  
  const [currentBanner, setCurrentBanner] = useState(0);
  const [showGameResult, setShowGameResult] = useState(false);
  const [spinValue] = useState(new Animated.Value(0));
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [gameReward, setGameReward] = useState('');
  
  // Modified to navigate to Product screen instead of showing modal


// Modified to navigate to Product screen using Expo Router
const handleProductPress = (product: Product) => {
  router.push({
    pathname: '/product',
    params: {
      id: product.id,
      imageUrl: product.imageUrl,
      title: product.title,
      price: product.price,
      originalPrice: product.originalPrice || '',
      discount: product.discount || '',
      rating: product.rating?.toString() || '0',
      reviewCount: product.reviewCount?.toString() || '0',
      prime: product.prime ? 'true' : 'false',
    }
  });
};


  // Convert the animated value to a rotation
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '1080deg'], // multiple full rotations
  });

  const resetGame = () => {
    setShowGameResult(false);
    setSelectedOption(null);
    setGameCompleted(false);
    setGameReward('');
    spinValue.setValue(0);
  };

  const handleSelectOption = (id: string) => {
    setSelectedOption(id);
    setGameCompleted(true);
    // Generate random reward between 5% and 30%
    const randomReward = Math.floor(Math.random() * 26) + 5;
    setGameReward(`${randomReward}%`);
  };
  


  // Render product item without using FlatList
  const renderProductItems = (products: Product[]) => {
    return (
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.productsContainer}
      >
        {products.map(item => (
          <TouchableOpacity 
            key={item.id} 
            style={[styles.productCard, { backgroundColor, borderColor }]}
            onPress={() => handleProductPress(item)}
          >
            <Image source={{ uri: item.imageUrl }} style={styles.productImage} />
            {item.discount && (
              <View style={styles.discountBadge}>
                <ThemedText style={styles.discountText}>-{item.discount}</ThemedText>
              </View>
            )}
            <ThemedView style={styles.productInfo}>
              <ThemedText numberOfLines={2} style={styles.productTitle}>{item.title}</ThemedText>
              {/* Rating */}
              {item.rating && (
                <ThemedView style={styles.ratingContainer}>
                  <ThemedView style={styles.starsContainer}>
                    {[1, 2, 3, 4, 5].map(star => (
                      <Ionicons
                        key={star}
                        name={star <= Math.floor(item.rating || 0) ? "star" : star <= (item.rating || 0) ? "star-half" : "star-outline"}
                        size={14}
                        color="#FF9900"
                        style={{ marginRight: 1 }}
                      />
                    ))}
                  </ThemedView>
                  <ThemedText style={styles.reviewCount}>{item.reviewCount?.toLocaleString()}</ThemedText>
                </ThemedView>
              )}
              <ThemedView style={styles.priceContainer}>
                <ThemedText style={styles.priceSymbol}>$</ThemedText>
                <ThemedText style={styles.price}>{item.price.substring(1)}</ThemedText>
                {item.originalPrice && (
                  <ThemedText style={styles.originalPrice}>{item.originalPrice}</ThemedText>
                )}
              </ThemedView>
              {/* Prime badge */}
              {item.prime && (
                <ThemedView style={styles.primeContainer}>
                  <FontAwesome5 name="amazon" size={12} color="#00A8E1" />
                  <ThemedText style={styles.primeText}>prime</ThemedText>
                </ThemedView>
              )}
              {/* Get it by */}
              <ThemedText style={styles.deliveryDate}>Get it by <ThemedText style={{ fontWeight: 'bold' }}>Tomorrow</ThemedText></ThemedText>
              {/* Free delivery */}
              <ThemedText style={styles.freeDelivery}>FREE Delivery</ThemedText>
            </ThemedView>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  // Render categories without using FlatList
  const renderCategories = () => {
    return (
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
      >
        {CATEGORIES.map(item => (
          <TouchableOpacity key={item.id} style={styles.categoryItem}>
            <Ionicons name={item.icon as any} size={24} color={tintColor} />
            <ThemedText style={styles.categoryName}>{item.name}</ThemedText>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  // Render grid items without using FlatList
  const renderGridItems = () => {
    return (
      <ThemedView style={styles.gridContainer}>
        <ThemedView style={styles.gridColumnWrapper}>
          {RECOMMENDATIONS.slice(0, 2).map(item => renderGridItem(item))}
        </ThemedView>
        <ThemedView style={styles.gridColumnWrapper}>
          {RECOMMENDATIONS.slice(2, 4).map(item => renderGridItem(item))}
        </ThemedView>
      </ThemedView>
    );
  };

  // Render a single grid item
  const renderGridItem = (item: Product) => (
    <TouchableOpacity 
      key={item.id} 
      style={styles.gridItem}
      onPress={() => handleProductPress(item)}
    >
      <Image source={{ uri: item.imageUrl }} style={styles.gridItemImage} />
      <ThemedText numberOfLines={2} style={styles.gridItemTitle}>{item.title}</ThemedText>
      <ThemedView style={styles.gridItemRating}>
        {[1, 2, 3, 4, 5].map(star => (
          <Ionicons
            key={star}
            name={star <= Math.floor(item.rating || 0) ? "star" : star <= (item.rating || 0) ? "star-half" : "star-outline"}
            size={12}
            color="#FF9900"
            style={{ marginRight: 1 }}
          />
        ))}
        <ThemedText style={styles.gridItemReviews}>{item.reviewCount?.toLocaleString()}</ThemedText>
      </ThemedView>
      <ThemedView style={styles.gridItemPrice}>
        <ThemedText style={styles.gridItemPriceSymbol}>$</ThemedText>
        <ThemedText style={styles.gridItemPriceValue}>{item.price.substring(1)}</ThemedText>
      </ThemedView>
      {item.prime && (
        <ThemedView style={styles.gridItemPrime}>
          <FontAwesome5 name="amazon" size={10} color="#00A8E1" />
          <ThemedText style={styles.gridItemPrimeText}>prime</ThemedText>
        </ThemedView>
      )}
    </TouchableOpacity>
  );

  return (
    <>
      {/* Header with safe area */}
      <SafeAreaView style={{ backgroundColor: tintColor }}>
        <ThemedView style={[styles.headerImageContainer, { backgroundColor: tintColor }]}>
          <TouchableOpacity style={styles.menuButton}>
            <Ionicons name="menu" size={24} color="#fff" />
          </TouchableOpacity>
          <ThemedView style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#333" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search NFL Shop"
              placeholderTextColor="#777"
            />
            <TouchableOpacity style={styles.cameraButton}>
              <Ionicons name="camera" size={20} color="#333" />
            </TouchableOpacity>
          </ThemedView>
          <TouchableOpacity style={styles.cartButton}>
            <Ionicons name="cart-outline" size={26} color="#fff" />
            <View style={styles.cartBadge}>
              <ThemedText style={styles.cartBadgeText}>3</ThemedText>
            </View>
          </TouchableOpacity>
        </ThemedView>
      </SafeAreaView>
      
      {/* Main content */}
      <ScrollView 
        style={{ backgroundColor }}
        showsVerticalScrollIndicator={false}
      >
        {/* Delivery Banner */}
        <TouchableOpacity style={[styles.deliveryBanner, { borderColor }]}>
          <Ionicons name="location-outline" size={18} color={textColor} />
          <ThemedText style={styles.deliveryText}>Deliver to John - New York 10001</ThemedText>
          <Ionicons name="chevron-down" size={16} color={textColor} />
        </TouchableOpacity>
        
        {/* Banner Carousel */}
        <View style={styles.carouselContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            onMomentumScrollEnd={(e) => {
              const offset = e.nativeEvent.contentOffset.x;
              const index = Math.round(offset / (Dimensions.get('window').width - 20));
              setCurrentBanner(index);
            }}
          >
            {BANNER_IMAGES.map((image, index) => (
              <Image
                key={index}
                source={{ uri: image }}
                style={styles.banner}
                resizeMode="cover"
              />
            ))}
          </ScrollView>
          {/* Carousel indicators */}
          <View style={styles.indicatorContainer}>
            {BANNER_IMAGES.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.indicator,
                  { backgroundColor: currentBanner === index ? '#fff' : 'rgba(255,255,255,0.5)' }
                ]}
              />
            ))}
          </View>
        </View>
        
        {/* Categories Section */}
        <ThemedView style={styles.sectionContainer}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Shop NFL Categories</ThemedText>
          {renderCategories()}
        </ThemedView>
        
        {/* Deal of the Day */}
        <ThemedView style={[styles.sectionContainer, { marginTop: 10 }]}>
          <ThemedView style={styles.sectionHeader}>
            <ThemedView style={styles.dealHeader}>
              <Ionicons name="flash" size={22} color="#DD5144" />
              <ThemedText type="subtitle" style={[styles.sectionTitle, { color: '#DD5144', marginLeft: 5 }]}>
                NFL Deal of the Day
              </ThemedText>
            </ThemedView>
            <TouchableOpacity>
              <ThemedText style={{ color: tintColor }}>See all</ThemedText>
            </TouchableOpacity>
          </ThemedView>
          
          {/* Deal card in NFL style */}
          <TouchableOpacity 
            style={[styles.dealCard, { backgroundColor, borderColor }]}
            onPress={() => handleProductPress({
              id: 'deal1',
              imageUrl: 'https://images.unsplash.com/photo-1566577134770-3d85bb3a9cc4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
              title: 'Official NFL Jerseys',
              price: '$99.99',
              originalPrice: '$199.99',
              discount: '50%'
            })}
          >
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1566577134770-3d85bb3a9cc4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80' }}
              style={styles.dealImage}
            />
            <ThemedView style={styles.dealInfo}>
              <View style={styles.dealSavingBadge}>
                <ThemedText style={styles.dealSavingText}>Up to 50% off</ThemedText>
              </View>
              <ThemedText style={styles.dealTitle}>Official NFL Jerseys</ThemedText>
              <ThemedText style={styles.dealDescription}>
                Premium team jerseys from all 32 NFL teams - Limited time offer
              </ThemedText>
              <ThemedText style={styles.dealTimer}>Ends in 12:34:56</ThemedText>
            </ThemedView>
          </TouchableOpacity>
        </ThemedView>
        
         {/* NFL Gameday Challenge/Reward Section */}
      <ThemedView style={styles.sectionContainer}>
        {/* Add a header or title if you want */}
        <ThemedView style={styles.gameHeader}>
          <Ionicons name="football" size={22} color="#013087" />
          <ThemedText type="subtitle" style={[styles.gameTitle, { color: '#013087' }]}>
            NFL Gameday Challenge
          </ThemedText>
          <View style={styles.sponsoredTag}>
            <ThemedText style={styles.sponsoredText}>Sponsored</ThemedText>
          </View>
        </ThemedView>

        {/* Use the extracted component */}
        <GameChallenge 
          gameOptions={GAME_RECOMMENDATIONS} 
          onComplete={() => {
            // Optional callback when game completes
          }}
        />
      </ThemedView>
        
        {/* Featured Deals */}
        <ThemedView style={styles.sectionContainer}>
          <ThemedView style={styles.sectionHeader}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>NFL Limited-time deals</ThemedText>
            <TouchableOpacity>
              <ThemedText style={{ color: tintColor }}>See all</ThemedText>
            </TouchableOpacity>
          </ThemedView>
          {renderProductItems(FEATURED_DEALS)}
        </ThemedView>
        
        {/* Recommendations Grid */}
        <ThemedView style={styles.sectionContainer}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Recommended For You</ThemedText>
          {renderGridItems()}
        </ThemedView>
        
        {/* Recently Viewed */}
        <ThemedView style={styles.sectionContainer}>
          <ThemedView style={styles.sectionHeader}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>Your Recently Viewed Items</ThemedText>
            <TouchableOpacity>
              <ThemedText style={{ color: tintColor }}>See all</ThemedText>
            </TouchableOpacity>
          </ThemedView>
          {renderProductItems(RECOMMENDATIONS.slice(0, 3))}
        </ThemedView>
        
        {/* Bottom spacing */}
        <ThemedView style={{ height: 20 }} />
      </ScrollView>

    </>
  );
}

const styles = StyleSheet.create({
  headerImageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    width: '100%',
  },
  menuButton: {
    padding: 5,
  },
  searchContainer: {
    flex: 1,
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    paddingHorizontal: 8,
    color: '#333',
  },
  searchIcon: {
    marginLeft: 8,
  },
  cameraButton: {
    padding: 5,
    marginRight: 5,
  },
  cartButton: {
    padding: 5,
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
  deliveryBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  deliveryText: {
    fontSize: 13,
    marginHorizontal: 8,
    flex: 1,
  },
  carouselContainer: {
    position: 'relative',
    marginVertical: 8,
  },
  banner: {
    width: Dimensions.get('window').width - 20,
    height: 180,
    marginHorizontal: 10,
    borderRadius: 8,
  },
  indicatorContainer: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 3,
  },
  sectionContainer: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dealHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  categoriesContainer: {
    paddingBottom: 12,
  },
  categoryItem: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    width: 70,
  },
  categoryName: {
    marginTop: 8,
    fontSize: 12,
    textAlign: 'center',
  },
  productsContainer: {
    paddingBottom: 16,
  },
  productCard: {
    width: 180,
    marginRight: 12,
    borderRadius: 4,
    overflow: 'hidden',
    borderWidth: 1,
  },
  productImage: {
    width: '100%',
    height: 180,
  },
  discountBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#013087',
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 2,
  },
  discountText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  productInfo: {
    padding: 10,
  },
  productTitle: {
    fontSize: 14,
    marginBottom: 6,
    lineHeight: 18,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  starsContainer: {
    flexDirection: 'row',
  },
  reviewCount: {
    fontSize: 12,
    marginLeft: 4,
    color: '#007185',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginVertical: 4,
  },
  priceSymbol: {
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: 1,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  originalPrice: {
    fontSize: 12,
    textDecorationLine: 'line-through',
    marginLeft: 6,
    color: '#565959',
  },
  primeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  primeText: {
    color: '#00A8E1',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 2,
  },
  deliveryDate: {
    fontSize: 12,
    marginVertical: 3,
  },
  freeDelivery: {
    fontSize: 12,
    color: '#565959',
  },
  dealCard: {
    flexDirection: 'row',
    borderRadius: 4,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 16,
  },
  dealImage: {
    width: 120,
    height: 120,
  },
  dealInfo: {
    flex: 1,
    padding: 10,
  },
  dealSavingBadge: {
    backgroundColor: '#013087',
    alignSelf: 'flex-start',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 2,
    marginBottom: 6,
  },
  dealSavingText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  dealTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  dealDescription: {
    fontSize: 13,
    marginBottom: 5,
  },
  dealTimer: {
    fontSize: 12,
    color: '#013087',
    fontWeight: 'bold',
  },
  gridContainer: {
    paddingVertical: 8,
  },
  gridColumnWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  gridItem: {
    width: '48%',
    padding: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  gridItemImage: {
    width: '100%',
    height: 150,
    marginBottom: 8,
    borderRadius: 2,
  },
  gridItemTitle: {
    fontSize: 13,
    lineHeight: 17,
    marginBottom: 4,
    height: 34,
  },
  gridItemRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 3,
  },
  gridItemReviews: {
    fontSize: 11,
    color: '#007185',
    marginLeft: 3,
  },
  gridItemPrice: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 3,
  },
  gridItemPriceSymbol: {
    fontSize: 11,
    fontWeight: 'bold',
    marginRight: 1,
  },
  gridItemPriceValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  gridItemPrime: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  gridItemPrimeText: {
    color: '#00A8E1',
    fontSize: 11,
    fontWeight: 'bold',
    marginLeft: 2,
  },
  // Game section styles
  gameHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  gameTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
    marginBottom: 0,
  },
  sponsoredTag: {
    marginLeft: 'auto',
    backgroundColor: 'rgba(0,0,0,0.05)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 2,
  },
  sponsoredText: {
    fontSize: 10,
    color: '#565959',
  },
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
    color: '#013087',
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
    borderColor: '#013087',
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
    backgroundColor: '#013087',
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
    color: '#013087',
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
    backgroundColor: '#013087',
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