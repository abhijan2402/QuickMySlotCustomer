import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native';
import { COLOR } from '../../Constants/Colors';
import { Font } from '../../Constants/Font';
import { windowHeight } from '../../Backend/Utility';
import { GET_CART } from '../../Constants/ApiRoute';
import { GET_WITH_TOKEN } from '../../Backend/Api';

const AvailOfferModal = ({ visible, onClose, Paymentbreakdown }) => {

    useEffect(() => {
        getCart();
    }, []);
    const getCart = () => {
        GET_WITH_TOKEN(
            GET_CART,
            success => {
                const items = success?.data?.items || [];

                if (items.length > 0) {
                    const selectedItems = items.map(cartItem => ({
                        ...cartItem,
                        id: cartItem?.service?.id,
                        name: cartItem?.service?.name,
                        price: cartItem?.service?.price || cartItem?.price,
                    }));
                    //   settotalAmountVal(success?.data?.total_price)
                    //   settotalLength(success?.data?.total_items)
                    //   setSelectedService(selectedItems); // Now an array
                    //   setCartData(success.data);
                } else {
                    //   setSelectedService([]); // Empty array when no items
                    //   setCartData(null);
                }

                setLoading(null);
            },
            error => {
                // console.log('Cart fetch error:', error);
                // setSelectedService([]);
                // setCartData(null);
                // setLoading(null);
            },
            fail => {
                // console.log('Cart fetch fail:', fail);
                // setSelectedService([]);
                // setCartData(null);
                // setLoading(null);
            },
        );
    };
    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}>

            <View style={styles.overlay}>
                {/* Tap outside to close */}
                <TouchableWithoutFeedback onPress={onClose}>
                    <View style={StyleSheet.absoluteFillObject} />
                </TouchableWithoutFeedback>

                {/* Bottom Sheet Content */}
                <View style={styles.bottomSheet}>
                    <ScrollView
                        contentContainerStyle={styles.container}
                        showsVerticalScrollIndicator={false}
                        nestedScrollEnabled={true}>

                        <Text style={styles.title}>How to avail the offer?</Text>

                        {/* Step 1 */}
                        <View style={styles.stepBox}>
                            <Text style={styles.stepTitle}>Step 1</Text>
                            <Text style={styles.stepDesc}>
                                Book your appointment with the QuickMySlot app
                            </Text>
                        </View>

                        {/* Step 2 */}
                        <View style={styles.stepBox}>
                            <Text style={styles.stepTitle}>Step 2</Text>
                            <Text style={styles.stepDesc}>
                                Visit for your appointment to avail all the services
                            </Text>
                        </View>

                        {/* Step 3 */}
                        <View style={styles.stepBox}>
                            <Text style={styles.stepTitle}>Step 3</Text>
                            <Text style={styles.stepDesc}>
                                Pay your bill with the QuickMySlot app using any mode of online payment after
                                availing your services
                            </Text>
                            <View style={styles.paymentRow}>
                                <Image
                                    source={{ uri: 'https://d6xcmfyh68wv8.cloudfront.net/newsroom-content/uploads/2024/05/Razorpay-Logo.jpg' }}
                                    style={styles.paymentIcon}
                                />

                            </View>
                        </View>

                        {/* Sample Bill Section */}
                        <View style={styles.sampleBox}>
                            <Text style={styles.sampleTitle}>Sample Bill</Text>

                            <View style={styles.billRow}>
                                <Text style={styles.billText}>If Total Bill is</Text>
                                <Text style={styles.billText}>₹{Paymentbreakdown?.subtotal}</Text>
                            </View>

                            <View style={styles.billRow}>
                                <Text style={styles.billSubText}>Discount Voucher</Text>
                                <Text style={styles.billSubText}>- ₹{Paymentbreakdown?.promo_discount_amount}</Text>
                            </View>

                            <View style={styles.billRow}>
                                <Text style={styles.billSubText}>GST </Text>
                                <Text style={styles.billSubText}>- ₹{Paymentbreakdown?.gst_amount}</Text>
                            </View>
                            <View style={styles.billRow}>
                                <Text style={styles.billSubText}>Convenience Fee </Text>
                                <Text style={styles.billSubText}>+ ₹{Paymentbreakdown?.convenience_fee}</Text>
                            </View>
                            <View style={styles.billRow}>
                                <Text style={styles.billSubText}>Platform Fee</Text>
                                <Text style={styles.billSubText}>+ ₹{Paymentbreakdown?.platform_fee}</Text>
                            </View>
                            <View style={styles.billRow}>
                                <Text style={styles.billSubText}>QuickMySlot Discount</Text>
                                <Text style={styles.billSubText}>- ₹{Paymentbreakdown?.total_discount_amount}</Text>
                            </View>


                            <View style={styles.separator} />

                            <View style={styles.billRow}>
                                <Text style={styles.billBold}>Net Payable Amount</Text>
                                <Text style={styles.billBold}>₹{Paymentbreakdown?.final_amount}</Text>
                            </View>

                            <View style={styles.billRow}>
                                <Text style={styles.billEarned}>
                                    20% Cashback Earned
                                </Text>
                                <Text style={styles.billEarned}>+ ₹{Paymentbreakdown?.cashback_amount}</Text>
                            </View>

                            <Text style={styles.noteBottom}>
                                Note: QuickMySlot Discount Voucher earned can be used to pay for your next
                                appointment at any partner on the QuickMySlot app.
                            </Text>
                        </View>

                        <Text style={styles.confusedText}>Still confused?</Text>

                        <TouchableOpacity style={styles.whatsappBtn}>
                            <Text style={styles.whatsappText}>💬 Whatsapp Customer Care</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

