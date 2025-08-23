import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { windowWidth } from '../../Constants/Dimensions';

const FULL_WIDTH = windowWidth;
const SkeletonComman = ({
  SmallBox = false,
  LongBox = false,
  IconBox = false,
  circle = false,
  width = 35,
  height = 35,
  borderRadius = 150,
  Box = false,
  boxWidth = FULL_WIDTH * 0.72,
  boxHeight = 50,
  backgroundColor,
}) => {
  return (
    <View
      style={{
        alignContent: 'center',
        alignSelf: 'center',
        alignItems: 'center',
      }}>
      <SkeletonPlaceholder backgroundColor={backgroundColor} borderRadius={4}>
        {SmallBox ? (
          <SkeletonPlaceholder.Item flexDirection="row" alignItems="center">
            <SkeletonPlaceholder.Item>
              <SkeletonPlaceholder.Item
                width={FULL_WIDTH * 0.9}
                height={50}
                marginTop={5}
              />
            </SkeletonPlaceholder.Item>
          </SkeletonPlaceholder.Item>
        ) : null}
        {LongBox ? (
          <SkeletonPlaceholder.Item flexDirection="row" alignItems="center">
            <SkeletonPlaceholder.Item>
              <SkeletonPlaceholder.Item
                marginTop={6}
                width={FULL_WIDTH * 0.9}
                height={200}
                borderRadius={15}
              />
            </SkeletonPlaceholder.Item>
          </SkeletonPlaceholder.Item>
        ) : null}
        {IconBox ? (
          <SkeletonPlaceholder.Item
            marginTop={15}
            flexDirection="row"
            alignItems="center">
            <SkeletonPlaceholder.Item
              width={50}
              height={50}
              marginTop={5}
              borderRadius={150}
            />
            <SkeletonPlaceholder.Item
              width={FULL_WIDTH * 0.72}
              height={50}
              marginTop={5}
              marginLeft={10}
            />
          </SkeletonPlaceholder.Item>
        ) : null}
        {circle && (
          <SkeletonPlaceholder.Item
            backgroundColor={backgroundColor}
            width={width}
            height={height}
            borderRadius={borderRadius}
          />
        )}
        {Box && (
          <SkeletonPlaceholder.Item
            backgroundColor={backgroundColor}
            width={boxWidth}
            height={boxHeight}
          />
        )}
      </SkeletonPlaceholder>
    </View>
  );
};

export default SkeletonComman;

const styles = StyleSheet.create({});
