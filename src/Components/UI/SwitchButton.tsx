import { StyleProp, StyleSheet, TextStyle, View, ViewStyle } from 'react-native';
import { Switch } from 'react-native-switch';
import { COLOR } from '../../Constants/Colors';

const SwitchButton = ({
  value = false,
  onValueChange = () => { },
  style = {},
  disabled = false,
}) => {
  const styles = createStyles();
  return (
    <View style={[styles.border, style]}>
      <Switch
        barHeight={25}
        containerStyle={{ margin: 1 }}
        onValueChange={onValueChange}
        value={value}
        activeTextStyle={styles.TextStyle1}
        inactiveTextStyle={styles.TextStyle}
        switchWidthMultiplier={2.3}
        circleBorderWidth={0.3}
        backgroundActive={COLOR?.primaryLight}
        backgroundInactive={COLOR?.lightGrey}
        circleSize={21}
        switchRightPx={3}
        switchLeftPx={3}
        activeText={''}
        inActiveText={''}
        disabled={disabled}
      />
    </View>
  );
};

export default SwitchButton;

const createStyles = () =>
  StyleSheet.create({
    border: {},
    TextStyle1: {
      color: COLOR.black,
    },
    TextStyle: {
      color: COLOR.black,
    },
  });
