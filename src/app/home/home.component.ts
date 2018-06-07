import { Component, OnInit } from '@angular/core';
import { LessonsService } from '../shared/model/lessons.service';
import { Lesson } from '../shared/model/lesson';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  allLessons: Lesson[];
  filteredLessons: Lesson[];

  constructor(private lessonsService: LessonsService) { }

  ngOnInit() {
    this.lessonsService.findAllLessons()
      .subscribe(lessons => {
        this.allLessons = this.filteredLessons = lessons;
      });
  }

  search(search: string) {
    this.filteredLessons = this.allLessons.filter(lesson => lesson.description.includes(search));
  }
}
