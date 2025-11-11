import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import RenderHTML from 'react-native-render-html';
import Header from './FeedHeader';
import HomeHeader from './HomeHeader';
import { COLOR } from '../Constants/Colors';
import { CMS } from '../Constants/ApiRoute';
import { GET_WITH_TOKEN } from '../Backend/Api';

const Cms = ({ route }) => {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const { title, slug } = route.params;
  const [htmlContent, setHtmlContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    GET_WITH_TOKEN(
      CMS + slug,
      success => {
        setLoading(false);
        setHtmlContent(success?.data)
      },
      error => {
        console.log(error, 'errorerrdsadsaorerror>>');
        setLoading(false);
      },
      fail => {
        console.log(fail, 'errorerrorerror>>');

        setLoading(false);
      },
    );
  }, []);

  return (
    <View style={styles.container}>
      <HomeHeader
        title={title}
        leftIcon="https://cdn-icons-png.flaticon.com/128/2722/2722991.png"
        leftTint={COLOR.black}
      />

      <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        {loading ? (
          <ActivityIndicator size="large" color="#007bff" />
        ) : (
          <RenderHTML

            contentWidth={width}
            source={{ html: htmlContent?.body }}
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
              strong: { fontWeight: 'bold' },
              a: { color: '#007bff', textDecorationLine: 'underline' },
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
