import React from 'react';
import {View, Dimensions} from 'react-native';
import {Svg, Path, Text} from 'react-native-svg';
import {useTranslation} from 'react-i18next';
const {width} = Dimensions.get('window');

interface MySVGComponent {
  text: string;
}

const MySVGComponent: React.FC<MySVGComponent> = ({text}) => {
  const {t, i18n} = useTranslation();
  const svgWidth = width / 3;
  const svgHeight = 36;
  const pathWidth = svgWidth - 1;

  return (
    <View>
      <Svg
        width={svgWidth}
        height={svgHeight}
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        fill="none">
        <Path
          d={`M${pathWidth} 35.5L1.29787 35.5L5.89914 31.3369C9.14697 28.3984 11 24.223 11 19.8431L11 5C11 2.51471 13.0147 0.499996 15.5 0.499996L${pathWidth} 0.499996L${pathWidth} 35.5Z`}
          fill="#676767"
          stroke="white"
        />
        <Text
          x={svgWidth / 2}
          y={svgHeight / 1.8}
          fill="white"
          fontSize={18}
          textAnchor="middle"
          alignmentBaseline="middle"
          fontWeight={'600'}>
          {t(text)}
        </Text>
      </Svg>
    </View>
  );
};

export default MySVGComponent;
