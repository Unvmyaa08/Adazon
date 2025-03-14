import React, { useState, useRef, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Animated,
  Easing,
  Platform,
  Vibration,
  Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { SplashScreen } from 'expo-router';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import GameAdPreview from '@/components/GameAdPreview';

// Prevent the splash screen from auto-hiding before assets are loaded.
SplashScreen.preventAutoHideAsync();

const { width, height } = Dimensions.get('window');

type LandingScreenProps = {
  onContinue: () => void;
  showBackgroundElements: boolean;
  setShowBackgroundElements: React.Dispatch<React.SetStateAction<boolean>>;
};

// Optimized particle system for background effects - updated with Amazon-themed elements
const BackgroundElements: React.FC<{ visible: boolean }> = React.memo(({ visible }) => {
  // If not visible, don't render anything
  if (!visible) return null;

  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;
  const parallaxFactor = useRef(new Animated.Value(0)).current;

  // Start subtle parallax animation
  useEffect(() => {
    Animated.loop(
      Animated.timing(parallaxFactor, {
        toValue: 1,
        duration: 10000,
        easing: Easing.inOut(Easing.sin),
        useNativeDriver: true,
      })
    ).start();
  }, []);

  // Generate enhanced Amazon-themed elements with varied types and animations
  const elements = useMemo(() => {
    const numElements = Math.min(50, Math.floor((width * height) / 10000));

    // Define Amazon-themed element types
    const elementTypes = [
      { type: 'dot', weight: 25 },
      { type: 'cart-outline', weight: 20 },
      { type: 'gift', weight: 15 },
      { type: 'pricetag', weight: 15 },
      { type: 'star', weight: 10 },
      { type: 'cube', weight: 10 },
      { type: 'card', weight: 5 }
    ];

    // Weighted random selection
    const totalWeight = elementTypes.reduce((sum, item) => sum + item.weight, 0);

    // Create elements array
    return Array.from({ length: numElements }, (_, i) => {
      // Distribute elements more evenly with polar coordinates
      const angle = (i / numElements) * Math.PI * 2 + (Math.random() * 0.5);
      const distance = (0.1 + Math.random() * 0.9) * Math.min(width, height) * 0.5;

      // Select element type using weighted random
      let random = Math.random() * totalWeight;
      let selectedType = elementTypes[0].type;

      for (const item of elementTypes) {
        if (random < item.weight) {
          selectedType = item.type;
          break;
        }
        random -= item.weight;
      }

      // Calculate initial position with slight jitter
      const initialX = width / 2 + Math.cos(angle) * distance + (Math.random() * 20 - 10);
      const initialY = height / 2 + Math.sin(angle) * distance + (Math.random() * 20 - 10);

      // Vary animation parameters based on element type
      const isSpecial = selectedType !== 'dot';

      return {
        id: i,
        type: selectedType,
        initialX,
        initialY,
        size: selectedType === 'dot'
          ? 2 + Math.random() * 4
          : 10 + Math.random() * (selectedType === 'cart-outline' ? 18 : 14),
        delay: Math.random() * 3000,
        duration: 4000 + Math.random() * 3000,
        rotationSpeed: 0.2 + Math.random() * 0.8,
        rotationDirection: Math.random() > 0.5 ? 1 : -1,
        opacity: isSpecial ? 0.7 + Math.random() * 0.3 : 0.4 + Math.random() * 0.6,
        depth: Math.random(), // For parallax effect
        // Amazon-themed colors
        color: selectedType === 'dot'
          ? theme.tint
          : selectedType === 'cart-outline' || selectedType === 'cube'
            ? theme.tint
            : selectedType === 'gift' || selectedType === 'star'
              ? '#FFD700'
              : selectedType === 'pricetag'
                ? theme.success
                : theme.tint
      };
    });
  }, [width, height, colorScheme]);

  // Create a masked gradient background with Amazon-inspired colors
  const gradientColors = colorScheme === 'dark'
    ? ['#0A1128', '#131A22', '#1D2D44'] as readonly [string, string, string]
    : ['#EAEBEF', '#F5F5F8', '#EAEBEF'] as readonly [string, string, string];

  return (
    <View style={styles.backgroundContainer}>
      <LinearGradient
        colors={gradientColors}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {elements.map(element => {
        const anim = useRef(new Animated.Value(0)).current;
        const rotateAnim = useRef(new Animated.Value(0)).current;
        const pulseAnim = useRef(new Animated.Value(1)).current;

        useEffect(() => {
          // Main movement animation
          Animated.loop(
            Animated.timing(anim, {
              toValue: 1,
              duration: element.duration,
              delay: element.delay,
              easing: Easing.inOut(Easing.sin),
              useNativeDriver: true,
            })
          ).start();

          // Rotation animation for elements
          if (element.type !== 'dot') {
            Animated.loop(
              Animated.timing(rotateAnim, {
                toValue: 1,
                duration: 5000 / element.rotationSpeed,
                easing: Easing.linear,
                useNativeDriver: true,
              })
            ).start();

            // Add subtle pulse animation for special elements
            Animated.loop(
              Animated.sequence([
                Animated.timing(pulseAnim, {
                  toValue: 1.2,
                  duration: 1500,
                  easing: Easing.inOut(Easing.sin),
                  useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                  toValue: 1,
                  duration: 1500,
                  easing: Easing.inOut(Easing.sin),
                  useNativeDriver: true,
                })
              ])
            ).start();
          }
        }, []);

        // Enhanced animation interpolations
        const scale = anim.interpolate({
          inputRange: [0, 0.3, 0.7, 1],
          outputRange: [0.1, 1.2, 1.2, 0.1],
        });

        const opacity = anim.interpolate({
          inputRange: [0, 0.2, 0.7, 1],
          outputRange: [0, element.opacity, element.opacity * 0.7, 0],
        });

        // Parallax movement based on element depth
        const parallaxX = parallaxFactor.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -20 + (element.depth * 40)], // Move different distances based on depth
        });

        const parallaxY = parallaxFactor.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -15 + (element.depth * 30)],
        });

        // Enhanced movement pattern
        const angle = Math.atan2(element.initialY - height / 2, element.initialX - width / 2);
        const translateX = anim.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0, Math.cos(angle) * 30, Math.cos(angle) * 100],
        });

        const translateY = anim.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0, Math.sin(angle) * 30, Math.sin(angle) * 100],
        });

        const rotate = rotateAnim.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', `${360 * element.rotationDirection}deg`],
        });

        // Render different elements based on type
        if (element.type === 'dot') {
          return (
            <Animated.View
              key={element.id}
              style={[
                styles.dot,
                {
                  left: element.initialX,
                  top: element.initialY,
                  width: element.size,
                  height: element.size,
                  borderRadius: element.size / 2,
                  backgroundColor: element.color,
                  transform: [
                    { scale },
                    { translateX: Animated.add(translateX, parallaxX) },
                    { translateY: Animated.add(translateY, parallaxY) }
                  ],
                  opacity,
                },
              ]}
            />
          );
        } else {
          // Amazon-themed elements with enhanced visual style
          return (
            <Animated.View
              key={element.id}
              style={[
                styles.amazonElement,
                {
                  left: element.initialX,
                  top: element.initialY,
                  transform: [
                    {
                      scale: Animated.multiply(scale.interpolate({
                        inputRange: [0, 1.2],
                        outputRange: [0, 1]
                      }), pulseAnim)
                    },
                    { translateX: Animated.add(translateX, parallaxX) },
                    { translateY: Animated.add(translateY, parallaxY) },
                    { rotate }
                  ],
                  opacity: opacity,
                  zIndex: element.type === 'cart-outline' ? 2 : 1,
                },
              ]}
            >
              {element.type === 'cart-outline' && (
                <Ionicons name="cart-outline" size={element.size} color={element.color} />
              )}
              {element.type === 'gift' && (
                <Ionicons name="gift" size={element.size} color={element.color} />
              )}
              {element.type === 'pricetag' && (
                <Ionicons name="pricetag" size={element.size} color={element.color} />
              )}
              {element.type === 'star' && (
                <FontAwesome5 name="star" size={element.size} color={element.color} />
              )}
              {element.type === 'cube' && (
                <Ionicons name="cube" size={element.size} color={element.color} />
              )}
              {element.type === 'card' && (
                <Ionicons name="card" size={element.size} color={element.color} />
              )}
            </Animated.View>
          );
        }
      })}
    </View>
  );
});

