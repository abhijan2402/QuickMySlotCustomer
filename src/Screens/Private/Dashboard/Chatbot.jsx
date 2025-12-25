import { useIsFocused, useNavigation } from "@react-navigation/native";
import React, { useState, useRef, useEffect } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Image,
    Linking,
    Platform,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Keyboard
} from "react-native";
import { COLOR } from "../../../Constants/Colors";
import { windowHeight, windowWidth } from "../../../Backend/Utility";

const Chatbot = () => {
    const [keyboardHeight, setKeyboardHeight] = useState(0);

    const isFocus = useIsFocused()
    const navigation = useNavigation()
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            sender: "bot",
            text: "👋 Hi there! I'm QuickMySlot Assistant. How can I help you today?",
        },
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [userMsgCount, setUserMsgCount] = useState(0);

    const scrollRef = useRef(null);

    const toggleChat = () => setIsOpen(!isOpen);

    useEffect(() => {
        setTimeout(() => {
            scrollRef?.current?.scrollToEnd({ animated: true });
        }, 100);
    }, [messages, isTyping]);
    useEffect(() => {
        if (isFocus)
            setUserMsgCount(0)
    }, [isFocus])
    useEffect(() => {
        const show = Keyboard.addListener("keyboardDidShow", (e) => {
            setKeyboardHeight(e.endCoordinates.height);
        });

        const hide = Keyboard.addListener("keyboardDidHide", () => {
            setKeyboardHeight(0);
        });

        return () => {
            show.remove();
            hide.remove();
        };
    }, []);
    const getBotResponse = (msg) => {
        const lower = msg.toLowerCase();

        // ⭐ GREETINGS
        if (
            lower.includes("hi") ||
            lower.includes("hello") ||
            lower.includes("hey") ||
            lower.includes("good morning") ||
            lower.includes("good evening")
        ) {
            return "👋 Hello! Welcome to QuickMySlot. How can I help you today?";
        }

        if (
            lower.includes("how are you") ||
            lower.includes("help") ||
            lower.includes("assist")
        ) {
            return "😊 I'm here to help! Tell me what you need assistance with.";
        }

        // ⭐ BOOKING-RELATED QUESTIONS (Customer Side)
        if (lower.includes("book") || lower.includes("booking"))
            return "📅 You can book a slot by selecting your service, choosing a provider, and confirming your time.";

        if (lower.includes("cancel"))
            return "❌ You can cancel your booking from the My Bookings section before the allowed time.";

        if (lower.includes("reschedule"))
            return "🔁 Rescheduling depends on provider policy. If allowed, you will see the option under My Bookings.";

        // ⭐ PAYMENTS & REFUNDS
        if (lower.includes("payment"))
            return "💳 We support UPI, cards, and net banking. Make sure your payment method is active.";

        if (lower.includes("refund"))
            return "💰 Refunds are processed within 2–5 business days depending on your payment method.";

        if (lower.includes("failed") && lower.includes("payment"))
            return "⚠️ If your payment failed but money was deducted, it will auto-refund in 2–5 working days.";

        // ⭐ SUPPORT / CONTACT
        if (lower.includes("contact") || lower.includes("support"))
            return "📞 You can reach us anytime at support@quickmyslot.com.";

        // ⭐ ACCOUNT / PROFILE QUESTIONS
        if (lower.includes("profile") || lower.includes("account"))
            return "👤 You can update your details in the Profile section of the app.";

        // ⭐ SERVICE QUESTIONS
        if (lower.includes("service") || lower.includes("services"))
            return "🛎️ You can explore available services from the home page or search bar.";

        // ⭐ LOCATION / AVAILABILITY
        if (lower.includes("near") || lower.includes("location") || lower.includes("available"))
            return "📍 Enter your location in the app to view services available near you.";

        // ⭐ MULTI-QUERY FALLBACK (existing logic)
        if (userMsgCount >= 3)
            return "🤖 You seem to have multiple questions! Please visit the Support section for more help.";

        // ⭐ DEFAULT REPLY
        return "🤔 I'm not sure about that. Please check the Help section for more information!";
    };



    const sendMessage = () => {
        if (!input.trim()) return;

        const newMessage = { sender: "user", text: input };
        setMessages((prev) => [...prev, newMessage]);
        setUserMsgCount((prev) => prev + 1);
        setInput("");

        setIsTyping(true);

        setTimeout(() => {
            setIsTyping(false);
            const reply = getBotResponse(input);
            setMessages((prev) => [...prev, { sender: "bot", text: reply }]);
        }, 900);
    };

    const handleLinkPress = (text) => {
        console.log(text, "TEXTT");
        navigation.navigate("Support")
        return
        const urlMatch = text.match(/https?:\/\/\S+/g);
        if (urlMatch) Linking.openURL(urlMatch[0]);
    };

    return (
        <View style={{ flex: 1 }}>
            {/* Floating button */}
            {!isOpen && (
                <TouchableOpacity
                    onPress={toggleChat}
                    style={{
                        position: "absolute",
                        bottom: Platform.OS == "ios" ? 80 : 120,
                        right: 20,
                        backgroundColor: "#EE5138",
                        padding: 15,
                        borderRadius: 40,
                        elevation: 6,
                    }}
                >
                    <Image
                        source={{ uri: "https://cdn-icons-png.flaticon.com/128/11189/11189317.png" }}
                        style={{ width: 35, height: 35, tintColor: COLOR.white }}
                    />
                </TouchableOpacity>
            )}

            {isOpen && (
                <View
                    style={{
                        position: "absolute",
                        bottom: keyboardHeight / 1.5,   // 👈 MAGIC FIX
                        width: windowWidth / 1.077,
                        height: keyboardHeight ? windowHeight * 0.5 : windowHeight * 0.8,
                        backgroundColor: "white",
                        borderRadius: 16,
                        borderColor: "#ddd",
                        borderWidth: 1,
                        overflow: "hidden",
                        zIndex: 1000
                    }}
                >
                    {/* Header */}
                    <View
                        style={{
                            backgroundColor: "#EE5138",
                            padding: 12,
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <Image
                            source={{
                                uri: "https://cdn-icons-png.flaticon.com/512/4712/4712101.png",
                            }}
                            style={{ width: 26, height: 26, tintColor: "white" }}
                        />

                        <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>
                            QuickMySlot
                        </Text>

                        <TouchableOpacity
                            onPress={() => {
                                setMessages([]);
                                toggleChat();
                            }}
                        >
                            <Text style={{ color: "white", fontSize: 18 }}>✕</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Messages */}
                    <ScrollView
                        ref={scrollRef}
                        keyboardShouldPersistTaps="handled"
                        style={{ flex: 1, padding: 10, backgroundColor: "#f5f5f5" }}
                    >
                        {messages.map((msg, idx) => (
                            <TouchableOpacity onPress={handleLinkPress}
                                key={idx}
                                style={{
                                    alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                                    backgroundColor:
                                        msg.sender === "user" ? "#EE5138" : "#ddd",
                                    padding: 10,
                                    borderRadius: 14,
                                    maxWidth: "75%",
                                    marginBottom: 10,
                                }}
                            >
                                <Text
                                    style={{
                                        color: msg.sender === "user" ? "white" : "black",
                                        fontSize: 13,
                                    }}
                                >
                                    {msg.text}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    {/* Input */}
                    <View
                        style={{
                            flexDirection: "row",
                            padding: 10,
                            borderTopWidth: 1,
                            borderColor: "#ccc",
                            backgroundColor: "white",
                        }}
                    >
                        <TextInput
                            value={input}
                            onChangeText={setInput}
                            placeholder="Type message…"
                            style={{
                                flex: 1,
                                padding: 10,
                                borderWidth: 1,
                                borderColor: "#ccc",
                                borderRadius: 10,
                            }}
                        />

                        <TouchableOpacity
                            onPress={sendMessage}
                            style={{
                                backgroundColor: "#EE5138",
                                paddingVertical: 10,
                                paddingHorizontal: 14,
                                marginLeft: 8,
                                borderRadius: 10,
                            }}
                        >
                            <Text style={{ color: "white" }}>Send</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}


        </View>
    );
};

export default Chatbot;
