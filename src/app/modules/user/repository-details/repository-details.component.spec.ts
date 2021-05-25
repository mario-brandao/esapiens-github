import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, getTestBed, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrModule } from 'ngx-toastr';
import { of } from 'rxjs';
import { Repository } from 'src/app/mocks/repository';
import { GitHubService } from 'src/app/services/github/github.service';
import { LoaderComponent } from '../../shared/loader/loader.component';
import { RepositoryDetailsComponent } from './repository-details.component';


describe('RepositoryDetailsComponent', () => {
  let component: RepositoryDetailsComponent;
  let injector: TestBed;
  let gitHubService: GitHubService;
  let fixture: ComponentFixture<RepositoryDetailsComponent>;
  const login = 'foo';
  const name = 'bar';
  const repoMock = new Repository();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        ToastrModule.forRoot(),
      ],
      declarations: [ RepositoryDetailsComponent, LoaderComponent ],
      providers: [
        {
          provide: ActivatedRoute, useValue: {
            snapshot: {
              paramMap: {
                get: (param) => {
                  return param === 'login' ? login : name;
                }
              }
            }
          }
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepositoryDetailsComponent);
    component = fixture.componentInstance;

    injector  = getTestBed();

    gitHubService = injector.inject(GitHubService);
    fixture.detectChanges();
  });

  describe('Smoke tests', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('#repo should be undefined', () => {
      expect(component.repo).toBeUndefined();
    });
    it('#loading should be defined', () => {
      expect(component.loading).toBeDefined();
    });
    it('#loadingError should be defined', () => {
      expect(component.loadingError).toBeDefined();
    });
    it('#subscriptions should be defined', () => {
      expect(component.subscriptions).toBeDefined();
    });
  });

  describe('Functionality tests', () => {
    it(`#ngAfterViewInit should call #getRepository`, () => {
      spyOn(component, 'getRepository');
      component.ngAfterViewInit();
      expect(component.getRepository).toHaveBeenCalled();
    });
    it(`#ngOnDestroy should unsubscribe observables`, () => {
      spyOn(component.subscriptions, 'unsubscribe');
      component.ngOnDestroy();
      expect(component.subscriptions.unsubscribe).toHaveBeenCalled();
    });
    it(`#getRouteParams should set login and name props`, () => {
      component.getRouteParams();
      expect(component.user).toEqual(login);
      expect(component.name).toEqual(name);
    });

    describe('#getRepository', () => {
      it(`should reset props`, () => {
        spyOn(gitHubService, 'getRepoDetails').and.callThrough();
        component.getRepository();
        expect(component.loadingError).toBeFalse();
        expect(component.loading).toBeTrue();
        expect(gitHubService.getRepoDetails).toHaveBeenCalled();
      });
      it(`should reset props`, () => {
        spyOn(gitHubService, 'getRepoDetails').and.returnValues(of(repoMock));
        component.getRepository();
        expect(gitHubService.getRepoDetails).toHaveBeenCalled();
        expect(component.repo).toEqual(repoMock);
        expect(component.loading).toBeFalse();
      });
    });

    describe('#hasAnyData', () => {
      it(`should reset props`, () => {
        component.repo = repoMock;
        Object.assign(component.repo, {
          stargazers_count: 0,
          watchers: 0,
          forks: 0,
          open_issues: 0
        });
        expect(component.hasAnyData()).toBeFalse();
      });
      it(`should reset props`, () => {
        component.repo = repoMock;
        Object.assign(component.repo, {
          stargazers_count: 1,
          watchers: 1,
          forks: 1,
          open_issues: 1
        });
        component.hasAnyData();
        expect(component.hasAnyData()).toBeTrue();
      });
    });
  });

});
