import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable, Subject } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { Lesson } from './lesson';
import { ServiceUtils } from './serviceUtils';

@Injectable({
  providedIn: 'root'
})
export class LessonsService {
  constructor(private db: AngularFireDatabase) {}

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

  firebaseUpdate(dataToSave: any): Observable<void> {
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
}
