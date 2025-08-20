import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
} from 'react-native';
import HomeHeader from '../../../Components/HomeHeader';
import {COLOR} from '../../../Constants/Colors';
import CustomButton from '../../../Components/CustomButton';

const Support = () => {
  const [tickets, setTickets] = useState([
    {
      id: '1',
      title: 'Login Issue',
      description: 'Unable to log into my account since yesterday.',
      date: '2025-08-10',
      time: '10:45 AM',
      status: 'Open',
    },
    {
      id: '2',
      title: 'Payment Failed',
      description: 'Transaction failed but amount was deducted.',
      date: '2025-08-09',
      time: '4:30 PM',
      status: 'Resolved',
    },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const handleAddTicket = () => {
    if (!newTitle.trim() || !newDesc.trim()) return;
    const newTicket = {
      id: Date.now().toString(),
      title: newTitle,
      description: newDesc,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
      status: 'Open',
    };
    setTickets([newTicket, ...tickets]);
    setNewTitle('');
    setNewDesc('');
    setModalVisible(false);
  };

  const renderTicket = ({item}) => (
    <View style={styles.ticketCard}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Text style={styles.ticketTitle}>{item.title}</Text>
        <Text
          style={[
            styles.status,
            item.status === 'Resolved'
              ? styles.statusResolved
              : styles.statusOpen,
          ]}>
          {item.status}
        </Text>
      </View>
      <Text style={styles.ticketDesc}>{item.description}</Text>
      <Text style={styles.ticketDate}>
        {item.date} • {item.time}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <HomeHeader
        title={'Support'}
        leftIcon="https://cdn-icons-png.flaticon.com/128/2722/2722991.png"
        leftTint={COLOR.black}
      />

      <FlatList
        data={tickets}
        renderItem={renderTicket}
        keyExtractor={item => item.id}
        contentContainerStyle={{paddingVertical: 10}}
      />

      <CustomButton
        style={{marginBottom: 50}}
        title="Raise Ticket"
        onPress={() => setModalVisible(true)}
      />
      {/* Raise Ticket Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView>
              <Text style={styles.modalTitle}>Raise a Support Ticket</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Ticket Title"
                value={newTitle}
                onChangeText={setNewTitle}
              />
              <TextInput
                style={[styles.input, {height: 100}]}
                placeholder="Enter Description"
                value={newDesc}
                onChangeText={setNewDesc}
                multiline
              />
              <CustomButton
                title="Submit Ticket"
                onPress={handleAddTicket}
                style={{marginTop: 10}}
              />
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.cancelBtn}>
                <Text style={{color: COLOR.primary}}>Cancel</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Support;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 15,
  },
  ticketCard: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  ticketTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLOR.black,
  },
  ticketDesc: {
    fontSize: 14,
    color: '#555',
    marginVertical: 4,
  },
  ticketDate: {
    fontSize: 12,
    color: '#888',
  },
  status: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 12,
    fontSize: 12,
    overflow: 'hidden',
  },
  statusOpen: {
    backgroundColor: '#ffebcc',
    color: '#b36b00',
  },
  statusResolved: {
    backgroundColor: '#d4edda',
    color: '#155724',
  },
  raiseButton: {
    backgroundColor: COLOR.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
  raiseButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    marginBottom: 10,
  },
  cancelBtn: {
    alignItems: 'center',
    marginTop: 10,
  },
});
