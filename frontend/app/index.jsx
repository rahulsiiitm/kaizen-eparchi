



// // import { Image } from 'expo-image';
// // import { Platform, StyleSheet } from 'react-native';

// // import { HelloWave } from '@/components/hello-wave';
// // import ParallaxScrollView from '@/components/parallax-scroll-view';
// // import { ThemedText } from '@/components/themed-text';
// // import { ThemedView } from '@/components/themed-view';
// // import { Link } from 'expo-router';

// // export default function HomeScreen() {
// //   return (
// //     <ParallaxScrollView
// //       headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
// //       headerImage={
// //         <Image
// //           source={require('@/assets/images/partial-react-logo.png')}
// //           style={styles.reactLogo}
// //         />
// //       }>
// //       <ThemedView style={styles.titleContainer}>
// //         <ThemedText type="title">Welcome!</ThemedText>
// //         <HelloWave />
// //       </ThemedView>
// //       <ThemedView style={styles.stepContainer}>
// //         <ThemedText type="subtitle">Step 1: Try it</ThemedText>
// //         <ThemedText>
// //           Edit <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> to see changes.
// //           Press{' '}
// //           <ThemedText type="defaultSemiBold">
// //             {Platform.select({
// //               ios: 'cmd + d',
// //               android: 'cmd + m',
// //               web: 'F12',
// //             })}
// //           </ThemedText>{' '}
// //           to open developer tools.
// //         </ThemedText>
// //       </ThemedView>
// //       <ThemedView style={styles.stepContainer}>
// //         <Link href="/modal">
// //           <Link.Trigger>
// //             <ThemedText type="subtitle">Step 2: Explore</ThemedText>
// //           </Link.Trigger>
// //           <Link.Preview />
// //           <Link.Menu>
// //             <Link.MenuAction title="Action" icon="cube" onPress={() => alert('Action pressed')} />
// //             <Link.MenuAction
// //               title="Share"
// //               icon="square.and.arrow.up"
// //               onPress={() => alert('Share pressed')}
// //             />
// //             <Link.Menu title="More" icon="ellipsis">
// //               <Link.MenuAction
// //                 title="Delete"
// //                 icon="trash"
// //                 destructive
// //                 onPress={() => alert('Delete pressed')}
// //               />
// //             </Link.Menu>
// //           </Link.Menu>
// //         </Link>

// //         <ThemedText>
// //           {`Tap the Explore tab to learn more about what's included in this starter app.`}
// //         </ThemedText>
// //       </ThemedView>
// //       <ThemedView style={styles.stepContainer}>
// //         <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
// //         <ThemedText>
// //           {`When you're ready, run `}
// //           <ThemedText type="defaultSemiBold">npm run reset-project</ThemedText> to get a fresh{' '}
// //           <ThemedText type="defaultSemiBold">app</ThemedText> directory. This will move the current{' '}
// //           <ThemedText type="defaultSemiBold">app</ThemedText> to{' '}
// //           <ThemedText type="defaultSemiBold">app-example</ThemedText>.
// //         </ThemedText>
// //       </ThemedView>
// //     </ParallaxScrollView>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   titleContainer: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     gap: 8,
// //   },
// //   stepContainer: {
// //     gap: 8,
// //     marginBottom: 8,
// //   },
// //   reactLogo: {
// //     height: 178,
// //     width: 290,
// //     bottom: 0,
// //     left: 0,
// //     position: 'absolute',
// //   },
// // });


// //login page

// // import React, { useState } from 'react';
// // import { View, Text, TextInput, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
// // import { commonStyles } from '../../styles/common_style'; // adjust path if needed

// // export default function HealthcareLoginScreen() {
// //   const [phoneNumber, setPhoneNumber] = useState('');

// //   const handleLogin = () => {
// //     console.log('Login with phone:', phoneNumber);
// //   };

// //   return (
// //     <SafeAreaView style={commonStyles.container}>
// //       <StatusBar barStyle="dark-content" />

// //       {/* Header */}
// //       <View style={commonStyles.header}>
// //         <TouchableOpacity style={commonStyles.backButton}>
// //           <Text style={commonStyles.backIcon}>‹</Text>
// //         </TouchableOpacity>
// //       </View>

// //       {/* Main Content */}
// //       <View style={commonStyles.content}>
// //         <View style={commonStyles.titleSection}>
// //           <Text style={commonStyles.welcomeText}>Welcome to</Text>
// //           <Text style={commonStyles.brandText}>All In One Healthcare</Text>
// //           <Text style={commonStyles.subtitle}>
// //             Your health, just a tap away. Log in to book consultations, access medical records, and get expert care instantly.
// //           </Text>
// //         </View>

// //         <View style={commonStyles.inputSection}>
// //           <Text style={commonStyles.label}>Phone Number</Text>
// //           <TextInput
// //             style={commonStyles.input}
// //             placeholder="Type something here..."
// //             value={phoneNumber}
// //             onChangeText={setPhoneNumber}
// //             keyboardType="phone-pad"
// //             placeholderTextColor="#999"
// //           />
// //         </View>
// //       </View>

