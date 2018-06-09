import { Route } from '@angular/router';

import { CoursesComponent } from './courses/courses.component';
import { HomeComponent } from './home/home.component';
import { CourseDetailComponent } from './course-detail/course-detail.component';
import { LessonDetailComponent } from './lesson-detail/lesson-detail.component';
import { NewLessonComponent } from './new-lesson/new-lesson.component';
import { EditLessonComponent } from './edit-lesson/edit-lesson.component';
import { LessonResolver } from './shared/model/lesson.resolver';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthGuard } from './shared/security/auth.guard';

export const routerConfig: Route[] = [
  { path: 'home', component: HomeComponent },
  { path: 'courses', children: [
      { path: ':id', children: [
        { path: '', component: CourseDetailComponent},
        { path: 'new', component: NewLessonComponent}
        ]
      },
      { path: '', component: CoursesComponent }
    ]
  },
  { path: 'lessons/:id', children: [
    { path: '', component: LessonDetailComponent, canActivate: [AuthGuard]},
    { path: 'edit', component: EditLessonComponent,
      resolve: {
        lesson: LessonResolver
      }
    }
    ]
  },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent},
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home' }
];
