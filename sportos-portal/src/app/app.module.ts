import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import {
  FacebookLoginProvider,
  SocialAuthServiceConfig,
  SocialLoginModule,
} from 'angularx-social-login';
import { AccordionModule } from 'primeng/accordion';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { ContextMenuModule } from 'primeng/contextmenu';
import { DataViewModule } from 'primeng/dataview';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { DialogService } from 'primeng/dynamicdialog';
import { FileUploadModule } from 'primeng/fileupload';
import { GalleriaModule } from 'primeng/galleria';
import { ImageModule } from 'primeng/image';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MenuModule } from 'primeng/menu';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { MultiSelectModule } from 'primeng/multiselect';
import { ProgressBarModule } from 'primeng/progressbar';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { RatingModule } from 'primeng/rating';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { APIService } from 'src/service/api.service';
import { AuthGuardService } from 'src/service/auth-guard.service';
import { AuthService } from 'src/service/auth.service';
import { LocalStorageService } from 'src/service/local.storage.service';
import { tokenInterceptor } from 'src/service/token.interceptor';
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
import { MenuService } from '../service/app.menu.service';
import { AppFooterComponent } from '../ui/components/template/app.footer.component';
import { AppMenuComponent } from '../ui/components/template/app.menu.component';
import { AppMenuitemComponent } from '../ui/components/template/app.menuitem.component';
import { AppTopBarComponent } from '../ui/components/template/app.topbar.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    TemplateComponent,
    HomeComponent,
    AppFooterComponent,
    AppTopBarComponent,
    AppMenuComponent,
    AppMenuitemComponent,
    PageNotFoundComponent,
    LoginComponent,
    RegisterComponent,
    VerifyComponent,
    AdditionalInfoComponent,
    SendResetComponent,
    ResetPasswordComponent,
    MatchTableComponent,
    MatchPostComponent,
    TeamPostComponent,
    TeamTableComponent,
    TournamentsComponent,
    PagenotfoundComponent,
    EventPostComponent,
    EventTableComponent,
    EventControlComponent,
    CreatePostComponent,
    ProfileComponent,
    FeedComponent,
    StatisticsComponent,
    PracticeComponent,
    OffersComponent,
    ReviewsTableComponent,
    ReviewsPostComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    CardModule,
    ImageModule,
    CalendarModule,
    DialogModule,
    InputTextModule,
    HttpClientModule,
    AccordionModule,
    DividerModule,
    ButtonModule,
    GalleriaModule,
    RatingModule,
    InputTextareaModule,
    MultiSelectModule,
    TagModule,
    FileUploadModule,
    FormsModule,
    ReactiveFormsModule,
    DropdownModule,
    TableModule,
    DataViewModule,
    ContextMenuModule,
    MenuModule,
    ProgressBarModule,
    InputNumberModule,
    MessagesModule,
    TabViewModule,
    MessageModule,
    ToastModule,
    SocialLoginModule,
    ProgressSpinnerModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [
    AuthService,
    AuthGuardService,
    MenuService,
    APIService,
    MessageService,
    TemplateComponent,
    LocalStorageService,
    DialogService,
    tokenInterceptor,
    ,
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider('423382169779698'),
          },
        ],
      } as SocialAuthServiceConfig,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
