import { Injectable } from '@angular/core';
import { AngularFireDatabase, snapshotChanges } from 'angularfire2/database';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { Lesson } from './lesson';
import { ServiceUtils } from './serviceUtils';

@Injectable({
  providedIn: 'root'
})
export class LessonsService {

  constructor(private db: AngularFireDatabase) { }

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
}
