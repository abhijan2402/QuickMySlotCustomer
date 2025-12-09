import { FlatList, Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import HomeHeader from '../../../Components/HomeHeader'
import { COLOR } from '../../../Constants/Colors'
import { GET_WITH_TOKEN } from '../../../Backend/Api'
import { CUSTOMER_WISHLIST } from '../../../Constants/ApiRoute'
import { Typography } from '../../../Components/UI/Typography'
import { Font } from '../../../Constants/Font'
import { cleanImageUrl, windowHeight, windowWidth } from '../../../Backend/Utility'
import { Colors } from 'react-native/Libraries/NewAppScreen'
import { useIsFocused } from '@react-navigation/native'

const Wishlist = ({ navigation }) => {
    const [loading, setLoading] = useState(false);
    const [apiData, setApiData] = useState([]);
    const isFocus = useIsFocused()
    const GetWishlist = () => {
        setLoading(true);
        GET_WITH_TOKEN(
            CUSTOMER_WISHLIST,
            success => {
                // setCategory(success?.data?.service_category)
                setApiData(success?.data?.wishlist);
                setLoading(false);
            },
            error => setLoading(false),
            fail => setLoading(false)``,
        );
    }
    useEffect(() => {
        GetWishlist()
    }, [isFocus])
    const renderCard = ({ item }) => {

        return (
            <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => {
                    navigation.navigate('ProviderDetails', { id: item?.vendor?.id, km: item?.km })
                }}
                style={styles.card} >
                <View style={styles.imageContainer}>
                    {item?.vendor?.image ? (
                        // <></>
                        <Image
                            source={{
                                uri: item?.vendor?.image
                            }}
                            style={styles.cardImage}
                            // defaultSource={images.placeholder}
                            onError={() => console.log('Image failed to load:', item?.image)}
                        />
                    ) : (
                        <View style={styles.placeholderImage}>
                            <Typography color={COLOR.grey}>No Image</Typography>
                        </View>
                    )}
                </View>

                {
                    item?.is_cashback != "0" &&
                    <View style={{ backgroundColor: COLOR.blue, paddingVertical: 5, borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}>
                        <Typography size={14} color={COLOR.white} font={Font.semibold} style={{ textAlign: "center" }}>Get upto {(parseInt(item?.is_cashback?.replace('%', '')) || 0) + 20}% discount via QuickMySlot
                        </Typography>
                    </View>
                }
                <View style={[styles.cardContent]}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <Typography
                            size={14}
                            font={Font.semibold}
                            color={COLOR.black}
                            style={[styles.cardTitle, { width: "70%" }]}>
                            {item?.vendor?.business_name || 'Unknown Business'}
                        </Typography>
                        {
                            item?.vendor?.service_category == 1 || item?.vendor?.service_category == 2 || item?.vendor?.service_category == 3 ?
                                <View style={{ flexDirection: "row" }}>
                                    <Typography size={13}
                                        font={Font.semibold}
                                        color="#666">Unisex | ₹₹</Typography>
                                </View> : ""
                        }

                    </View>
                    {/* String(category) === "1" || */}
                    {/* String(category) === "2" || */}
                    {/* {item?.business_description && (
          <Typography
            numberOfLines={2}
            size={14}
            font={Font.regular}
            color={COLOR.darkGrey}
            style={styles.description}>
            {item.business_description}
          </Typography>
        )} */}
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                        <View style={{ width: "80%", }}>
                            {item?.vendor?.exact_location && (
                                <>
                                    <View style={{ flexDirection: "row" }}>
                                        <Typography
                                            numberOfLines={1}
                                            size={13}
                                            color="#666"
                                            font={Font.medium}
                                            style={[styles.textRow, {}]}>
                                            {item?.vendor?.exact_location}
                                        </Typography>
                                        {/* <Typography
                                            size={13}
                                            color="#666"
                                            font={Font.medium}
                                            style={[styles.textRow, {}]}
                                        >
                                            | {item?.km} kms
                                        </Typography> */}

                                    </View>
                                </>
                            )}
                        </View>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Image source={{ uri: "https://cdn-icons-png.flaticon.com/128/3334/3334338.png" }} style={{ width: 13, height: 13, marginRight: 2 }} />
                            <Typography size={14}
                                color="#666"
                                font={Font.semibold}>3.4</Typography>
                        </View>
                    </View>
                </View>
            </TouchableOpacity >
        )
    }
    return (
        <View style={{ backgroundColor: Colors.white, height: windowHeight }}>
            <HomeHeader
                title="Wishlist"
                leftIcon="https://cdn-icons-png.flaticon.com/128/2722/2722991.png"
                leftTint={COLOR.black}
            />
            <FlatList
                data={apiData}
                keyExtractor={(item, index) => `${item.id} _${index}`}
                renderItem={renderCard}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
            />
        </View>
    )
}

export default Wishlist

const styles = StyleSheet.create({
    listContainer: {
        paddingBottom: 120,
        paddingHorizontal: 5,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
    },

    card: {
        backgroundColor: COLOR.white,
        borderRadius: 16,
        marginVertical: 8,
        overflow: Platform.OS === 'android' ? 'hidden' : 'visible', // keep iOS shadows visible
        elevation: 4, // Android shadow
        marginHorizontal: 8,
        // iOS shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 6,

        // Optional: subtle border to improve visual definition on light backgrounds
        borderWidth: Platform.OS === 'ios' ? 0.3 : 0,
        borderColor: 'rgba(0,0,0,0.05)',
    },

    imageContainer: {
        position: 'relative',
    },
    cardImage: {
        width: windowWidth - 30,
        height: 190,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
    },
    placeholderImage: {
        width: windowWidth - 30,
        height: 190,
        backgroundColor: COLOR.lightGrey,
        justifyContent: 'center',
        alignItems: 'center',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
    },
    ratingBadge: {
        position: 'absolute',
        bottom: 10,
        right: 10,
        backgroundColor: COLOR.primary,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        elevation: 3,
    },
    cardContent: {
        padding: 14,
    },
    cardTitle: {
        marginBottom: 6,
    },
    description: {
        marginBottom: 8,
        lineHeight: 18,
    },
    textRow: {
        marginBottom: 4,
    },
    availability: {
        marginTop: 6,
        color: COLOR.primary,
    },
    workingDaysContainer: {
        marginTop: 8,
    },
    daysList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 4,
    },
    dayText: {
        marginRight: 6,
    },

    footerLoader: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
    },

    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: windowHeight * 0.2,
        paddingHorizontal: 20,
    },
    emptyImage: {
        height: 120,
        width: 120,
        resizeMode: 'contain',
    },
    emptyText: {
        marginTop: 10,
        color: COLOR.black,
    },
})