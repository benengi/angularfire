import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { LessonFormComponent } from '../lesson-form/lesson-form.component';
import { LessonsService } from '../shared/model/lessons.service';

@Component({
  selector: 'app-new-lesson',
  templateUrl: './new-lesson.component.html',
  styleUrls: ['./new-lesson.component.css']
})
export class NewLessonComponent implements OnInit {
  courseId: string;
  constructor(private route: ActivatedRoute, private lessonsService: LessonsService) { }

  ngOnInit() {
    this.courseId = this.route.snapshot.queryParams['courseId'];
  }

  save(form: LessonFormComponent) {
    this.lessonsService.createNewLesson(this.courseId, form.value)
      .subscribe(() => {
        alert('lesson created successfully. Create another lessson?');
        form.reset();
      },
      err => alert(`error creating lesson: ${err}`)
    );
  }
}
