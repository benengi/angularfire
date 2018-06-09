import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Lesson } from '../shared/model/lesson';
import { LessonsService } from '../shared/model/lessons.service';

@Component({
  selector: 'app-edit-lesson',
  templateUrl: './edit-lesson.component.html',
  styleUrls: ['./edit-lesson.component.css']
})
export class EditLessonComponent implements OnInit {
  lesson: Lesson;

  constructor(private route: ActivatedRoute, private lessonsService: LessonsService) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.lesson = data['lesson'];
    });
  }

  save(lesson: any) {
    this.lessonsService.saveLesson(this.lesson.$key, lesson)
      .subscribe(
        () => alert('Lesson saved successfully'),
        err => alert(`error saving lesson ${err}`)
      );
  }
}
