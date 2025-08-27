import React, {useState} from 'react';
import {StyleSheet, View, FlatList} from 'react-native';
import {COLOR} from '../../../Constants/Colors';
import HomeHeader from '../../../Components/HomeHeader';
import CustomButton from '../../../Components/CustomButton';
import {Typography} from '../../../Components/UI/Typography'; // ✅ Import Typography

const Wallet = () => {
  const [balance, setBalance] = useState(1250.75); // Example balance

  const transactions = [
    {
      id: 'TXN12345',
      amount: 500,
      type: 'Credit',
      date: '2025-08-12T10:30:00',
    },
    {
      id: 'TXN12346',
      amount: 200,
      type: 'Debit',
      date: '2025-08-11T14:15:00',
    },
    {
      id: 'TXN12347',
      amount: 150,
      type: 'Debit',
      date: '2025-08-10T09:05:00',
    },
    {
      id: 'TXN12348',
      amount: 1000,
      type: 'Credit',
      date: '2025-08-09T18:45:00',
    },
  ];

  const formatDate = dateString => {
    const dateObj = new Date(dateString);
    const options = {day: '2-digit', month: 'short', year: 'numeric'};
    const datePart = dateObj.toLocaleDateString('en-GB', options);
    const timePart = dateObj.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
    return `${datePart}, ${timePart}`;
  };

  const renderTransaction = ({item}) => (
    <View style={styles.transactionItem}>
      <View>
        <Typography size={14} color={COLOR.black}>
          Transaction ID: {item.id}
        </Typography>
        {/* <Typography size={13} color="#777">{item.type}</Typography> */}
        <Typography size={12} color="#999" style={{marginTop: 1}}>
          {formatDate(item.date)}
        </Typography>
      </View>
      <Typography
        size={16}
        fontWeight="600"
        color={item.type === 'Credit' ? 'green' : 'red'}>
        {item.type === 'Credit' ? '+' : '-'}₹{item.amount}
      </Typography>
    </View>
  );

  return (
    <View style={styles.container}>
      <HomeHeader
        title="Wallet"
        leftIcon="https://cdn-icons-png.flaticon.com/128/2722/2722991.png"
        leftTint={COLOR.black}
      />

      <View style={{paddingHorizontal: 10}}>
        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <Typography size={14} color="#555">
            Current Balance
          </Typography>
          <Typography size={28} fontWeight="700" color={COLOR.black} style={{marginTop: 5}}>
            ₹{balance.toFixed(2)}
          </Typography>
        </View>

        {/* Add Amount Button */}
        <CustomButton
          title="Add Amount"
          onPress={() => console.log('Add Amount Pressed')}
          style={{marginVertical: 15}}
        />

        {/* Transaction History */}
        <Typography size={16} fontWeight="700" color={COLOR.black} style={{marginTop: 10, marginBottom: 8}}>
          Transaction History
        </Typography>
        <FlatList
          data={transactions}
          keyExtractor={item => item.id}
          renderItem={renderTransaction}
          contentContainerStyle={{paddingBottom: 20}}
        />
      </View>
    </View>
  );
};

export default Wallet;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.white,
    paddingHorizontal: 15,
  },
  balanceCard: {
    backgroundColor: '#f5f5f5',
    padding: 20,
    borderRadius: 8,
    marginTop: 15,
    alignItems: 'center',
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 6,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 8,
  },
});
