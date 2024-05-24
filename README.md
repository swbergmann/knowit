# Know-It Quizzing App #
Development of a mobile quizzing application with React Native.  
The entire development process of this app is documented in the project report.

# How to run and test this app #

## 1. Environment Setup ##
Follow these steps: https://reactnative.dev/docs/set-up-your-environment  

## 2. Android Virtual Device ##
Download Android Studio.
Open the Virtual Device Manager.
Create a new virtual device "Pixel 7" Phone with Android API 34.
Start the virtual device.
![open_avd](https://github.com/swbergmann/knowit/assets/52543581/93618e72-d728-43d0-a45e-0fef2b1a3968)

## 3. Clone & start the Know-It App ##
Clone the knowit repository.
Open the knowit project in Visual Studio Code editor.
Click on View/Terminal to display the VS Code terminal.
Enter: npm start
This starts the app and creates a QR-code, that can be used on physical devices with the Expo Go app.
![start_the_app](https://github.com/swbergmann/knowit/assets/52543581/30150a00-5819-4c27-82a5-db628cd95dd5)

## 4. Start Know-It app on AVD ##
In the same Visual Studio Code terminal, enter the letter a  
to start the Know-It app on the opened AVD.  
This should automatically download the Expo Go app on the AVD and automatically open the Know-It app.
In case this does not work, try to re-open the AVD and make sure the Know-It application in the Visual Studio code is started after the AVD is opened. When pressing 'a' in the terminal the AVD must already be opened on the computer.
![app_on_avd](https://github.com/swbergmann/knowit/assets/52543581/4cd9b9f7-d611-4702-bab7-09ac0cfb3981)

## 5. Optional - Test on a physical Android device ##
To test the Know-It app on a physical device:
Install Expo Go (https://expo.dev/go) on a physical device
Open Expo Go and scan the QR-Code created in step 3. above




















# Documentation of Commands Used when Creating the App #
The following sections comprise of commands and bookmarks
that were necessary to create the application.

This is a good starting point in case the project is developed further or similar projects are started.

## Create new GitHub Repo ##
Private, empty - no files, no license.

## Create new React Native Project ##
### npx create-expo-app ProjectName ###
cd ProjectName

## Open VS Code ##
code .  
Terminal/ New Terminal  
### npm start ###

## Debuggin ##
Open new VS Code Terminal (plus icon)
### react-devtools ###
This opens the React DevTools window which automatically connects to the iOS Simulator or AVD upon onening them (after the React Devtools were opened).

## Test the App ##
Open Android Studio  
Open Virtual Device Manager (click 3 dots)  
Create an Android Virtual Device (AVD)  
Open the AVD (click play button)  
Cached Project App opens automatically in the AVD
Close the Cached Project App and the Expo App (swipe up both apps)  
In VS Code Terminal press "a"  
The Expo App bundles the Project App again and automatically connects to the React DevTool.

## Unit Testing ##
### Installation ###
https://docs.expo.dev/develop/unit-testing/

### Using Async Storage mock ###
https://react-native-async-storage.github.io/async-storage/docs/advanced/jest/  
With mocks directory.

### Command ###
npm run test

## GitHub ##
### How To: Push an existing repository from the command line. ###
git init  
git add .
git commit -m "initial commit"
git remote add origin git@github.com:username/reponame.git  
git branch -M main  
git push -u origin main  

## Install AsyncStorage ##
https://docs.expo.dev/versions/latest/sdk/async-storage/  

npx expo install @react-native-async-storage/async-storage  

