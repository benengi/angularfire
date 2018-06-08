import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';

import { Lesson } from './lesson';
import { LessonsService } from './lessons.service';

@Injectable({
  providedIn: 'root'
})
export class LessonResolver implements Resolve<Lesson> {
  constructor(private lessonsService: LessonsService) {}

  resolve(route: ActivatedRouteSnapshot,
          state: RouterStateSnapshot): Observable<Lesson> {
    return this.lessonsService.findLessonByUrl(route.params['id']).pipe(first());
  }
}
