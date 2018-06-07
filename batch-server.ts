
import {firebaseConfig} from './src/environments/firebase.config';
import * as firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
const Queue = require('firebase-queue');


console.log('Running batch server ...');

firebase.initializeApp(firebaseConfig);

firebase.auth()
    .signInWithEmailAndPassword('admin@angular-university.io', 'test123')
    .then(runConsumer)
    .catch(onError);

function onError(err) {
    console.error('Could not login', err);
    process.exit();
}


function runConsumer() {

    console.log('Running consumer ...');

    const lessonsRef = firebase.database().ref('lessons');
    const lessonsPerCourseRef = firebase.database().ref('lessonsPerCourse');

    const queueRef = firebase.database().ref('queue');


    const queue = new Queue(queueRef, function(data, progress, resolve, reject) {

        console.log('received delete request ...', data);

        const deleteLessonPromise = lessonsRef.child(data.lessonId).remove();

        const deleteLessonPerCoursePromise =
            lessonsPerCourseRef.child(`${data.courseId}/${data.lessonId}`).remove();

        Promise.all([deleteLessonPromise, deleteLessonPerCoursePromise])
            .then(
                () => {
                    console.log('lesson deleted');
                    resolve();
                }
            )
            .catch(() => {
            console.log('lesson deletion in error');
            reject();
        });


    });


}













