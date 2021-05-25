import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrModule } from 'ngx-toastr';
import { AppComponent } from './app.component';
import { SearchComponent } from './components/search/search.component';

describe('AppComponent', () => {
  let app: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        FormsModule,
        ReactiveFormsModule,
        ToastrModule.forRoot(),
      ],
      declarations: [
        AppComponent,
        SearchComponent,
      ],
    }).compileComponents();

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
  });

  describe('Smoke tests', () => {
    it('should create the app', () => {
      expect(app).toBeTruthy();
    });

    it(`#isRoot should be true`, () => {
      expect(app.isRoot).toBeTrue();
    });

    it(`#watchRouteChanges should be defined`, () => {
      expect(app.watchRouteChanges).toBeDefined();
    });
  });

  describe('Functionality tests', () => {
    it(`#ngOnInit should trigger #watchRouteChanges`, () => {
      spyOn(app, 'watchRouteChanges');
      fixture.detectChanges();
      expect(app.ngOnInit).toBeDefined();
      expect(app.watchRouteChanges).toHaveBeenCalled();
    });
  });

});
