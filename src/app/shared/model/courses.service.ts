import { Injectable } from '@angular/core';
import { AngularFireDatabase, QueryFn } from 'angularfire2/database';
import { combineLatest, Observable } from 'rxjs';
import { map, switchMap, flatMap } from 'rxjs/operators';

import { Course } from './course';
import { Lesson } from './lesson';
import { ServiceUtils } from './serviceUtils';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {

  constructor(private db: AngularFireDatabase) { }

  findAllCourses(): Observable<Course[]> {
    return ServiceUtils.snapshotListToObjects(this.db.list('courses'));
  }

  findCourseByUrl(courseUrl: string): Observable<Course> {
    return this.db.list('courses',
      ref => ref.orderByChild('url').equalTo(courseUrl))
    .snapshotChanges().pipe(
      map(results => (<Course>{ $key: results[0].key, ...results[0].payload.val() }))
    );
  }

  findLessonKeysPerCourse(courseUrl: string, query: QueryFn = null): Observable<string[]> {
    return this.findCourseByUrl(courseUrl).pipe(
      switchMap(
        course => this.db.list(`lessonsPerCourse/${course.$key}`, query).snapshotChanges()
      ),
      map(lspc => lspc.map(lpc => lpc.key))
    );
  }

  findLessonsForLessonKeys(lessonKeys$: Observable<string[]>) {
    return lessonKeys$.pipe(
      map(
        keys => keys.map(lessonKey => this.db.object(`lessons/${lessonKey}`).snapshotChanges())
      ),
      flatMap(obs => combineLatest(obs)),
      ServiceUtils.snapshotToObjectFn
    );
  }

  findAllLessonsForCourse(courseUrl: string): Observable<Lesson[]> {
    return this.findLessonsForLessonKeys(this.findLessonKeysPerCourse(courseUrl));
  }

  loadFirstLessonsPage(courseUrl: string, pageSize: number): Observable<Lesson[]> {
    const firstPageLessonKeys$ = this.findLessonKeysPerCourse(courseUrl,
      ref => ref.limitToFirst(pageSize));
    return this.findLessonsForLessonKeys(firstPageLessonKeys$);
  }

  loadNextPage(courseUrl: string, lessonKey: string,
               pageSize: number): Observable<Lesson[]> {
    const lessonKeys$ = this.findLessonKeysPerCourse(courseUrl,
      ref => ref.orderByKey().startAt(lessonKey).limitToFirst(pageSize + 1));
    return this.findLessonsForLessonKeys(lessonKeys$).pipe(
      map(lessons => lessons.slice(1))
    );
  }

  loadPreviousPage(courseUrl: string, lessonKey: string,
    pageSize: number): Observable<Lesson[]> {
    const lessonKeys$ = this.findLessonKeysPerCourse(courseUrl,
      ref => ref.orderByKey().endAt(lessonKey).limitToLast(pageSize + 1));
    return this.findLessonsForLessonKeys(lessonKeys$).pipe(
      map(lessons => lessons.slice(0, lessons.length - 1))
    );
  }
}
