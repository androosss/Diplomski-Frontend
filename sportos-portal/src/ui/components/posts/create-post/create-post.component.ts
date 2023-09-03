import { HttpClient } from '@angular/common/http';
import { Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { APIService } from 'src/service/api.service';
import { LocalStorageService } from 'src/service/local.storage.service';
import { AbstractComponent } from '../../common/abstract.component';
import { TemplateComponent } from '../../template/template.component';

@Component({
  selector: 'create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss'],
})
export class CreatePostComponent extends AbstractComponent implements OnInit {
  form: FormGroup;
  text: FormControl;
  userId: string;

  public files: any[];

  constructor(
    private messageService: MessageService,
    private api: APIService,
    public templateComponent: TemplateComponent,
    private formBuilder: FormBuilder,
    protected override injector: Injector,
    protected override dialogService: DialogService,
    public router: Router,
    public localStorageService: LocalStorageService,
    public http: HttpClient
  ) {
    super(injector, dialogService);
    this.form = formBuilder.group({
      text: new FormControl({ value: null, disabled: false }),
    });
    this.files = [];
  }

  ngOnInit(): void {
    this.userId = JSON.parse(localStorage.getItem('token')).username;
  }

  submitForm(event: any) {
    if (this.chechIfElementShouldRecieveKeyDownEvent(event)) {
      this.createPost();
    }
  }

  onFileChanged(event: any) {
    console.log(event);
    this.files = event.currentFiles;
  }

  createPost() {
    const formData = new FormData();
    formData.append('userId', this.userId);
    formData.append('userText', this.form.controls['text'].value);
    for (const file of this.files) {
      formData.append('image', file, file.name);
    }
    this.api.postUserPost(formData).subscribe({
      next: this.handlePostCreateResponse.bind(this),
      error: this.handlePostCreateError.bind(this),
    });
  }

  handlePostCreateResponse(data: any) {
    this.messageService.clear();
    this.messageService.add({
      key: 'success',
      severity: 'success',
      summary: 'Success',
      detail: 'Post created successfully',
    });
    setTimeout(() => {
      this.router.navigate(['/profile']);
    }, 3000);

    this.handleComplete();
  }

  handlePostCreateError(err): void {
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
    this.templateComponent.showProgressSpinner = false;
  }
}
