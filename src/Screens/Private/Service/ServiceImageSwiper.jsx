import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  Animated,
  Text,
  TouchableOpacity,
} from 'react-native';

const {width, height} = Dimensions.get('window');

const ImageSwiper = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);

  // Sample images - replace with your actual image URLs
  const images = [
   'https://images.pexels.com/photos/3058864/pexels-photo-3058864.jpeg?auto=compress&cs=tinysrgb&w=600', // Stylish haircut
    'https://images.pexels.com/photos/3992875/pexels-photo-3992875.jpeg?auto=compress&cs=tinysrgb&w=600', // Beard trimming
    'https://images.pexels.com/photos/3998426/pexels-photo-3998426.jpeg?auto=compress&cs=tinysrgb&w=600', // Barber shop interior
    'https://images.pexels.com/photos/1813272/pexels-photo-1813272.jpeg?auto=compress&cs=tinysrgb&w=600', // Barber at work
    'https://images.pexels.com/photos/2040185/pexels-photo-2040185.jpeg?auto=compress&cs=tinysrgb&w=600', // Barber tools
    'https://images.pexels.com/photos/1319460/pexels-photo-1319460.jpeg?auto=compress&cs=tinysrgb&w=600', // Man getting haircut
    'https://images.pexels.com/photos/1905747/pexels-photo-1905747.jpeg?auto=compress&cs=tinysrgb&w=600', // Classic barber chair
    'https://images.pexels.com/photos/3201698/pexels-photo-3201698.jpeg?auto=compress&cs=tinysrgb&w=600', // Barber with client
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % images.length;
      setCurrentIndex(nextIndex);
      // Scroll to the next image
      if (flatListRef.current) {
        flatListRef.current.scrollToIndex({
          index: nextIndex,
          animated: true,
        });
      }
    }, 5000); // Change image every 5 seconds
    return () => clearInterval(interval);
  }, [currentIndex, images.length]);
  const renderItem = ({item}) => {
    return (
      <View style={styles.imageContainer}>
        <Image source={{uri: item}} style={styles.mainImage} />
      </View>
    );
  };
  const renderPagination = () => {
    return (
      <View style={styles.pagination}>
        {images.map((_, i) => (
          <View
            key={i}
            style={[
              styles.paginationDot,
              i === currentIndex
                ? styles.paginationDotActive
                : styles.paginationDotInactive,
            ]}
          />
        ))}
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
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {x: scrollX}}}],
          {useNativeDriver: true},
        )}
        onMomentumScrollEnd={event => {
          const newIndex = Math.floor(
            event.nativeEvent.contentOffset.x / width,
          );
          setCurrentIndex(newIndex);
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
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    backgroundColor: 'rgba(0,0,0,0.3)',
    height: 50,
  },
  time: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  signal: {
    color: 'white',
    marginRight: 8,
  },
  wifi: {
    color: 'white',
    marginRight: 8,
    fontSize: 12,
  },
  battery: {
    color: 'white',
    marginRight: 4,
    fontSize: 12,
  },
  batteryIcon: {
    color: 'white',
  },
  bottomInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: 'rgba(0,0,0,0.3)',
    height: 60,
  },
  connectionInfo: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  connectionText: {
    color: 'white',
    fontSize: 14,
  },
  batteryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  batteryText: {
    color: 'white',
    marginRight: 8,
    fontSize: 14,
  },
  batteryVisual: {
    width: 30,
    height: 14,
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 2,
    overflow: 'hidden',
  },
  batteryFill: {
    height: '100%',
    backgroundColor: 'green',
  },
  pagination: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#fff',
    width: 30,
  },
  paginationDotInactive: {
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
});

export default ImageSwiper;
