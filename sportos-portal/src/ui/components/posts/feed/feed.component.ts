import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { Post } from 'src/model/post.model';
import { APIService, sportosAPI } from 'src/service/api.service';
import { TemplateComponent } from '../../template/template.component';

@Component({
  selector: 'feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss'],
})
export class FeedComponent implements OnInit {
  data: any[]; // Data which shows in table
  userId: string = '';
  loading: boolean = true;

  @Input() title: string;
  @Input() resumeAll: string;

  constructor(
    private api: APIService,
    private router: Router,
    private messageService: MessageService,
    public templateComponent: TemplateComponent,
    private translateService: TranslateService
  ) {
    this.templateComponent.showProgressSpinner = true;
  }

  ngOnInit(): void {
    this.userId = JSON.parse(localStorage.getItem('token')).username;
    this.api.getPosts('?notUserId=' + this.userId).subscribe({
      next: this.handlePostsResponse.bind(this),
      error: this.handlePostsError.bind(this),
    });
  }

  handlePostsResponse(data: Post[]): void {
    this.data = this.transformPosts(data);
    this.handleComplete();
  }

  handlePostsError(err): void {
    this.messageService.clear();
    this.messageService.add({
      key: 'error',
      severity: 'error',
      summary: 'Error',
      detail: err,
    });
    this.handleComplete();
  }

  handleComplete(): void {
    this.loading = false;
    this.templateComponent.showProgressSpinner = false;
  }

  onSort() {}

  post() {
    this.router.navigate(['user-post']);
  }

  transformPosts(posts: Post[]) {
    let ret = [];
    for (let j in posts) {
      let images = [];
      console.log(posts[j].createdAt);
      let post = {
        name: posts[j].name,
        userText: posts[j].userText,
        images: [],
        createdAt: new Date(posts[j].createdAt).toDateString(),
      };
      for (let i = 0; i < posts[j].imageNames.length; i++) {
        images.push({
          src: sportosAPI.getImages + '/' + posts[j].imageNames[i],
          alt: '',
          title: '',
        });
      }
      post.images = images;
      ret.push(post);
    }
    console.log(ret);
    return ret;
  }
}