// //       {/* Bottom Section */}
// //       <View style={commonStyles.bottomSection}>
// //         <View style={commonStyles.signUpSection}>
// //           <Text style={commonStyles.signUpText}>New here? </Text>
// //           <TouchableOpacity>
// //             <Text style={commonStyles.signUpLink}>Sign Up</Text>
// //           </TouchableOpacity>
// //         </View>

// //         <TouchableOpacity
// //           style={commonStyles.primaryButton}
// //           onPress={handleLogin}
// //         >
// //           <Text style={commonStyles.primaryButtonText}>Login Now</Text>
// //         </TouchableOpacity>
// //       </View>
// //     </SafeAreaView>
// //   );
// // }




// //registration page
// import React, { useState } from 'react';
// import { View, Text, TextInput, TouchableOpacity, SafeAreaView, StatusBar, ScrollView } from 'react-native';
// import { commonStyles } from '../styles/common_style';


// export default function SignUpScreen() {
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');

//   const handleCreateAccount = () => {
//     console.log('Creating account:', { name, email, password });
//   };

//   return (
//     <SafeAreaView style={commonStyles.container}>
//       <StatusBar barStyle="dark-content" />

//       {/* Header */}
//       <View style={commonStyles.header}>
//         <TouchableOpacity style={commonStyles.backButton}>
//           <Text style={commonStyles.backIcon}>‹</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Scrollable Content */}
//       <ScrollView 
//         style={{ flex: 1 }}
//         contentContainerStyle={{ flexGrow: 1 }}
//         showsVerticalScrollIndicator={false}
//       >
//         <View style={commonStyles.content}>
//           <View style={commonStyles.titleSection}>
//             <Text style={commonStyles.welcomeText}>Join Now</Text>
//             <Text style={commonStyles.brandText}>All In One Healthcare</Text>
//             <Text style={commonStyles.subtitle}>
//               Get instant access to top doctors, expert medical advice, and hassle-free consultations—anytime, anywhere.
//             </Text>
//           </View>

//           {/* Form Fields */}
//           <View style={commonStyles.inputSection}>
//             <Text style={commonStyles.label}>Name</Text>
//             <TextInput
//               style={commonStyles.input}
//               placeholder="Type something here..."
//               value={name}
//               onChangeText={setName}
//               placeholderTextColor="#999"
//             />
//           </View>

//           <View style={[commonStyles.inputSection, { marginTop: 20 }]}>
//             <Text style={commonStyles.label}>Email</Text>
//             <TextInput
//               style={commonStyles.input}
//               placeholder="Type something here..."
//               value={email}
//               onChangeText={setEmail}
//               keyboardType="email-address"
//               autoCapitalize="none"
//               placeholderTextColor="#999"
//             />
//           </View>

//           <View style={[commonStyles.inputSection, { marginTop: 20 }]}>
//             <Text style={commonStyles.label}>Password</Text>
//             <TextInput
//               style={commonStyles.input}
//               placeholder="Type something here..."
//               value={password}
//               onChangeText={setPassword}
//               secureTextEntry
//               placeholderTextColor="#999"
//             />
//           </View>

//           <View style={[commonStyles.inputSection, { marginTop: 20 }]}>
//             <Text style={commonStyles.label}>Confirm Password</Text>
//             <TextInput
//               style={commonStyles.input}
//               placeholder="Type something here..."
//               value={confirmPassword}
//               onChangeText={setConfirmPassword}
//               secureTextEntry
//               placeholderTextColor="#999"
//             />
//           </View>
//         </View>

//         {/* Bottom Section */}
//         <View style={[commonStyles.bottomSection, { paddingTop: 20, paddingBottom: 60 }]}>
//           <TouchableOpacity
//             style={commonStyles.primaryButton}
//             onPress={handleCreateAccount}
//           >
//             <Text style={commonStyles.primaryButtonText}>Create Account</Text>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }



import React from 'react';
import { View, StyleSheet, Text, Dimensions, Image } from 'react-native';
import LottieView from 'lottie-react-native';
import { useRouter } from 'expo-router';

const {width , hight } = Dimensions.get('window');

export default function Index() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <LottieView
        // Assets folder-e med-animation.json file thakte hobe
        source={require('../assets/images/lottifile/Doctor.json')} 
        autoPlay
        loop={false}
        style={styles.animation}
        onAnimationFinish={() => {
          // Animation sesh hole automatic onboarding-e jabe
          router.replace('/onboarding');
        }}
      />
      <Text style={styles.brand}>E-PARCHI</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a', // Dark theme
    justifyContent: 'center',
    alignItems: 'center',
  },
  animation: { width: width * 0.9, height: width },
  brand: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginTop: 20 }
});