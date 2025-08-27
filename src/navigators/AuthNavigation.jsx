import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../Screens/Auth/Login';
import OtpScreen from '../Screens/Auth/OtpScreen';
import MainHome from '../Screens/Private/Home/MainHome';
import BottomNavigation from './BottomNavigation';
import Faq from '../Screens/Private/Account/Faq';
import ForgotPassword from '../Screens/Private/Account/ForgotPassword';
import Wallet from '../Screens/Private/Account/Wallet';
import Appointment from '../Screens/Private/AppointmentSection/Appointment';
import Cms from '../Components/Cms';
import Support from '../Screens/Private/Account/Support';
import Invite from '../Screens/Private/Account/Invite';
import MyAnalytics from '../Screens/Private/Home/Analytics';
import SearchServices from '../Screens/Private/Home/SearchServices';
// import ProviderDetails from '../Screens/Private/Service/ServiceDetailPage';
import BookingScreen from '../Screens/Private/Home/BookingScreen';
import Checkout from '../Screens/Private/Home/Checkout';
import BookingConfirmation from '../Screens/Private/Home/BookingConfirmation';
import AppointmentDetail from '../Screens/Private/AppointmentSection/AppointmentDetail';
import ServiceList from '../Screens/Private/Home/ServiceList';
import NotificationsScreen from '../Screens/Private/Home/Notification';
import ProviderDetails from '../Screens/Private/Service/ServiceDetailPage';
import PayBill from '../Screens/Private/Payments/PayBill';
import OffersScreen from '../Screens/Private/AppointmentSection/OffersScreen';
import EditProfile from '../Screens/Private/Account/EditProfile';
const Stack = createNativeStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="OtpScreen" component={OtpScreen} />
      <Stack.Screen name="BottomNavigation" component={BottomNavigation} />
      <Stack.Screen name="MainHome" component={MainHome} />
      <Stack.Screen name="Faq" component={Faq} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="Wallet" component={Wallet} />
      <Stack.Screen name="Appointment" component={Appointment} />
      <Stack.Screen name="Cms" component={Cms} />
      <Stack.Screen name="Support" component={Support} />
      <Stack.Screen name="Invite" component={Invite} />
      <Stack.Screen name="MyAnalytics" component={MyAnalytics} />
      <Stack.Screen name="SearchServices" component={SearchServices} />
      <Stack.Screen name="ProviderDetails" component={ProviderDetails} />
      <Stack.Screen name="BookingScreen" component={BookingScreen} />
      <Stack.Screen name="Checkout" component={Checkout} />
      <Stack.Screen name="AppointmentDetail" component={AppointmentDetail} />
      <Stack.Screen name="ServiceList" component={ServiceList} />
      <Stack.Screen name="NotificationsScreen" component={NotificationsScreen} />
      <Stack.Screen name="BookingConfirmation" component={BookingConfirmation} />
      <Stack.Screen name="PayBill" component={PayBill} />
      <Stack.Screen name="OffersScreen" component={OffersScreen} />
      <Stack.Screen name="EditProfile" component={EditProfile} />


      {/* <Stack.Screen name="SignUp" component={SignUp} /> */}



    </Stack.Navigator>
  );
};

export default AuthStack;
