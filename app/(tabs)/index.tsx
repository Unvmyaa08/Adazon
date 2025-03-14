import React, { useState } from 'react';
import { Image, StyleSheet, TextInput, ScrollView, TouchableOpacity, Platform, Dimensions, View, Animated, SafeAreaView, Modal, StatusBar } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { router } from 'expo-router';
import { products, Product } from '@/constants/product_data';

// Banner images from Unsplash
const BANNER_IMAGES = [
  'https://images.unsplash.com/photo-1504450758481-7338eba7524a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1566577134770-3d85bb3a9cc4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1587515724040-d2c48c02e1df?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'
];

// Convert products object to an array for our recommendations section
const RECOMMENDATIONS = Object.values(products).slice(0, 2);

// Find the product with a discount for our deal of the day
const DEAL_PRODUCT = products.nflNflProLineMensClassic;

export default function HomeScreen() {
  const tintColor = useThemeColor({}, 'tint');
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({}, 'border');

  const [currentBanner, setCurrentBanner] = useState(0);

  // Navigate to Product screen using Expo Router
  const handleProductPress = (product: Product) => {
    router.push({
      pathname: '/product',
      params: {
        id: product.id,
        title: product.title,
        price: product.price,
        originalPrice: product.originalPrice || '',
        discount: product.discount || '',
        rating: product.rating?.toString() || '0',
        reviewCount: product.reviewCount?.toString() || '0',
        prime: product.prime ? 'true' : 'false',
        apparel: product.apparel ? 'true' : 'false',
      }
    });
  };

  // Render grid items without using FlatList
  const renderGridItems = () => {
    return (
      <ThemedView style={styles.gridContainer}>
        <ThemedView style={styles.gridColumnWrapper}>
          {RECOMMENDATIONS.map(item => renderGridItem(item))}
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
      <View style={styles.imageContainer}>
        <Image
          source={item.imageUrl}
          style={styles.gridItemImage}
          resizeMode="contain" // This ensures the image isn't cut off
        />
      </View>
      <ThemedText numberOfLines={2} style={styles.gridItemTitle}>{item.title}</ThemedText>
      <ThemedView style={styles.gridItemRating}>
        {[1, 2, 3, 4, 5].map(star => (
          <Ionicons
            key={star}
            name={
              star <= Math.floor(item.rating || 0)
                ? "star"
                : star <= (item.rating || 0)
                  ? "star-half"
                  : "star-outline"
            }
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

          {/* Deal card in NFL style using DEAL_PRODUCT */}
          <TouchableOpacity
            style={[styles.dealCard, { backgroundColor, borderColor }]}
            onPress={() => handleProductPress(DEAL_PRODUCT)}
          >
            <Image
              source={DEAL_PRODUCT.imageUrl}
              style={styles.dealImage}
              resizeMode="contain"
            />
            <ThemedView style={styles.dealInfo}>
              <View style={styles.dealSavingBadge}>
                <ThemedText style={styles.dealSavingText}>
                  {DEAL_PRODUCT.discount ? `Up to ${DEAL_PRODUCT.discount} off` : 'Special Deal'}
                </ThemedText>
              </View>
              <ThemedText style={styles.dealTitle}>{DEAL_PRODUCT.title}</ThemedText>
              <ThemedText style={styles.dealDescription}>
                Premium NFL gear - Limited time offer
              </ThemedText>
              <ThemedText style={styles.dealTimer}>Ends in 12:34:56</ThemedText>
            </ThemedView>
          </TouchableOpacity>
        </ThemedView>

        {/* Recommendations Grid */}
        <ThemedView style={styles.sectionContainer}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Recommended For You</ThemedText>
          {renderGridItems()}
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
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
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
    width: '49%',
    alignItems: 'center',
    padding: 10, // Reduced padding to give images more space
    borderRadius: 4,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  imageContainer: {
    width: '100%',
    height: 190,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  gridItemImage: {
    width: '85%', // Increased from 65%
    height: '100%',
  },
  gridItemTitle: {
    fontSize: 13,
    lineHeight: 17,
    marginBottom: 4,
    height: 34,
    textAlign: 'center',
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
});