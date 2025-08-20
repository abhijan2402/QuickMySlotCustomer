import React, {useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView,
  Animated,
  Easing,
} from 'react-native';
import {COLOR} from '../../../Constants/Colors';
import HomeHeader from '../../../Components/HomeHeader';

const categories = [
  {
    id: '1',
    name: 'Hair Care',
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTr88iVv4J4OEb6CTMGBchPNqH8vBPtxRID3A&s',
  },
  {
    id: '2',
    name: 'Hair Colour',
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTr88iVv4J4OEb6CTMGBchPNqH8vBPtxRID3A&s',
  },
  {
    id: '3',
    name: 'Nail Bar',
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTr88iVv4J4OEb6CTMGBchPNqH8vBPtxRID3A&s',
  },
  {
    id: '4',
    name: 'Face',
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTr88iVv4J4OEb6CTMGBchPNqH8vBPtxRID3A&s',
  },
  {
    id: '5',
    name: 'Treatments',
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTr88iVv4J4OEb6CTMGBchPNqH8vBPtxRID3A&s',
  },
  {
    id: '6',
    name: 'Massage & Spa',
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTr88iVv4J4OEb6CTMGBchPNqH8vBPtxRID3A&s',
  },
  {
    id: '7',
    name: "Men's Grooming",
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTr88iVv4J4OEb6CTMGBchPNqH8vBPtxRID3A&s',
  },
];

const services = {
  'Hair Care': [
    {
      id: 'h1',
      category: 'Haircut',
      services: [
        {id: 's1', name: 'Basic Haircut', price: 200},
        {id: 's2', name: 'Layer Cut', price: 350},
      ],
    },
    {
      id: 'h2',
      category: 'Wash OR Dry',
      services: [
        {id: 's3', name: 'Hair Wash', price: 150},
        {id: 's4', name: 'Blow Dry', price: 250},
      ],
    },
    {
      id: 'h3',
      category: 'Styling',
      services: [
        {id: 's5', name: 'Straightening', price: 500},
        {id: 's6', name: 'Curls', price: 450},
      ],
    },
  ],
};

const ServiceList = ({navigation}) => {
  const [selectedCategory, setSelectedCategory] = useState('Hair Care');
  const [expanded, setExpanded] = useState({});
  const [selectedServices, setSelectedServices] = useState([]);
  const rotateAnim = useRef({}).current;

  const addService = service => {
    if (!selectedServices.find(s => s.id === service.id)) {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const isAdded = serviceId => {
    return selectedServices.some(s => s.id === serviceId);
  };
  const rotateInterpolate = id =>
    rotateAnim[id]
      ? rotateAnim[id].interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '180deg'],
        })
      : '0deg';

  const rotationValues = useRef({}).current;
  const toggleExpand = catId => {
    if (!rotationValues[catId]) {
      rotationValues[catId] = new Animated.Value(0);
    }

    const isExpanded = expanded[catId];
    Animated.timing(rotationValues[catId], {
      toValue: isExpanded ? 0 : 1,
      duration: 200,
      useNativeDriver: true,
    }).start();

    setExpanded(prev => ({...prev, [catId]: !isExpanded}));
  };

  const getRotationStyle = catId => {
    if (!rotationValues[catId]) {
      rotationValues[catId] = new Animated.Value(0);
    }

    return {
      transform: [
        {
          rotate: rotationValues[catId].interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '180deg'],
          }),
        },
      ],
    };
  };

  return (
    <View style={styles.container}>
      <HomeHeader
        title="Services"
        leftIcon="https://cdn-icons-png.flaticon.com/128/2722/2722991.png"
        leftTint={COLOR.black}
      />
      <View style={{flex: 1, flexDirection: 'row'}}>
        {/* Left Side Category */}
        <View style={styles.leftPane}>
          <FlatList
            data={categories}
            keyExtractor={item => item.id}
            renderItem={({item}) => (
              <TouchableOpacity
                style={[
                  styles.categoryItem,
                  selectedCategory === item.name && styles.activeCategory,
                ]}
                onPress={() => setSelectedCategory(item.name)}>
                <Image
                  source={{uri: item.image}}
                  style={styles.categoryImage}
                />
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategory === item.name && {fontWeight: 'bold'},
                  ]}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* Right Side Services */}
        <View style={styles.rightPane}>
          <Text style={styles.heading}>{selectedCategory}</Text>

          <ScrollView>
            {services[selectedCategory]?.map(cat => (
              <View key={cat.id} style={styles.serviceCategory}>
                <TouchableOpacity
                  onPress={() => toggleExpand(cat.id)}
                  style={styles.serviceHeader}>
                  <Text style={styles.serviceCategoryText}>
                    {cat.category} ({cat.services.length})
                  </Text>
                  <Animated.Image
                    source={{
                      uri: 'https://cdn-icons-png.flaticon.com/128/2985/2985150.png',
                    }}
                    style={[{width: 20, height: 20}, getRotationStyle(cat.id)]}
                  />
                </TouchableOpacity>

                {expanded[cat.id] &&
                  cat.services.map(srv => (
                    <View key={srv.id} style={styles.serviceRow}>
                      <Text style={styles.serviceName}>
                        {srv.name} -{' '}
                        <Text style={styles.servicePrice}>₹{srv.price}</Text>
                      </Text>
                      <TouchableOpacity
                        style={[
                          styles.addBtn,
                          isAdded(srv.id) && styles.addedBtn,
                        ]}
                        disabled={isAdded(srv.id)}
                        onPress={() => addService(srv)}>
                        <Text
                          style={[
                            styles.addBtnText,
                            isAdded(srv.id) && styles.addedBtnText,
                          ]}>
                          {isAdded(srv.id) ? 'Added' : 'Add'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ))}
              </View>
            ))}
          </ScrollView>
        </View>
      </View>

      {/* Floating Book Now Button */}
      {selectedServices.length > 0 && (
        <TouchableOpacity
          onPress={() => navigation.navigate('BookingScreen')}
          style={styles.bookNowBtn}>
          <Text style={styles.bookNowText}>
            Book Now ({selectedServices.length})
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ServiceList;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},
  leftPane: {width: 100, backgroundColor: '#f9f9f9'},
  categoryItem: {
    // flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    // paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  activeCategory: {backgroundColor: '#e6f0ff'},
  categoryImage: {width: 40, height: 40, borderRadius: 8, marginRight: 8},
  categoryText: {fontSize: 13, flexShrink: 1},

  rightPane: {flex: 1, padding: 10},
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: COLOR.black,
  },
  serviceCategory: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginBottom: 10,
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  serviceCategoryText: {fontSize: 16, fontWeight: '600'},
  serviceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    paddingHorizontal: 5,
  },
  serviceName: {fontSize: 14, flex: 1, flexWrap: 'wrap'},
  servicePrice: {color: COLOR.primary, fontWeight: 'bold'},
  addBtn: {
    backgroundColor: COLOR.white,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
  },
  addBtnText: {color: '#fff', fontWeight: '600', color: COLOR.black},
  addedBtn: {backgroundColor: COLOR.primary, borderWidth: 0},
  addedBtnText: {color: '#fff'},

  bookNowBtn: {
    position: 'absolute',
    bottom: 45,
    left: 20,
    right: 20,
    backgroundColor: COLOR.primary,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  bookNowText: {color: '#fff', fontSize: 16, fontWeight: 'bold'},
  arrowIcon: {width: 20, height: 20, tintColor: COLOR.black},
});
