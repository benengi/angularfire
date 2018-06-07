import * as firebase from 'firebase/app';
import 'firebase/database';
import {firebaseConfig} from './src/environments/firebase.config';
import {dbData} from './db-data';

console.log('WARNING VERY IMPORTANT - PLEASE READ THIS\n\n\n');
console.log('WARNING Please set your own firebase config on src/environmnents/firebase.config.ts');
console.log(
  'Otherwise you will get permissions errors, because the populate-db script is trying to write to my database instead of yours. ');
console.log('Any issues please contact me, Thanks, Vasco\n\n\n');

firebase.initializeApp(firebaseConfig);

const coursesRef = firebase.database().ref('courses');
const lessonsRef = firebase.database().ref('lessons');

dbData.courses.forEach( course => {

  console.log('adding course', course.url);

  const courseRef = coursesRef.push({
      url: course.url,
      description: course.description,
      iconUrl: course.iconUrl,
      courseListIcon: course.courseListIcon,
      longDescription: course.longDescription
  });

  const lessonKeysPerCourse = [];

  course.lessons.forEach((lesson: any) =>  {

    console.log('adding lesson ', lesson.url);

    lessonKeysPerCourse.push(lessonsRef.push({
        description: lesson.description,
        duration: lesson.duration,
        url: lesson.url,
        tags: lesson.tags,
        videoUrl: lesson.videoUrl || null,
        longDescription: lesson.longDescription,
        courseId: courseRef.key
      }).key);

  });

  const association = firebase.database().ref('lessonsPerCourse');

  const lessonsPerCourse = association.child(courseRef.key);

  lessonKeysPerCourse.forEach(lessonKey => {
    console.log('adding lesson to course ');

    const lessonCourseAssociation = lessonsPerCourse.child(lessonKey);

    lessonCourseAssociation.set(true);
  });

});
