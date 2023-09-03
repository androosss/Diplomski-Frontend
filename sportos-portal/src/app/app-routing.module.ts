import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdditionalInfoComponent } from 'src/ui/components/additional-info/additional-info.component';
import { PageNotFoundComponent } from 'src/ui/components/common/page-not-found.component';
import { EventControlComponent } from 'src/ui/components/events/event-control/event-control.component';
import { EventPostComponent } from 'src/ui/components/events/event-post/event-post.component';
import { EventTableComponent } from 'src/ui/components/events/event-table/event-table.component';
import { HomeComponent } from 'src/ui/components/home/home.component';
import { LoginComponent } from 'src/ui/components/login/login.component';
import { MatchPostComponent } from 'src/ui/components/matches/match-post/match-post.component';
import { MatchTableComponent } from 'src/ui/components/matches/match-table/match-table.component';
import { OffersComponent } from 'src/ui/components/offers/offers.component';
import { CreatePostComponent } from 'src/ui/components/posts/create-post/create-post.component';
import { FeedComponent } from 'src/ui/components/posts/feed/feed.component';
import { ProfileComponent } from 'src/ui/components/posts/profile/profile.component';
import { PracticeComponent } from 'src/ui/components/practice/practice.component';
import { RegisterComponent } from 'src/ui/components/register/register.component';
import { ResetPasswordComponent } from 'src/ui/components/reset-password/reset-password.component';
import { ReviewsPostComponent } from 'src/ui/components/reviews/reviews-post/reviews-post.component';
import { ReviewsTableComponent } from 'src/ui/components/reviews/reviews-table/reviews-table.component';
import { SendResetComponent } from 'src/ui/components/send-reset/send-reset.component';
import { StatisticsComponent } from 'src/ui/components/statistics/statistics.component';
import { TeamPostComponent } from 'src/ui/components/teams/team-post/team-post.component';
import { TeamTableComponent } from 'src/ui/components/teams/team-table/team-table.component';
import { TemplateComponent } from 'src/ui/components/template/template.component';
import { TournamentsComponent } from 'src/ui/components/tournaments/tournaments.component';
import { VerifyComponent } from 'src/ui/components/verify/verify.component';
import { AuthGuardService as AuthGuard } from './../service/auth-guard.service';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'additional-info', component: AdditionalInfoComponent },
  { path: 'send-reset', component: SendResetComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'verify', component: VerifyComponent },
  {
    path: '',
    component: TemplateComponent,
    children: [
      { path: '', component: HomeComponent, canActivate: [AuthGuard] },
      {
        path: 'casual',
        component: MatchTableComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'match-post',
        component: MatchPostComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'teams',
        component: TeamTableComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'team-post',
        component: TeamPostComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'feed',
        component: FeedComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'user-post',
        component: CreatePostComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'statistics',
        component: StatisticsComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'tournaments',
        component: TournamentsComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'events',
        component: EventTableComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'create-event',
        component: EventPostComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'event-control',
        component: EventControlComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'practice',
        component: PracticeComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'offers',
        component: OffersComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'reviews',
        component: ReviewsTableComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'reviews/:id',
        component: ReviewsPostComponent,
        canActivate: [AuthGuard],
      },
      { path: '**', component: PageNotFoundComponent },
    ],
  },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
