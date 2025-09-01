import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  Animated,
  Text,
  FlatList,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const ImageSwiper = () => {
  const originalImages = [
    'https://images.pexels.com/photos/3058864/pexels-photo-3058864.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://images.pexels.com/photos/3992875/pexels-photo-3992875.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://images.pexels.com/photos/3998426/pexels-photo-3998426.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://images.pexels.com/photos/1813272/pexels-photo-1813272.jpeg?auto=compress&cs=tinysrgb&w=600',
  ];

  // Duplicate list for looping
  const images = [...originalImages, ...originalImages];

  const [currentIndex, setCurrentIndex] = useState(0);
  
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);
  const progress = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(null);

  const DURATION = 5000;

  const startProgressBar = () => {
    // Stop any existing animation
    if (progressAnim.current) {
      progressAnim.current.stop();
    }
    
    progress.setValue(0);
    progressAnim.current = Animated.timing(progress, {
      toValue: 1,
      duration: DURATION,
      useNativeDriver: false,
    });
    
    progressAnim.current.start(({ finished }) => {
      if (finished) {
        let nextIndex = (currentIndex + 1) % originalImages.length;
        console.log(nextIndex,'kkk');
        (nextIndex)
        
        if (flatListRef.current) {
          // If we're at the last image of the original set, we need to scroll to the duplicate
          if (nextIndex === 0) {
            flatListRef.current.scrollToIndex({
              index: originalImages.length,
              animated: true,
            });
          } else {
            flatListRef.current.scrollToIndex({
              index: nextIndex,
              animated: true,
            });
          }
        }
        setCurrentIndex(nextIndex);
      }
    });
  };

  useEffect(() => {
    startProgressBar();
    
    return () => {
      if (progressAnim.current) {
        progressAnim.current.stop();
      }
    };
  }, [currentIndex]);

  const renderItem = ({ item }) => (
    <View style={styles.imageContainer}>
      <View style={styles.ratingOverlay}>
        <Image
          source={require('../../../assets/Images/star.png')}
          style={styles.starIcon}
        />
        <Text style={styles.ratingText}>(4.6)</Text>
      </View>
      <Image source={{ uri: item }} style={styles.mainImage} />
    </View>
  );

  const renderPagination = () => {
    return (
      <View style={styles.pagination}>
        {originalImages.map((_, i) => {
          const isActive = i === currentIndex;
          return (
            <View key={i} style={styles.progressBarBackground}>
              {isActive ? (
                <Animated.View
                  style={[
                    styles.progressBarFill,
                    {
                      width: progress.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0%', '100%'],
                      }),
                    },
                  ]}
                />
              ) : i < currentIndex ? (
                <View style={[styles.progressBarFill, { width: '100%' }]} />
              ) : null}
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Animated.FlatList
        ref={flatListRef}
        data={images}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        pagingEnabled
        scrollEnabled={false} 
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
        onMomentumScrollEnd={(event) => {
          const newIndex = Math.floor(event.nativeEvent.contentOffset.x / width);
          const actualIndex = newIndex % originalImages.length;
          
          if (actualIndex !== currentIndex) {
            // setCurrentIndex(actualIndex);
            
            // If we're at the end of the duplicated array, reset to beginning
            if (newIndex >= originalImages.length) {
              setTimeout(() => {
                flatListRef.current.scrollToIndex({
                  index: actualIndex,
                  animated: false,
                });
              }, 100);
            }
          }
        }}
      />
      {renderPagination()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  imageContainer: {
    width,
    height: height / 3,
    position: 'relative',
  },
  mainImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  pagination: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 20,
    width: '90%',
    alignSelf: 'center',
    justifyContent: 'space-between',
  },
  progressBarBackground: {
    flex: 1,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginHorizontal: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#fff',
  },
  ratingOverlay: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 8,
    zIndex: 10,
  },
  starIcon: {
    height: 16,
    width: 16,
    marginRight: 8,
  },
  ratingText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default ImageSwiper;