export default AvailOfferModal;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    bottomSheet: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '80%',
        overflow: 'hidden',
    },
    container: {
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        color: COLOR.primary,
        fontSize: 16,
        fontFamily: Font.semibold,
        marginBottom: 16,
        textAlign: 'center',
    },
    stepBox: {
        backgroundColor: '#f9f9f9',
        borderRadius: 12,
        padding: 14,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#eee',
    },
    stepTitle: {
        color: COLOR.primary,
        fontFamily: Font.semibold,
        fontSize: 14,
        marginBottom: 5,
    },
    stepDesc: {
        fontSize: 13,
        color: '#333',
        fontFamily: Font.medium,
        lineHeight: 18,
    },
    paymentRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        alignSelf: "center"
    },
    paymentIcon: {
        width: 250,
        height: 60,
        resizeMode: 'contain',
        marginRight: 10,
        alignContent: "center",
        borderRadius: 20
    },
    note: {
        fontSize: 12,
        color: '#555',
        marginTop: 8,
        marginBottom: 20,
        textAlign: 'center',
    },
    sampleBox: {
        backgroundColor: '#f9f9f9',
        borderRadius: 12,
        padding: 14,
        borderWidth: 1,
        borderColor: '#eee',
    },
    sampleTitle: {
        textAlign: 'center',
        fontSize: 14,
        color: COLOR.primary,
        fontFamily: Font.semibold,
        marginBottom: 12,
    },
    billRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    billText: {
        fontSize: 13,
        color: '#222',
        fontFamily: Font.medium,
    },
    billSubText: {
        fontSize: 13,
        color: '#555',
        fontFamily: Font.regular,
    },
    billBold: {
        fontSize: 14,
        color: '#000',
        fontFamily: Font.semibold,
    },
    billEarned: {
        fontSize: 13,
        color: '#1a8917',
        fontFamily: Font.medium,
    },
    separator: {
        borderBottomWidth: 1,
        borderColor: '#ddd',
        marginVertical: 8,
    },
    noteBottom: {
        fontSize: 11,
        color: '#777',
        marginTop: 8,
        textAlign: 'center',
        lineHeight: 16,
    },
    confusedText: {
        textAlign: 'center',
        fontSize: 13,
        color: '#444',
        marginVertical: 12,
    },
    whatsappBtn: {
        backgroundColor: '#25D366',
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 20,
    },
    whatsappText: {
        color: '#fff',
        fontSize: 14,
        fontFamily: Font.semibold,
    },
});
