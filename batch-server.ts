
import {firebaseConfig, firebaseCredentials} from './src/environments/firebase.config';
import { initializeApp, auth, database } from 'firebase';
import * as Queue from 'firebase-queue';

console.log('Running batch server ...');

initializeApp(firebaseConfig);

auth().signInWithEmailAndPassword(firebaseCredentials.username, firebaseCredentials.password)
    .then(runConsumer)
    .catch(onError);

function onError(err) {
    console.error('Could not login ', err);
    process.exit();
}

function runConsumer() {
    const lessonsRef = database().ref('lessons');
    const lessonsPerCourseRef = database().ref('lessonsPerCourse');

    const queueRef = database().ref('queue');

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
