import firebase from 'firebase/app'
import 'firebase/auth';
import 'firebase/firestore';

interface UserInfo {
    deviceType: string;
    deviceUuid: string;
    fcmToken: string;
    isAllowPush: boolean;
}


export class PushService {

    private readonly init = firebase.initializeApp({
        apiKey: "AIzaSyD9kai-_CPPRv5-Si-s46tMetYIVM5idOc",
        authDomain: "oceanview-dfdf7.firebaseapp.com",
        projectId: "oceanview-dfdf7",
        storageBucket: "oceanview-dfdf7.appspot.com",
        messagingSenderId: "238762269352",
        appId: "1:238762269352:web:76d5057a8de7137c96c09d",
        measurementId: "G-4DP2T31XWP"
    });

    public sendPushService() {

        var db = this.init.firestore();  //위 설정대로 저장소에 접속합니다.
        db.collection("Students")
            .get()
            .then(function (querySnapshot: any) {
                querySnapshot.forEach(function (doc: UserInfo) {
                    console.log(doc.fcmToken)
                })
            })
            .catch(function (error) {
                console.log("Error getting documents: ", error);
            });
    }
}