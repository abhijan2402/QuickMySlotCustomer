import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Platform,
} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import moment from 'moment';
import {useIsFocused} from '@react-navigation/native';
import { images } from './images';
import { COLOR } from '../../Constants/Colors';

// Mock constants since we don't have the actual files
// const COLOR = {
//   grey: '#888',
//   white: '#FFF',
//   lightgrey: '#DDD',
//   blue: '#007AFF',
//   calenderBorder: '#0055CC',
//   black: '#000',
// };


// Simple Typography component since we don't have the actual one
const Typography = ({children, color, size, style}) => (
  <Text style={[{color: color || '#000', fontSize: size || 14}, style]}>
    {children}
  </Text>
);

export const generateNextSixMonths = () => {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const nextSixMonths = [];

  for (let i = 0; i < 6; i++) {
    const monthIndex = (currentMonth + i) % 12;
    const year = currentYear + Math.floor((currentMonth + i) / 12);
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

    nextSixMonths.push({
      index: monthIndex,
      name: new Date(year, monthIndex).toLocaleString('default', {
        month: 'long',
      }),
      limit: daysInMonth,
      formatted: new Date(year, monthIndex).toLocaleString('default', {
        month: 'short',
      }),
      year,
    });
  }

  return nextSixMonths;
};

const ScheduleCard = ({
  title,
  locationId,
  onChangeDateVal,
  calendar = true,
  selected_date = null,
  onMonthChange = () => {},
}) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState({});
  const is_Focus = useIsFocused();
  const flatListRef = useRef(null);
  const nextSixMonths = generateNextSixMonths();
  
  useEffect(() => {
    let date = selected_date
      ? moment(selected_date, 'YYYY-MM-DD')?.format('DD')
      : null;
    setSelectedDate(date);
    if (selected_date) {
      let monthName = moment(selected_date, 'YYYY-MM-DD')?.format('MMMM');
      const selectedMonth = nextSixMonths?.find(v => v?.name == monthName);
      handleMonthChange(selectedMonth);
    }
  }, [is_Focus, selected_date]);

  const generateMonthDates = (month, year, includePast = false) => {
    const dates = [];
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    const currentDay = today.getDate();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      if (
        includePast ||
        year > currentYear ||
        (year === currentYear && month > currentMonth) ||
        (year === currentYear && month === currentMonth && i >= currentDay)
      ) {
        dates.push({
          day: daysOfWeek[date.getDay()],
          date: i,
        });
      }
    }
    return dates;
  };

  const monthData = generateMonthDates(
    selectedMonth?.month,
    selectedMonth?.year,
  );
  
  useEffect(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const endOfMonth = moment(new Date()).endOf('month').format('YYYY-MM-DD');
    const startOfMonth = moment(new Date())
      .startOf('month')
      .format('YYYY-MM-DD');
      
    if (selected_date) {
      let tempDate = moment(selected_date, 'YYYY-MM-DD')?.format('MMMM');
      let temp = nextSixMonths.find(v => v?.name == tempDate);
      handleMonthChange(temp);
    } else {
      setSelectedMonth({
        name: moment()?.utc()?.format('MMMM'),
        year: currentYear,
        month: currentMonth,
        start_date: startOfMonth,
        end_date: endOfMonth,
      });
    }
  }, [locationId]);
  
  const handleMonthChange = monthData => {
    const selectedMonthIndex = nextSixMonths.findIndex(
      item => item?.name == monthData?.name,
    );
    const selectedMonthYear = monthData?.year || new Date().getFullYear();

    const startOfMonth = moment()
      ?.year(selectedMonthYear)
      ?.month(monthData?.index)
      ?.startOf('month')
      ?.format('YYYY-MM-DD');

    const endOfMonth = moment()
      .year(selectedMonthYear)
      .month(monthData?.index)
      .endOf('month')
      .format('YYYY-MM-DD');

    setSelectedMonth({
      ...monthData,
      month: monthData?.index,
      year: selectedMonthYear,
      start_date: startOfMonth,
      end_date: endOfMonth,
    });
  };

  const renderDateItem = ({item, index}) => {
    const isSelected = item?.date == selectedDate;
    return (
      <TouchableOpacity
        style={[
          styles.dateContainer,
          {marginRight: index == monthData.length - 1 ? 20 : 0},
          isSelected && styles.selectedDateContainer,
        ]}
        onPress={() => {
          onChangeDateVal(item, selectedMonth);
          setSelectedDate(item?.date);
        }}>
        <Typography
          color={COLOR.grey}
          style={[isSelected && styles.selectedDayText]}>
          {item?.day}
        </Typography>
        <Typography
          size={20}
          style={[isSelected && styles.selectedDateText]}>
          {item?.date}
        </Typography>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Typography style={styles.modalText}>
          {title ? title : 'Schedules'}
        </Typography>
        {calendar && (
          <View style={styles.monthSelector}>
            <Image
              source={images.calender}
              style={styles.black_Calendar}
            />
            <Dropdown
              data={nextSixMonths}
              placeholder={''}
              showsVerticalScrollIndicator={false}
              value={selectedMonth}
              style={{
                color: 'red',
                minWidth: 100,
                fontSize: 14,
                marginBottom: Platform.OS == 'ios' ? 5 : 0,
              }}
              labelField={'formatted'}
              valueField={'name'}
              containerStyle={{
                width: 120,
                borderRadius: 10,
                left: -20,
                alignSelf: 'flex-end',
              }}
              selectedTextStyle={{
                color: 'black',
                fontSize: 14,
                marginTop: 0,
                width: 25,
              }}
              onChange={v => {
                setSelectedDate(null);
                onMonthChange();
                handleMonthChange(v);
              }}
              renderRightIcon={() => {
                return (
                  <>
                    <Typography>
                      {selectedMonth?.year}
                    </Typography>
                    <Image
                      source={images.ArrowDown}
                      style={styles.arrowIcon}
                    />
                  </>
                );
              }}
              renderItem={item => {
                return (
                  <View
                    style={{
                      height: 40,
                      paddingHorizontal: 10,
                      justifyContent: 'center',
                    }}>
                    <Typography>{item?.name}</Typography>
                  </View>
                );
              }}
            />
          </View>
        )}
      </View>
      <FlatList
        data={monthData}
        renderItem={renderDateItem}
        keyExtractor={item => item.date.toString()}
        horizontal
        ref={flatListRef}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  listContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginHorizontal: 10,
  },
  dateContainer: {
    width: 60,
    height: 80,
    borderRadius: 14,
    backgroundColor: COLOR.white,
    borderWidth: 1,
    borderColor: COLOR.lightGrey,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  selectedDateContainer: {
    backgroundColor: COLOR.primaryLight,
    borderWidth: 2,
    borderColor: COLOR.primary,
    width: 65,
    height: 85,
  },
  selectedDayText: {
    color: '#fff',
  },
  selectedDateText: {
    color: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 14,
    marginTop: 20,
    marginHorizontal: 15,
  },
  monthSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  black_Calendar: {
    height: 16,
    width: 16,
    margin: 6,
    marginBottom: 8,
    tintColor: COLOR.black,
    marginTop:10
  },
  modalText: {
    fontSize: 22,
  },
  arrowIcon: {
    height: 18,
    width: 18,
    margin: 5,
  },
});

// Make sure to export as default
export default ScheduleCard;