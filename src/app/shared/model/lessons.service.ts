import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { from, Observable, Subject } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { firebaseConfig } from '../../../environments/firebase.config';
import { Lesson } from './lesson';
import { ServiceUtils } from './serviceUtils';

@Injectable({
  providedIn: 'root'
})
export class LessonsService {
  constructor(private db: AngularFireDatabase, private httpClient: HttpClient) {}

  findAllLessons(): Observable<Lesson[]> {
    return ServiceUtils.snapshotListToObjects(this.db.list('lessons'))
      .pipe(map(Lesson.fromJsonList));
  }

  findLessonByUrl(url: string): Observable<Lesson> {
    return this.db.list('lessons', ref => ref.orderByChild('url').equalTo(url))
      .snapshotChanges().pipe(
        map(results =>
          Lesson.fromJson(<Lesson>{ $key: results[0].key, ...results[0].payload.val() })
        )
      );
  }

  loadNextLesson(courseId: string, lessonKey: string): Observable<Lesson> {
    return this.db.list(`lessonsPerCourse/${courseId}`,
      ref => ref.orderByKey().startAt(lessonKey).limitToFirst(2))
      .snapshotChanges().pipe(
        map(lessons => lessons[1].key),
        switchMap(
          key => ServiceUtils.snapshotToObject(this.db.object(`lessons/${key}`))
        ),
        map(lesson => Lesson.fromJson(lesson))
      );
  }

  loadPreviousLesson(courseId: string, lessonKey: string): Observable<Lesson> {
    return this.db.list(`lessonsPerCourse/${courseId}`,
      ref => ref.orderByKey().endAt(lessonKey).limitToLast(2))
      .snapshotChanges().pipe(
        map(lessons => lessons[0].key),
        switchMap(
          key => ServiceUtils.snapshotToObject(this.db.object(`lessons/${key}`))
        ),
        map(lesson => Lesson.fromJson(lesson))
      );
  }

  createNewLesson(courseId: string, lesson: any): Observable<void> {
    const lessonToSave = Object.assign({}, lesson, {courseId});

    // Note: createPushId = function() { return this.database.ref().push().key; }
    const newLessonKey = this.db.createPushId();
    const dataToSave = {};
    dataToSave[`lessons/${newLessonKey}`] = lessonToSave;
    dataToSave[`lessonsPerCourse/${courseId}/${newLessonKey}`] = true;
    return this.firebaseUpdate(dataToSave);
  }

  saveLesson(lessonId: string, lesson: any): Observable<void> {
    const lessonToSave = Object.assign({}, lesson);
    delete(lessonToSave.$key);
    return from(this.db.database.ref(`lessons/${lessonId}`).update(lessonToSave));
  }

  private firebaseUpdate(dataToSave: any): Observable<void> {
    // Note: could also import { from } from 'rxjs'
    // Then return from(this.db.database.ref().update(dataToSave));
    const subject = new Subject<void>();
    this.db.database.ref().update(dataToSave)
      .then(
        () => {
          subject.next();
          subject.complete();
        },
        err => {
          subject.error(err);
          subject.complete();
        }
      );

    return subject.asObservable();
  }

  deleteLesson(lessonId: string): Observable<Object> {
    // In a real app we would use AngularFire, but this illustrates that REST is possible.
    // Also in a real app we should delete the corresponding entry in lessonsPerCourse.
    const url = `${firebaseConfig.databaseURL}/lessons/${lessonId}.json`;
    return this.httpClient.delete(url);
  }

  requestLessonDeletion(lessonId: string, courseId: string) {
    this.db.database.ref('queue/tasks').push({lessonId, courseId})
      .then(
        () => alert('lesson deletion requested !')
      );
  }
}
