# How to Start New React Native Projects #

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

