import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    Modal,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    TextInput,
    ScrollView,
    KeyboardAvoidingView,
} from 'react-native';
import { COLOR } from '../../Constants/Colors';
import { Font } from '../../Constants/Font';

const CalculateBillOfferModal = ({ visible, onClose, sampleAmount, Paymentbreakdown }) => {
    const [billAmount, setBillAmount] = useState(Paymentbreakdown ? String(Paymentbreakdown?.subtotal) : '');
    const [calculated, setCalculated] = useState(null);
    const [usePaymentBreakdown, setUsePaymentBreakdown] = useState(!!Paymentbreakdown);

    const handleCalculate = () => {
        const total = parseFloat(billAmount) || 0;
        if (total <= 0) return;

        // 🔹 Same calculation logic you had before
        const voucher = 25;
        const discount = total * 0.25;
        const platformFee = 20;
        const convenienceFee = total * 0.02; // assume 2% for demonstration
        const cashback = total * 0.05; // assume 5% cashback
        const gst = 0; // optional
        const finalAmount = total - voucher - discount + platformFee + convenienceFee;

        setCalculated({
            subtotal: total,
            gst_amount: gst,
            platform_fee: platformFee,
            discount_amount: voucher + discount,
            convenience_fee: convenienceFee,
            cashback_amount: cashback,
            final_amount: finalAmount,
        });

        setUsePaymentBreakdown(false); // switch to calculated mode
    };

    const dataToShow = usePaymentBreakdown ? Paymentbreakdown : calculated;

    useEffect(() => {
        if (sampleAmount && Paymentbreakdown) {
            setUsePaymentBreakdown(true);
        }
    }, [sampleAmount, Paymentbreakdown]);

    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
            <KeyboardAvoidingView

                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.overlay}>
                <TouchableWithoutFeedback onPress={onClose}>
                    <View style={StyleSheet.absoluteFillObject} />
                </TouchableWithoutFeedback>

                <View style={styles.bottomSheet}>
                    <Text style={styles.headerText}>This is a sample bill for your reference</Text>

                    {/* Input Row */}
                    <View style={styles.inputRow}>
                        <TextInput
                            value={billAmount}
                            onChangeText={setBillAmount}
                            placeholder="Enter Bill Amount"
                            keyboardType="numeric"
                            style={styles.input}
                        />
                        <TouchableOpacity style={styles.calcBtn} onPress={handleCalculate}>
                            <Text style={styles.calcText}>Calculate</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Bill Details */}
                    {dataToShow && (
                        <ScrollView style={styles.billCard} showsVerticalScrollIndicator={false}>
                            <View style={styles.billRow}>
                                <Text style={styles.label}>Subtotal</Text>
                                <Text style={styles.value}>₹ {dataToShow.subtotal.toFixed(2)}</Text>
                            </View>

                            <View style={styles.billRow}>
                                <Text style={styles.label}>GST</Text>
                                <Text style={styles.value}>₹ {dataToShow.gst_amount.toFixed(2)}</Text>
                            </View>

                            <View style={styles.billRow}>
                                <Text style={styles.label}>Platform Fee</Text>
                                <Text style={styles.plusValue}>+ ₹ {dataToShow.platform_fee.toFixed(2)}</Text>
                            </View>

                            {/* {dataToShow.discount_amount > 0 && (
                                <View style={styles.billRow}>
                                    <Text style={styles.label}>Discount</Text>
                                    <Text style={styles.minusValue}>- ₹ {dataToShow.discount_amount.toFixed(2)}</Text>
                                </View>
                            )} */}

                            <View style={styles.billRow}>
                                <Text style={styles.label}>Convenience Fee</Text>
                                <Text style={styles.plusValue}>+ ₹ {dataToShow.convenience_fee.toFixed(2)}</Text>
                            </View>

                            {dataToShow.cashback_amount > 0 && (
                                <View style={styles.billRow}>
                                    <Text style={[styles.label, { color: '#1a8917' }]}>Cashback</Text>
                                    <Text style={[styles.plusValue, { color: '#1a8917' }]}>
                                        - ₹ {dataToShow.cashback_amount.toFixed(2)}
                                    </Text>
                                </View>
                            )}

                            <View style={styles.separator} />

                            <View style={styles.billRow}>
                                <Text style={[styles.label, styles.boldText]}>Final Amount :</Text>
                                <Text style={[styles.value, styles.boldText]}>
                                    ₹ {dataToShow.final_amount.toFixed(2)}
                                </Text>
                            </View>

                            <Text style={styles.note}>
                                Note: QuickMySlot Cashback earned can be used to pay for your next appointment at
                                any partner on the QuickMySlot app.
                            </Text>
                        </ScrollView>
                    )}
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
};

export default CalculateBillOfferModal;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'flex-end',
    },
    bottomSheet: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        maxHeight: '90%',
    },
    headerText: {
        fontSize: 14,
        textAlign: 'center',
        fontFamily: Font.semibold,
        color: '#333',
        marginBottom: 12,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 14,
        fontFamily: Font.semibold
    },
    calcBtn: {
        backgroundColor: COLOR.primary,
        borderRadius: 8,
        marginLeft: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    calcText: {
        color: '#fff',
        fontFamily: Font.semibold,
        fontSize: 14,
    },
    billCard: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 12,
        padding: 14,
    },
    billRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    label: {
        fontSize: 13,
        color: '#333',
        fontFamily: Font.medium,
    },
    value: {
        fontSize: 13,
        fontFamily: Font.medium,
        color: '#000',
    },
    minusValue: {
        fontSize: 13,
        color: '#d32f2f',
        fontFamily: Font.medium,
    },
    plusValue: {
        fontSize: 13,
        color: '#388e3c',
        fontFamily: Font.medium,
    },
    boldText: {
        fontFamily: Font.semibold,
    },
    separator: {
        borderBottomWidth: 1,
        borderColor: '#ddd',
        marginVertical: 8,
    },
    note: {
        fontSize: 11,
        color: '#555',
        marginTop: 8,
        lineHeight: 16,
    },
});
