import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, Image, TouchableOpacity, View, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { getCart } from '@/components/GameChallenge';

export default function CartScreen() {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');
  const borderColor = useThemeColor({}, 'border');
  
  const [cart, setCart] = useState(getCart());
  const [subtotal, setSubtotal] = useState(0);
  const [savings, setSavings] = useState(0);
  
  useEffect(() => {
    // Calculate totals
    let total = 0;
    let discount = 0;
    
    cart.items.forEach(item => {
      const price = parseFloat(item.price.replace('$', ''));
      total += price;
      
      // Check if there's a discount for this item
      const itemDiscount = cart.discounts.find(d => d.productId === item.id);
      if (itemDiscount) {
        discount += price * (itemDiscount.percent / 100);
      }
    });
    
    setSubtotal(total);
    setSavings(discount);
  }, [cart]);
  
  const goBack = () => {
    router.back();
  };
  
  const proceedToCheckout = () => {
    // In a real app, this would go to a checkout page
    alert('Proceeding to checkout! This would go to payment processing in a real app.');
  };
  
  // Format price for display
  const formatPrice = (price: number) => {
    return '$' + price.toFixed(2);
  };
  
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor }}>
      {/* Header */}
      <ThemedView style={[styles.header, { borderBottomColor: borderColor }]}>
        <TouchableOpacity onPress={goBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={textColor} />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>Shopping Cart ({cart.items.length})</ThemedText>
        <View style={{ width: 40 }} />
      </ThemedView>
      
      {cart.items.length === 0 ? (
        <ThemedView style={styles.emptyCartContainer}>
          <Ionicons name="cart-outline" size={80} color={tintColor} />
          <ThemedText style={styles.emptyCartText}>Your cart is empty</ThemedText>
          <TouchableOpacity 
            style={[styles.continueShoppingButton, { backgroundColor: tintColor }]}
            onPress={goBack}
          >
            <ThemedText style={styles.continueShoppingText}>CONTINUE SHOPPING</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      ) : (
        <>
          <ScrollView style={{ backgroundColor }}>
            {/* Cart Items */}
            {cart.items.map((item, index) => {
              const itemDiscount = cart.discounts.find(d => d.productId === item.id);
              const originalPrice = parseFloat(item.price.replace('$', ''));
              let finalPrice = originalPrice;
              
              if (itemDiscount) {
                finalPrice = originalPrice * (1 - itemDiscount.percent / 100);
              }
              
              return (
                <ThemedView key={index} style={[styles.cartItem, { borderBottomColor: borderColor }]}>
                  <Image source={{ uri: item.imageUrl }} style={styles.itemImage} />
                  <ThemedView style={styles.itemDetails}>
                    <ThemedText numberOfLines={2} style={styles.itemTitle}>{item.title}</ThemedText>
                    <ThemedView style={styles.priceContainer}>
                      <ThemedText style={styles.itemPrice}>{formatPrice(finalPrice)}</ThemedText>
                      {itemDiscount && (
                        <ThemedText style={styles.originalPrice}>{item.price}</ThemedText>
                      )}
                    </ThemedView>
                    {itemDiscount && (
                      <ThemedView style={styles.savingsBadge}>
                        <ThemedText style={styles.savingsText}>
                          You save {itemDiscount.percent}% with Game Challenge!
                        </ThemedText>
                      </ThemedView>
                    )}
                    <ThemedView style={styles.itemActions}>
                      <ThemedView style={styles.quantitySelector}>
                        <TouchableOpacity style={styles.quantityButton}>
                          <Ionicons name="remove" size={18} color={tintColor} />
                        </TouchableOpacity>
                        <ThemedText style={styles.quantityText}>1</ThemedText>
                        <TouchableOpacity style={styles.quantityButton}>
                          <Ionicons name="add" size={18} color={tintColor} />
                        </TouchableOpacity>
                      </ThemedView>
                      <TouchableOpacity style={styles.deleteButton}>
                        <ThemedText style={styles.deleteText}>Delete</ThemedText>
                      </TouchableOpacity>
                    </ThemedView>
                  </ThemedView>
                </ThemedView>
              );
            })}
          </ScrollView>
          
          {/* Order Summary */}
          <ThemedView style={[styles.orderSummary, { borderTopColor: borderColor }]}>
            <ThemedView style={styles.summaryRow}>
              <ThemedText style={styles.summaryLabel}>Subtotal ({cart.items.length} items):</ThemedText>
              <ThemedText style={styles.summaryValue}>{formatPrice(subtotal)}</ThemedText>
            </ThemedView>
            
            {savings > 0 && (
              <ThemedView style={styles.summaryRow}>
                <ThemedText style={styles.savingsLabel}>Game Challenge Savings:</ThemedText>
                <ThemedText style={styles.savingsValue}>-{formatPrice(savings)}</ThemedText>
              </ThemedView>
            )}
            
            <ThemedView style={styles.summaryRow}>
              <ThemedText style={styles.totalLabel}>Total:</ThemedText>
              <ThemedText style={styles.totalValue}>{formatPrice(subtotal - savings)}</ThemedText>
            </ThemedView>
            
            <TouchableOpacity 
              style={[styles.checkoutButton, { backgroundColor: tintColor }]}
              onPress={proceedToCheckout}
            >
              <ThemedText style={styles.checkoutButtonText}>PROCEED TO CHECKOUT</ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptyCartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyCartText: {
    fontSize: 18,
    marginVertical: 20,
  },
  continueShoppingButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 4,
    marginTop: 10,
  },
  continueShoppingText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  cartItem: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
  },
  itemImage: {
    width: 100,
    height: 100,
    borderRadius: 4,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 15,
  },
  itemTitle: {
    fontSize: 16,
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  itemPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
  originalPrice: {
    fontSize: 14,
    textDecorationLine: 'line-through',
    color: '#565959',
  },
  savingsBadge: {
    backgroundColor: '#013087',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 3,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  savingsText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  itemActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 3,
  },
  quantityButton: {
    padding: 5,
  },
  quantityText: {
    paddingHorizontal: 12,
    fontWeight: 'bold',
  },
  deleteButton: {
    padding: 5,
  },
  deleteText: {
    color: '#007185',
  },
  orderSummary: {
    padding: 15,
    borderTopWidth: 1,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  savingsLabel: {
    fontSize: 14,
    color: '#067D62',
  },
  savingsValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#067D62',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  checkoutButton: {
    padding: 15,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 10,
  },
  checkoutButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});