// Pulsing animation component for important UI elements
const PulseEffect: React.FC<{ children: React.ReactNode, delay?: number }> = ({ children, delay = 0 }) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          delay,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
      {children}
    </Animated.View>
  );
};

// Metrics showcase with animated counter
const AnimatedMetric: React.FC<{
  icon: string;
  value: number;
  label: string;
  color: string;
  delay: number;
}> = ({ icon, value, label, color, delay }) => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;
  const countAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  // Format large numbers with suffixes (K, M, etc.)
  const formatNumber = (num: number): string => {
    if (num < 1000) return num.toString();
    if (num < 1000000) return (num / 1000).toFixed(1) + 'K';
    return (num / 1000000).toFixed(1) + 'M';
  };

  const [displayValue, setDisplayValue] = useState('0');

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 600,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        delay,
        easing: Easing.out(Easing.back(1.7)),
        useNativeDriver: true,
      }),
    ]).start();

    // Counter animation
    Animated.timing(countAnim, {
      toValue: 1,
      duration: 2000,
      delay: delay + 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();

    // Update the displayed value
    countAnim.addListener(({ value: val }) => {
      const newValue = Math.floor(val * value);
      setDisplayValue(formatNumber(newValue));
    });

    return () => {
      countAnim.removeAllListeners();
    };
  }, []);

  return (
    <Animated.View
      style={[
        styles.metricContainer,
        {
          opacity: opacityAnim,
          transform: [{ translateY: slideAnim }]
        }
      ]}
    >
      <View style={[styles.metricIconContainer, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon as any} size={22} color={color} />
      </View>
      <View style={styles.metricContent}>
        <Text style={[styles.metricValue, { color: theme.text }]}>{displayValue}</Text>
        <Text style={[styles.metricLabel, { color: theme.icon }]}>{label}</Text>
      </View>
    </Animated.View>
  );
};


