import {
  Canvas,
  Circle,
  useTouchHandler,
  useValue,
  Image,
  useImage,
  Skia,
  createPicture,
  Picture,
} from '@shopify/react-native-skia';
import React, {useRef, useState} from 'react';
import {
  TouchableOpacity,
  useWindowDimensions,
  Text,
  View,
  SafeAreaView,
} from 'react-native';
const DEMO_IMAGE = require('./src/demo.jpeg');

const App = () => {
  const image = useImage(DEMO_IMAGE);
  const skiaRef = useRef(null);
  const dimension = useWindowDimensions();
  const cx = useValue(dimension.width / 2);
  const cy = useValue(100);
  const size = dimension.height;
  const r = size * 0.33;
  const [circles, setCircles] = useState([]);
  const [result, setResult] = useState(null);
  const [img, setImage] = useState(null);

  const touchHandler = useTouchHandler({
    onActive: ({x, y}) => {
      console.log('coordinate', x, y);
      cx.current = x;
      cy.current = y;
      setCircles(pre => pre.concat({x, y}));
    },
  });

  const onGetMask = () => {
    const picture = createPicture(
      {
        x: 0,
        y: 0,
        height: dimension.height / 2,
        width: dimension.width,
      },
      canvas => {
        const paint = Skia.Paint();
        paint.setColor(Skia.Color('black'));
        canvas.drawRect(
          {x: 0, y: 0, width: dimension.width, height: dimension.height / 2},
          paint,
        );

        const circlePaint = Skia.Paint();
        circlePaint.setColor(Skia.Color('white'));
        circles.forEach(circle => {
          canvas.drawCircle(circle.x, circle.y, 10, circlePaint);
        });
      },
    );
    setResult(picture);
  };

  const onGetImage = () => {
    const img = skiaRef.current?.makeImageSnapshot();
    setImage(img);
  };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'grey'}}>
      <Canvas
        onTouch={touchHandler}
        ref={skiaRef}
        style={{
          flex: 1,
          backgroundColor: 'white',
        }}>
        <Image
          image={image}
          fit={'fill'}
          x={0}
          y={0}
          height={dimension.height / 2}
          width={dimension.width}
        />
        <Circle cx={cx} cy={cy} r={10} color="blue" />
        {circles.map(circle => (
          <Circle cx={circle.x} cy={circle.y} r={10} color="blue" />
        ))}
        {result && <Picture picture={result} />}
        <Image
          image={img}
          fit={'fill'}
          x={0}
          y={0}
          height={dimension.height / 2}
          width={dimension.width}
        />
      </Canvas>
      <View
        style={{
          justifyContent: 'center',
          display: 'flex',
          flex: 1,
          alignItems: 'center',
        }}>
        {/* <Image source={DEMO_IMAGE} resizeMode="cover" height={100} /> */}
        <TouchableOpacity
          onPress={onGetMask}
          style={{backgroundColor: 'white', padding: 10}}>
          <Text>Get mask</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onGetImage}
          style={{backgroundColor: 'white', padding: 10}}>
          <Text>Get Image</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default App;
