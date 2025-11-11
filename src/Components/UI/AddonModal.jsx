import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableWithoutFeedback,
    TouchableOpacity,
    ScrollView,
    Image,
} from 'react-native';
import { COLOR } from '../../Constants/Colors';
import { Font } from '../../Constants/Font';

const AddonModal = ({ visible, onClose, selectedAddon, data, onAddService }) => {
    const [selectedDuration, setSelectedDuration] = useState(null);
    const [selectedVal, setselectedVal] = useState(null)
    // Example data fallback
    console.log(selectedAddon, "DAATRARAR");


    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                {/* Tap outside to close */}
                <TouchableWithoutFeedback onPress={onClose}>
                    <View style={StyleSheet.absoluteFillObject} />
                </TouchableWithoutFeedback>

                {/* Bottom Sheet */}
                <View style={styles.sheet}>
                    {/* Handle bar */}
                    <View style={styles.handleBar} />

                    {/* Header */}
                    <View style={styles.headerRow}>
                        <Text style={styles.title}>{selectedAddon.name}</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Image
                                source={{
                                    uri: 'https://cdn-icons-png.flaticon.com/512/1828/1828778.png',
                                }}
                                style={styles.closeIcon}
                            />
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        {/* Description */}
                        <View style={styles.descBox}>
                            <Text style={styles.description}>{selectedAddon.description}</Text>
                        </View>

                        {/* Duration Options */}
                        <View style={styles.optionBox}>
                            <View style={styles.optionHeader}>
                                <Text style={styles.optionTitle}>Choose Duration</Text>
                                <Text style={styles.required}>REQUIRED</Text>
                            </View>
                            <Text style={styles.subText}>Select any one</Text>

                            {Object?.entries(selectedAddon?.addons || {}).map(([key, value], index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={styles.optionRow}
                                    onPress={() => {
                                        setselectedVal(value)
                                        setSelectedDuration(key)
                                    }}
                                    activeOpacity={0.8}
                                >
                                    <Text style={styles.optionLabel}>{key}</Text>

                                    <View style={styles.optionRight}>
                                        <Text style={styles.optionPrice}>₹ {Number(value) + Number(selectedAddon?.price)}</Text>
                                        <View
                                            style={[
                                                styles.radioOuter,
                                                selectedDuration === key && styles.radioOuterActive,
                                            ]}
                                        >
                                            {selectedDuration === key && <View style={styles.radioInner} />}
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            ))}

                        </View>
                    </ScrollView>

                    {/* Add Button */}
                    <TouchableOpacity style={styles.addButton} onPress={() => { onAddService(selectedAddon, selectedDuration, selectedVal) }}>
                        <Text style={styles.addButtonText}>Add Service</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default AddonModal;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'flex-end',
    },
    sheet: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '85%',
        paddingBottom: 10,
        overflow: 'hidden',
    },
    handleBar: {
        alignSelf: 'center',
        width: 40,
        height: 4,
        backgroundColor: '#ddd',
        borderRadius: 2,
        marginVertical: 8,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 10,
    },
    title: {
        fontSize: 16,
        fontFamily: Font.semibold,
        color: '#000',
    },
    closeButton: {
        padding: 4,
    },
    closeIcon: {
        width: 18,
        height: 18,
        tintColor: '#000',
    },
    descBox: {
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
        marginHorizontal: 20,
        padding: 12,
    },
    description: {
        fontSize: 13,
        color: '#444',
        fontFamily: Font.regular,
        lineHeight: 18,
    },
    optionBox: {
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
        margin: 20,
        padding: 12,
    },
    optionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    optionTitle: {
        fontSize: 14,
        fontFamily: Font.semibold,
        color: '#000',
    },
    required: {
        backgroundColor: '#EAF1FE',
        color: '#3B6EF4',
        fontSize: 10,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 6,
        fontFamily: Font.medium,
    },
    subText: {
        color: '#888',
        fontSize: 12,
        marginTop: 4,
        marginBottom: 10,
    },
    optionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderColor: '#eee',
    },
    optionLabel: {
        fontSize: 13,
        color: '#000',
        fontFamily: Font.medium,
    },
    optionRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    optionPrice: {
        fontSize: 13,
        color: '#666',
        marginRight: 10,
        fontFamily: Font.semibold
    },
    radioOuter: {
        width: 18,
        height: 18,
        borderRadius: 9,
        borderWidth: 1.5,
        borderColor: '#999',
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioOuterActive: {
        borderColor: COLOR.primary,
    },
    radioInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: COLOR.primary,
    },
    addButton: {
        backgroundColor: COLOR.primary,
        paddingVertical: 14,
        marginHorizontal: 20,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 15,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 14,
        fontFamily: Font.semibold,
    },
});
