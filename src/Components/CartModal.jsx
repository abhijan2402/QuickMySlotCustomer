import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { CLEAR_CART, GET_CART } from '../Constants/ApiRoute';
import { GET_WITH_TOKEN } from '../Backend/Api';
import { ToastMsg, windowWidth } from '../Backend/Utility';
import { Typography } from './UI/Typography';
import { Font } from '../Constants/Font';
import { COLOR } from '../Constants/Colors';

const CartModal = ({ onCartCall = () => { } }) => {
    const navigation = useNavigation()
    const [totalItemsVal, settotalItemsVal] = useState(0)
    const [shopData, setShopData] = useState(null);
    const isFocused = useIsFocused()
    useEffect(() => {
        if (isFocused) {
            getCart()
        }
    }, [isFocused]);

    const getCart = () => {
        GET_WITH_TOKEN(
            GET_CART,
            success => {
                const items = success?.data?.items || [];
                settotalItemsVal(success?.data)
                let vendorInfo = null;

                if (items?.length > 0 && items[0]?.service?.user) {
                    vendorInfo = items[0].service.user;
                }
                setShopData(vendorInfo)

            },
            error => {
                console.log('Cart fetch error:', error);
            },
            fail => {
                console.log('Cart fetch fail:', fail);
            },
        );
    };

    const clearCart = () => {
        GET_WITH_TOKEN(
            CLEAR_CART,
            success => {
                ToastMsg(success?.message)
                getCart()
                onCartCall()
            },
            error => {
                console.log('Cart fetch error:', error);
                ToastMsg(error?.message)

            },
            fail => {
                console.log('Cart fetch fail:', fail);
                ToastMsg(fail?.message)

            },
        );
    };
    const handleClearCart = () => {
        Alert.alert(
            'Clear Cart',
            `Are you sure you want to remove all items from ${shopData?.business_name || 'this shop'}?`,
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Yes, Clear',
                    onPress: () => clearCart(),
                    style: 'destructive',
                },
            ],
            { cancelable: true },
        );
    };
    return (
        <View>
            {
                totalItemsVal?.items?.length > 0 &&
                <View style={{ borderWidth: 1, flexDirection: "row", padding: 8, borderWidth: 1, borderColor: COLOR.primary, borderRadius: 7, alignItems: "center", position: "absolute", bottom: 10, alignSelf: "center", backgroundColor: COLOR.white }}>
                    <View style={{ width: windowWidth / 1.7777 }}>
                        <Typography size={15} font={Font.semibold}>{shopData?.business_name || 'Shop Name'}</Typography>
                        <Typography size={13} color={COLOR.black} font={Font.regular}>{totalItemsVal?.total_items} {totalItemsVal?.total_items == 1 ? "item" : "items"}</Typography>
                    </View>
                    <TouchableOpacity onPress={() =>
                        navigation.navigate('BookingScreen')
                    } style={{ marginVertical: 6, backgroundColor: COLOR.primary, padding: 5, borderRadius: 6, paddingHorizontal: 10 }}>
                        <Typography color={COLOR.white} size={14}>View cart</Typography>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleClearCart}>
                        <Image source={{ uri: "https://cdn-icons-png.flaticon.com/128/1828/1828843.png" }} style={{ width: 20, height: 20, marginLeft: 10 }} />
                    </TouchableOpacity>
                </View>
            }        </View>
    )
}

export default CartModal

const styles = StyleSheet.create({})