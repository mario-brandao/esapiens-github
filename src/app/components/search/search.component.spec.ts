import { Location } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, fakeAsync, getTestBed, TestBed, tick } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { APP_CONSTANTS } from 'src/app/app.constants';
import { LoaderComponent } from 'src/app/modules/shared/loader/loader.component';
import { GitHubService } from 'src/app/services/github/github.service';
import { SearchComponent } from './search.component';

describe('SearchComponent', () => {
  let injector: TestBed;
  let location: Location;
  let gitHubService: GitHubService;
  let toastrService: ToastrService;
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;

  const fieldId = '#queryField';

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule,
        ToastrModule.forRoot(),
      ],
      declarations: [
        SearchComponent,
        LoaderComponent,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    injector  = getTestBed();

    location = injector.inject(Location);
    gitHubService = injector.inject(GitHubService);
    toastrService = injector.inject(ToastrService);

    fixture.detectChanges();
  });

  describe('Smoke tests', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('#page should be defined', () => {
      expect(component.page).toBeDefined();
    });
    it('#slideIn should be defined', () => {
      expect(component.slideIn).toBeDefined();
    });
    it('#results should be defined', () => {
      expect(component.results).toBeDefined();
    });
    it('#subscriptions should be defined', () => {
      expect(component.subscriptions).toBeDefined();
    });
  });

  describe('Functionality tests', () => {
    it(`#ngOnInit should call #buildForm`, () => {
      spyOn(component, 'buildForm');
      component.ngOnInit();
      expect(component.buildForm).toHaveBeenCalled();
    });
    it(`#ngOnDestroy should unsubscribe observables`, () => {
      spyOn(component.subscriptions, 'unsubscribe');
      component.ngOnDestroy();
      expect(component.subscriptions.unsubscribe).toHaveBeenCalled();
    });
    it(`#buildForm should define form and call #reactToFormChanges`, () => {
      spyOn(component, 'reactToFormChanges');
      component.buildForm();
      expect(component.form).toBeDefined();
      expect(component.reactToFormChanges).toHaveBeenCalled();
    });

    describe('#reactToFormChanges', () => {
      it(`should watch form changes`, () => {
        spyOn(component.form.valueChanges, 'subscribe');
        component.reactToFormChanges();
        expect(component.form.valueChanges.subscribe).toHaveBeenCalled();
      });
      it(`should trigger #search`, fakeAsync(() => {
        spyOn(component, 'search');

        const field = fixture.debugElement.nativeElement.querySelector(fieldId);
        field.value = 'foo';
        field.dispatchEvent(new Event('input'));

        fixture.detectChanges();
        tick(APP_CONSTANTS.SEARCH_DEBOUNCE_TIME);
        expect(component.search).toHaveBeenCalled();
      }));
      it(`should trigger #reset`, fakeAsync(() => {
        spyOn(component, 'reset');

        const field = fixture.debugElement.nativeElement.querySelector(fieldId);
        field.value = 'ab';
        field.dispatchEvent(new Event('input'));

        fixture.detectChanges();
        tick(APP_CONSTANTS.SEARCH_DEBOUNCE_TIME);
        expect(component.reset).toHaveBeenCalled();
      }));
    });

    describe('#reset', () => {
      it(`should reset props`, () => {
        component.reset();
        expect(component.results).toEqual([]);
        expect(component.page).toEqual(1);
      });
      it(`should reset form when force param is true`, () => {
        spyOn(component.form, 'reset');
        component.reset(true);
        expect(component.form.reset).toHaveBeenCalled();
      });
    });

    it(`#animateResults should set #slideIn to true`, () => {
      component.animateResults();
      fixture.detectChanges();
      expect(component.slideIn).toBeTrue();
    });

    it(`#animateBack should set #slideIn to false`, () => {
      component.animateBack();
      fixture.detectChanges();
      expect(component.slideIn).toBeFalse();
    });

    it(`#leave should call adjacente methods`, () => {
      spyOn(component, 'animateBack');
      spyOn(component, 'reset');
      component.leave();
      expect(component.animateBack).toHaveBeenCalled();
      expect(component.reset).toHaveBeenCalledWith(true);
    });

    it(`#navigateBack should call Location.back`, () => {
      spyOn(location, 'back');
      component.navigateBack();
      fixture.detectChanges();
      expect(location.back).toHaveBeenCalled();
    });

    it(`#prepareNewAttempt should reset props and focus field`, () => {
      spyOn(component, 'reset');
      component.prepareNewAttempt();
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(component.searchAttempt).toEqual(0);
        expect(component.reset).toHaveBeenCalledWith(true);
        expect(component.form.touched).toBeTrue();
      });
    });

    describe('#search', () => {
      it(`should reset props`, () => {
        spyOn(gitHubService, 'searchUsers').and.callThrough();
        spyOn(component, 'reset');
        component.search();
        expect(component.loadingError).toBeFalse();
        expect(component.loading).toBeTrue();
        expect(gitHubService.searchUsers).toHaveBeenCalled();
        expect(component.reset).toHaveBeenCalled();
      });
      it(`should reset props`, fakeAsync(() => {
        spyOn(gitHubService, 'searchUsers').and.returnValues(of({users: [], length: 0}));
        spyOn(component, 'animateResults');
        component.search();
        tick(390);
        expect(gitHubService.searchUsers).toHaveBeenCalled();
        expect(component.animateResults).toHaveBeenCalled();
        expect(component.page).toEqual(2);
        expect(component.loading).toBeFalse();
      }));
    });

    it(`#queryStr should equal query field value`, () => {
      const query = 'foo';
      component.form.setValue({query});
      component.form.updateValueAndValidity();
      expect(component.queryStr).toEqual(query);
    });
  });

});
