import firebase from 'firebase/app'
import 'firebase/auth';
import 'firebase/firestore';

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

    /*private readonly serverKey = 'AAAAN5dXGqg:APA91bELcxT-XIYUeLPmfWs9not4_1FKpbR_5oCQwzQmfmiL-Rn2flbAugNkYd2Sj4qS-uaDH7LJ8KieB9gUlzirjUbjTyyPr2ISxcmzPsD3W9f4J7nTOgsqZD1awcsUknlkfweEHH1j'

    private readonly headers = {
        "Authorization": "key=" + this.serverKey,
        "Content-Type": "application/json"
    }*/

    public async sendPushService() {

        /*const arrJsonAndroid = {
            "title": "title",
            "message": "message"
        }
        const arrJsonIOS = {
            "title": "title",
            "body": "message"
        }*/

        const db = this.init.firestore();  //위 설정대로 저장소에 접속합니다.
        const student = db.collection("Students");
        const snapshot = await student.get();
        snapshot.forEach(function (result) {
            console.log(result);
            /*let pushInfo = student.doc(result);
            let doc = await pushInfo.get();
            if (!doc.exists) {
                console.log('No such document!');
            } else {
                console.log('Document data:', doc.data());
            }*/

        });
    }
}