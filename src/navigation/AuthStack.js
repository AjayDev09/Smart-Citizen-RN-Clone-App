import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Login from '../screens/login';
import { LOGIN, REGISTER } from '../constants';
import Register from '../screens/register';
import { useTranslation } from 'react-i18next';
import OtpView from '../screens/register/OtpView';
import ThankYou from '../screens/register/thankyou';
import ForgotPassword from '../screens/forgotPassword';
import ResetPassword from '../screens/resetPassword';

const Stack = createStackNavigator();

const AuthStack = () => {
  const {t} = useTranslation();
  // const [isFirstLaunch, setIsFirstLaunch] = useState(null);
  // let routeName;

  // console.log('AuthStack 789465')
  // useEffect(() => {
  //   AsyncStorage.getItem('alreadyLaunched').then((value) => {
  //     if (value == null) {
  //       AsyncStorage.setItem('alreadyLaunched', 'true'); 
  //       setIsFirstLaunch(true);
  //     } else {
  //       setIsFirstLaunch(false);
  //     }
  //   });

    
  // }, []);

  // if (isFirstLaunch === null) {
  //   return null;
  // } else if (isFirstLaunch == true) {
  //   routeName = 'Home';
  // } else {
  //   routeName = 'Login';
  // }

  return (
    <Stack.Navigator
        initialRouteName={LOGIN}
        screenOptions={{
            headerShown: false
        }}
    >
        <Stack.Screen name={'login'} options={{title: t('navigate:login') }}  component={Login} />
        <Stack.Screen name={'register'} options={{title: t('navigate:register') }} component={Register} />
        <Stack.Screen name={'otpView'} options={{title: t('navigate:otpView') }} component={OtpView} />
        <Stack.Screen name={'thankyou'} options={{title: t('navigate:thankyou') }} component={ThankYou} />
        <Stack.Screen name={'forgotPassword'} options={{title: t('navigate:forgotPassword') }} component={ForgotPassword} />
        <Stack.Screen name={'resetPassword'} options={{title: t('navigate:resetPassword') }} component={ResetPassword} />
    </Stack.Navigator>
  )
}

export default AuthStack