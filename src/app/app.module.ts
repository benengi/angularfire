import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';

import { firebaseConfig } from '../environments/firebase.config';
import { AppComponent } from './app.component';
import { CourseDetailComponent } from './course-detail/course-detail.component';
import { CoursesComponent } from './courses/courses.component';
import { EditLessonComponent } from './edit-lesson/edit-lesson.component';
import { HomeComponent } from './home/home.component';
import { LessonDetailComponent } from './lesson-detail/lesson-detail.component';
import { LessonFormComponent } from './lesson-form/lesson-form.component';
import { LessonsListComponent } from './lessons-list/lessons-list.component';
import { LoginComponent } from './login/login.component';
import { NewLessonComponent } from './new-lesson/new-lesson.component';
import { RegisterComponent } from './register/register.component';
import { routerConfig } from './router.config';
import { SafeUrlPipe } from './shared/security/safe-url.pipe';
import { TopMenuComponent } from './top-menu/top-menu.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LessonsListComponent,
    TopMenuComponent,
    CoursesComponent,
    CourseDetailComponent,
    LessonDetailComponent,
    SafeUrlPipe,
    NewLessonComponent,
    LessonFormComponent,
    EditLessonComponent,
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    RouterModule.forRoot(routerConfig),
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
