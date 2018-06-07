import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';

import { Course } from '../shared/model/course';
import { CoursesService } from '../shared/model/courses.service';
import { Lesson } from '../shared/model/lesson';

@Component({
  selector: 'app-course-detail',
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.css']
})
export class CourseDetailComponent implements OnInit {
  courseUrl: string;
  course$: Observable<Course>;
  lessons: Lesson[];

  constructor(private route: ActivatedRoute,
              private router: Router,
              private coursesService: CoursesService) { }

  ngOnInit() {
    this.courseUrl = this.route.snapshot.params['id'];
    // Note: Firebase library has a client side cache and will not query the course twice
    this.course$ = this.coursesService.findCourseByUrl(this.courseUrl);
    // this.lessons$ = this.coursesService.findAllLessonsForCourse(courseUrl);
    const lessons$ = this.coursesService.loadFirstLessonsPage(this.courseUrl, 3);
    lessons$.subscribe(lessons => this.lessons = lessons);
  }

  next() {
    this.coursesService.loadNextPage(
      this.courseUrl, this.lessons[this.lessons.length - 1].$key, 3)
      .subscribe(lessons => this.lessons = lessons);
  }

  previous() {
    this.coursesService.loadPreviousPage(this.courseUrl, this.lessons[0].$key, 3)
    .subscribe(lessons => this.lessons = lessons);
  }

  navigateToLesson(lesson: Lesson) {
    this.router.navigate(['lessons', lesson.url]);
  }
}
