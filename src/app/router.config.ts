import { Route } from '@angular/router';

import { CoursesComponent } from './courses/courses.component';
import { HomeComponent } from './home/home.component';
import { CourseDetailComponent } from './course-detail/course-detail.component';
import { LessonDetailComponent } from './lesson-detail/lesson-detail.component';

export const routerConfig: Route[] = [
  { path: 'home', component: HomeComponent },
  { path: 'courses',
    children: [
      { path: ':id', component: CourseDetailComponent},
      { path: '', component: CoursesComponent }
    ]
  },
  { path: 'lessons/:id', component: LessonDetailComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home' }
];
