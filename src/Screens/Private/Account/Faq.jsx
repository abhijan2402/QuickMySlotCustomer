import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  SectionList,
} from 'react-native';
import HomeHeader from '../../../Components/HomeHeader';
import { COLOR } from '../../../Constants/Colors';
import { Typography } from '../../../Components/UI/Typography'; // ✅ Import Typography
import { useIsFocused } from '@react-navigation/native';
import { GET_WITH_TOKEN } from '../../../Backend/Api';
import { ADD_FAQ } from '../../../Constants/ApiRoute';
import { images } from '../../../Components/UI/images';



const Faq = () => {
  const isFocus = useIsFocused();
  const [loading, setLoading] = useState(false);
  const [faq, setFaq] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    if (isFocus) {
      setLoading(true);
      GET_WITH_TOKEN(
        ADD_FAQ,
        success => {
          console.log(success);
          setLoading(false);
          const grouped = success?.data?.reduce((acc, item) => {
            console.log(acc);
            const existing = acc.find(sec => sec.title === item.category);
            console.log(existing);
            if (existing) {
              existing.data.push(item);
            } else {
              acc.push({ title: item.category, data: [item] });
            }
            return acc;
          }, []);

          setFaq(grouped);
        },
        error => {
          console.log(error, 'error>>');
          setLoading(false);
        },
        fail => {
          console.log(fail, 'fail>>');
          setLoading(false);
        },
      );
    }
  }, [isFocus]);

  const toggleExpand = id => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  return (
    <View style={styles.container}>
      <HomeHeader
        title="Support/FAQ"
        leftIcon="https://cdn-icons-png.flaticon.com/128/2722/2722991.png"
        leftTint={COLOR.black}
      />
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#007bff"
          style={{ marginTop: 20 }}
        />
      ) : (
        <SectionList
          showsVerticalScrollIndicator={false}
          sections={faq}
          keyExtractor={(item, index) => item.id.toString() + index}
          renderSectionHeader={({ section: { title } }) => (
            <Typography style={styles.sectionTitle} size={16} fontWeight="700">
              {title}
            </Typography>
          )}
          renderItem={({ item }) => (
            <View style={styles.faqItem}>
              <TouchableOpacity
                style={styles.faqHeader}
                onPress={() => toggleExpand(item.id)}>
                <Typography style={styles.faqQuestion} fontWeight="600">
                  {item.question}
                </Typography>
                <TouchableOpacity
                  onPress={() =>
                    setExpandedId(expandedId === item.id ? null : item.id)
                  }>
                  <Image
                    source={
                      expandedId === item.id ? images.ArrowDown : images.ArrowDown
                    }
                    style={{ width: 16, height: 16, tintColor: '#555', transform: [{ rotate: expandedId === item.id ? '180deg' : '0deg' }] }}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </TouchableOpacity>

              {expandedId === item.id && (
                <Typography style={styles.faqAnswer}>{item.answer}</Typography>
              )}
            </View>
          )}
        />
      )}
    </View>
  );
};

export default Faq;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.white,
    paddingHorizontal: 15,
  },
  sectionTitle: {
    marginTop: 20,
    marginBottom: 8,
    color: COLOR.black,
  },
  faqItem: {
    backgroundColor: COLOR.white,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 8,
    overflow: 'hidden',
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
  faqQuestion: {
    color: COLOR.black,
    flex: 1,
    paddingRight: 10,
  },
  faqAnswer: {
    paddingHorizontal: 12,
    paddingBottom: 12,
    color: '#555',
    lineHeight: 18,
  },

});
