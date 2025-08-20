import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import RenderHTML from 'react-native-render-html';
import Header from './FeedHeader';
import HomeHeader from './HomeHeader';
import {COLOR} from '../Constants/Colors';

const Cms = ({route}) => {
  const navigation = useNavigation();
  const {width} = useWindowDimensions();
  const {title, slug} = route.params;

  const [htmlContent, setHtmlContent] = useState('');
  const [loading, setLoading] = useState(true);

  // Simulate fetching static CMS content
  useEffect(() => {
    setTimeout(() => {
      const staticHTML = `
  <h2>About Our Service Platform</h2>
  <p>Welcome to <strong>ServiceHub</strong>, your reliable partner for booking trusted professionals across a wide range of services — from beauty and wellness to home repairs and maintenance. We make it easy for you to find, book, and enjoy top-quality services right at your doorstep.</p>

  <h3>Why Choose Us?</h3>
  <ul>
    <li>Verified and skilled professionals</li>
    <li>Transparent pricing with no hidden charges</li>
    <li>Convenient booking and secure payment options</li>
    <li>Customer support available 7 days a week</li>
  </ul>

  <p>Whether you need a quick salon appointment, a deep cleaning session, or an emergency repair, we ensure that every service is delivered with professionalism, punctuality, and care. Your satisfaction is our priority.</p>

  <h3>Contact Information</h3>
  <p>Email: <a href="mailto:support@servicehub.com">support@servicehub.com</a></p>
  <p>Phone: +91-9876543210</p>
`;
      setHtmlContent(staticHTML);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <View style={styles.container}>
      <HomeHeader
        title={title}
        leftIcon="https://cdn-icons-png.flaticon.com/128/2722/2722991.png"
        leftTint={COLOR.black}
      />

      <ScrollView contentContainerStyle={styles.contentContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#007bff" />
        ) : (
          <RenderHTML
            contentWidth={width}
            source={{html: htmlContent}}
            tagsStyles={{
              h2: {
                fontSize: 22,
                fontWeight: '700',
                marginBottom: 10,
                color: '#222',
              },
              h3: {
                fontSize: 18,
                fontWeight: '600',
                marginTop: 15,
                marginBottom: 8,
                color: '#333',
              },
              p: {
                fontSize: 15,
                lineHeight: 22,
                color: '#444',
                marginBottom: 10,
              },
              li: {
                marginBottom: 6,
                color: '#333',
                fontSize: 15,
              },
              strong: {fontWeight: 'bold'},
              a: {color: '#007bff', textDecorationLine: 'underline'},
            }}
          />
        )}
      </ScrollView>
    </View>
  );
};

export default Cms;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 15,
  },
  contentContainer: {
    padding: 10,
  },
});
