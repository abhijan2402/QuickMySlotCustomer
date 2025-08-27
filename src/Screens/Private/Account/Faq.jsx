import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import HomeHeader from '../../../Components/HomeHeader';
import {COLOR} from '../../../Constants/Colors';
import {Typography} from '../../../Components/UI/Typography'; // ✅ Import Typography

const faqData = [
  {
    title: 'Account Management',
    items: [
      'How do I update my profile information?',
      'I forgot my password, what should I do?',
      'How do I delete my account?',
    ],
  },
  {
    title: 'Bookings and Appointments',
    items: [
      'How do I book a service?',
      'Can I reschedule or cancel a booking?',
      'What happens if a provider cancels my booking?',
    ],
  },
  {
    title: 'Payments and Refunds',
    items: [
      'What payment methods are accepted?',
      'How long do refunds take to process?',
    ],
  },
  {
    title: 'Provider Support',
    items: ['How do I set my availability?', 'How do I receive payments?'],
  },
];

const Faq = () => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleExpand = index => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <View style={styles.container}>
      <HomeHeader
        title="Support/FAQ"
        leftIcon="https://cdn-icons-png.flaticon.com/128/2722/2722991.png"
        leftTint={COLOR.black}
      />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 10,
        }}
        showsVerticalScrollIndicator={false}>
        {faqData.map((section, sectionIndex) => (
          <View key={sectionIndex}>
            {/* Section Title */}
            <Typography size={16} fontWeight="700" style={styles.sectionTitle}>
              {section.title}
            </Typography>

            {/* Section Items */}
            {section.items.map((item, itemIndex) => {
              const indexKey = `${sectionIndex}-${itemIndex}`;
              const isExpanded = expandedIndex === indexKey;

              return (
                <View key={indexKey} style={styles.faqItem}>
                  <TouchableOpacity
                    style={styles.faqHeader}
                    onPress={() => toggleExpand(indexKey)}>
                    <Typography size={14} style={styles.faqQuestion}>
                      {item}
                    </Typography>
                    <Image
                      source={{
                        uri: isExpanded
                          ? 'https://cdn-icons-png.flaticon.com/128/271/271228.png' // up arrow
                          : 'https://cdn-icons-png.flaticon.com/128/271/271210.png', // down arrow
                      }}
                      style={styles.arrowIcon}
                    />
                  </TouchableOpacity>
                  {isExpanded && (
                    <Typography size={13} style={styles.faqAnswer}>
                      This is where the answer for "{item}" will go.
                    </Typography>
                  )}
                </View>
              );
            })}
          </View>
        ))}
      </ScrollView>
      <View style={{height: 50}} />
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
  arrowIcon: {
    width: 15,
    height: 15,
    tintColor: '#555',
  },
  faqAnswer: {
    paddingHorizontal: 12,
    paddingBottom: 12,
    color: '#555',
    lineHeight: 18,
  },
});
