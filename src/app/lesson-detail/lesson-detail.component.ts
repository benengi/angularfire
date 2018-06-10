import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';

import { Lesson } from '../shared/model/lesson';
import { LessonsService } from '../shared/model/lessons.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-lesson-detail',
  templateUrl: './lesson-detail.component.html',
  styleUrls: ['./lesson-detail.component.css']
})
export class LessonDetailComponent implements OnInit, OnDestroy {
  lesson: Lesson;
  subscription: Subscription;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private lessonsService: LessonsService) { }

  ngOnInit() {
    this.subscription = this.route.params.pipe(switchMap(params => {
      const lessonUrl = params['id'];
      return this.lessonsService.findLessonByUrl(lessonUrl);
    }))
    .subscribe(lesson => this.lesson = lesson);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  next() {
    this.lessonsService.loadNextLesson(this.lesson.courseId, this.lesson.$key)
      .subscribe(this.navigateToLesson.bind(this));
  }

  previous() {
    this.lessonsService.loadPreviousLesson(this.lesson.courseId, this.lesson.$key)
      .subscribe(this.navigateToLesson.bind(this));
  }

  private navigateToLesson(lesson: Lesson) {
    this.router.navigate(['lessons', lesson.url]);
  }

  delete() {
    // Note: if we don't subscribe to the observable, nothing will happen and the data
    // will not be deleted. Observables don't do anything without a subscriber.
    this.lessonsService.deleteLesson(this.lesson.$key)
      .subscribe(() => alert('Lesson deleted'), console.error);
  }

  requestLessonDeletion() {
    this.lessonsService.requestLessonDeletion(this.lesson.$key, this.lesson.courseId);
  }
}