// Button with enhanced feedback
const AnimatedButton: React.FC<{
  text: string;
  icon: string;
  onPress: () => void;
  color: string;
  delay?: number;
}> = ({ text, icon, onPress, color, delay = 0 }) => {
  const buttonScale = useRef(new Animated.Value(0)).current;
  const pressScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(buttonScale, {
      toValue: 1,
      delay,
      friction: 6,
      tension: 40,
      useNativeDriver: true,
    }).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(pressScale, {
      toValue: 0.92,
      friction: 4,
      tension: 50,
      useNativeDriver: true,
    }).start();

    if (Platform.OS !== 'web') {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } catch (e) {
        Vibration.vibrate(30);
      }
    }
  };

  const handlePressOut = () => {
    Animated.spring(pressScale, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = () => {
    handlePressIn();
    setTimeout(() => {
      handlePressOut();
      setTimeout(onPress, 100);
    }, 100);
  };

  return (
    <TouchableWithoutFeedback
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
    >
      <Animated.View
        style={[
          styles.button,
          {
            backgroundColor: color,
            transform: [
              { scale: Animated.multiply(buttonScale, pressScale) },
            ],
          }
        ]}
      >
        <Text style={styles.buttonText}>{text}</Text>
        <Ionicons name={icon as any} size={22} color="#FFFFFF" style={styles.buttonIcon} />
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

// Enhanced landing screen with Amazon-themed features
const LandingScreen: React.FC<LandingScreenProps> = ({
  onContinue,
  showBackgroundElements,
  setShowBackgroundElements
}) => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;
  const scrollY = useRef(new Animated.Value(0)).current;

  // Main fade animation
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, []);

  // Parallax effect for scroll elements
  const titleOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.3],
    extrapolate: 'clamp',
  });

  const titleScale = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.9],
    extrapolate: 'clamp',
  });

  return (
    <TouchableWithoutFeedback onPress={() => setShowBackgroundElements(false)}>
      <View style={[styles.landingContainer, { backgroundColor: theme.background }]}>
        {/* Amazon-themed background elements */}
        <BackgroundElements visible={showBackgroundElements} />

        {/* Scrollable content container */}
        <Animated.ScrollView
          style={{ flex: 1, width: '100%' }}
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
        >
          {/* Header section with logo and title */}
          <Animated.View
            style={[
              styles.headerContainer,
              {
                opacity: Animated.multiply(fadeAnim, titleOpacity),
                transform: [{ scale: titleScale }]
              }
            ]}
          >
            {/* Logo with badge */}
            <View style={styles.logoContainer}>
              <PulseEffect>
                <View style={styles.logoWrapper}>
                  <Ionicons name="cart" size={48} color={theme.tint} />
                  <View style={[styles.adBadge, { backgroundColor: theme.error }]}>
                    <Text style={styles.adBadgeText}>AD</Text>
                  </View>
                </View>
              </PulseEffect>
            </View>

            {/* Title section */}
            <Animated.View style={styles.titleContainer}>
              <Text style={[styles.title, { color: theme.text }]}>Adazon</Text>
              <Text style={[styles.subtitle, { color: theme.tint }]}>AD PLATFORM</Text>
            </Animated.View>

            <Text style={[styles.tagline, { color: theme.text }]}>
              Where Shopping Meets Smart Advertising
            </Text>
          </Animated.View>

          {/* Interactive demo section
          <View style={styles.demoSection}>
            <VideoAd />
            <GameAdPreview/>
          </View> */}

          {/* Key metrics section */}
          <View style={styles.metricsContainer}>
            <AnimatedMetric
              icon="people"
              value={200}
              label="Million Shoppers"
              color={theme.tint}
              delay={300}
            />
            <AnimatedMetric
              icon="trending-up"
              value={167}
              label="% Conversion Lift"
              color={theme.success}
              delay={600}
            />
            <AnimatedMetric
              icon="cash"
              value={320}
              label="Avg ROAS %"
              color={theme.warning}
              delay={900}
            />
          </View>

          <View style={styles.featuresContainer}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Why Adazon Works
            </Text>

            <View style={styles.featuresList}>
              {/* Gamification Feature */}
              <View style={styles.featureItem}>
                <LinearGradient
                  colors={[theme.tint + '30', theme.tint + '10']}
                  style={styles.featureIconBg}
                >
                  <Ionicons name="game-controller" size={24} color={theme.tint} />
                </LinearGradient>
                <View style={styles.featureTextContainer}>
                  <Text style={[styles.featureTitle, { color: theme.text }]}>
                    Gamified Shopping Experience
                  </Text>
                  <Text style={[styles.featureDescription, { color: theme.icon }]}>
                    Engage shoppers through interactive challenges and rewards
                  </Text>
                </View>
              </View>

              {/* Incentives Feature */}
              <View style={styles.featureItem}>
                <LinearGradient
                  colors={[theme.success + '30', theme.success + '10']}
                  style={styles.featureIconBg}
                >
                  <Ionicons name="gift" size={24} color={theme.success} />
                </LinearGradient>
                <View style={styles.featureTextContainer}>
                  <Text style={[styles.featureTitle, { color: theme.text }]}>
                    Earn as You Shop
                  </Text>
                  <Text style={[styles.featureDescription, { color: theme.icon }]}>
                    Attractive incentives encourage frequent interactions and purchases
                  </Text>
                </View>
              </View>

              {/* Eco-friendly AI Innovation Feature */}
              <View style={styles.featureItem}>
                <LinearGradient
                  colors={[theme.warning + '30', theme.warning + '10']}
                  style={styles.featureIconBg}
                >
                  <Ionicons name="leaf" size={24} color={theme.warning} />
                </LinearGradient>
                <View style={styles.featureTextContainer}>
                  <Text style={[styles.featureTitle, { color: theme.text }]}>
                    Eco-Friendly AI Innovation
                  </Text>
                  <Text style={[styles.featureDescription, { color: theme.icon }]}>
                    Sustainable, AI-driven recommendations for a greener future
                  </Text>
                </View>
              </View>
            </View>
          </View>


          {/* Testimonial/social proof section */}
          <View style={styles.testimonialContainer}>
            <View style={[styles.testimonialCard, { backgroundColor: theme.cardBackground }]}>
              <Text style={[styles.testimonialText, { color: theme.text }]}>
                "Adazon helped us increase our product sales by 247% and ROAS by 320%. The innovative ads reached exactly the right customers."
              </Text>
              <View style={styles.testimonialAuthor}>
                <View style={[styles.authorAvatar, { backgroundColor: theme.tint }]}>
                  <Text style={styles.authorInitials}>SJ</Text>
                </View>
                <View>
                  <Text style={[styles.authorName, { color: theme.text }]}>Russell Motley</Text>
                  <Text style={[styles.authorTitle, { color: theme.icon }]}>E-commerce Director, Genesis PCs</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Empty space to ensure button doesn't cover content */}
          <View style={{ height: 100 }} />
        </Animated.ScrollView>

        {/* Fixed CTA button at bottom */}
        <View style={styles.buttonContainer}>
          <AnimatedButton
            text="Start Earning"
            icon="cart"
            onPress={onContinue}
            color={theme.tint}
            delay={1000}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

// Root layout with enhanced transitions
const RootLayout: React.FC = () => {
  const colorScheme = useColorScheme();
  const [showMainApp, setShowMainApp] = useState<boolean>(false);
  const [showBackgroundElements, setShowBackgroundElements] = useState<boolean>(true);

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  if (!showMainApp) {
    return (
      <LandingScreen
        onContinue={() => setShowMainApp(true)}
        showBackgroundElements={showBackgroundElements}
        setShowBackgroundElements={setShowBackgroundElements}
      />
    );
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
    </ThemeProvider>
  );
};

const styles = StyleSheet.create({
  landingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  backgroundContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  backgroundGradient: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  scrollContainer: {
    paddingVertical: 40,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  headerContainer: {
    alignItems: 'center',
    marginTop: 0,
    marginBottom: 40,
  },
  logoContainer: {
    marginBottom: 20,
  },
  logoWrapper: {
    position: 'relative',
  },
  adBadge: {
    position: 'absolute',
    top: -5,
    right: -12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  adBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 3,
    marginTop: -5,
  },
  tagline: {
    fontSize: 16,
    fontWeight: '500',
    opacity: 0.8,
  },
  demoSection: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  demoContainer: {
    width: 200,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  demoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  demoTitle: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
  },
  demoContent: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
  },
  demoText: {
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'center',
  },
  metricsContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginBottom: 40,
  },
  metricContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    marginBottom: 16,
  },
  metricIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  metricContent: {
    flex: 1,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  metricLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    alignSelf: 'flex-start',
  },
  featuresContainer: {
    width: '100%',
    marginBottom: 40,
  },
  featuresList: {
    width: '100%',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  featureIconBg: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  testimonialContainer: {
    width: '100%',
    marginBottom: 40,
  },
  testimonialCard: {
    padding: 24,
    borderRadius: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  testimonialText: {
    fontSize: 16,
    lineHeight: 24,
    fontStyle: 'italic',
    marginBottom: 20,
  },
  testimonialAuthor: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  authorInitials: {
    color: 'white',
    fontWeight: 'bold',
  },
  authorName: {
    fontSize: 15,
    fontWeight: '600',
  },
  authorTitle: {
    fontSize: 13,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 24,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 36,
    borderRadius: 50,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  buttonIcon: {
    marginLeft: 8,
  },
  dot: {
    position: 'absolute',
    backgroundColor: 'white',
  },
  amazonElement: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Video Ad Styles
  videoAdContainer: {
    width: '100%',
    maxWidth: 340,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  adHeader: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  adBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  adHeaderText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
  },
  sponsoredBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 'auto',
  },
  sponsoredText: {
    fontSize: 12,
    fontWeight: '500',
  },
  videoContainer: {
    position: 'relative',
    width: '100%',
    height: 190,
  },
  video: {
    width: '100%',
    height: '100%',
  },
  videoControls: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  muteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandMark: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  brandText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  ctaContainer: {
    position: 'absolute',
    bottom: 16,
    right: 16,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  ctaText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  ctaIcon: {
    marginLeft: 6,
  },
  productInfoContainer: {
    padding: 16,
  },
  productTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  priceText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 8,
  },
  originalPrice: {
    fontSize: 16,
    textDecorationLine: 'line-through',
    marginRight: 8,
  },
  discountBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  discountText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
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
  deliveryText: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export default RootLayout;