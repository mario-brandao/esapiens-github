import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, getTestBed, TestBed } from '@angular/core/testing';
import { ToastrModule } from 'ngx-toastr';
import { of } from 'rxjs';
import { Repository } from 'src/app/mocks/repository';
import { GitHubService } from 'src/app/services/github/github.service';
import { LoaderComponent } from '../../shared/loader/loader.component';
import { RepositoriesComponent } from './repositories.component';

describe('RepositoriesComponent', () => {
  let component: RepositoriesComponent;
  let injector: TestBed;
  let gitHubService: GitHubService;
  let fixture: ComponentFixture<RepositoriesComponent>;

  const repoMock = new Repository();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ToastrModule.forRoot(),
      ],
      declarations: [ RepositoriesComponent, LoaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepositoriesComponent);
    component = fixture.componentInstance;
    injector  = getTestBed();

    gitHubService = injector.inject(GitHubService);

    fixture.detectChanges();
  });

  describe('Smoke tests', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('#repos should be defined', () => {
      expect(component.repos).toBeDefined();
    });
    it('#loading should be defined', () => {
      expect(component.loading).toBeDefined();
    });
    it('#loadingError should be defined', () => {
      expect(component.loadingError).toBeDefined();
    });
    it('#repoDetails should be defined', () => {
      expect(component.repoDetails).toBeDefined();
    });
    it('#subscriptions should be defined', () => {
      expect(component.subscriptions).toBeDefined();
    });
  });

  describe('Functionality tests', () => {
    it(`#ngOnChanges should call #getRepositories`, () => {
      spyOn(component, 'getRepositories');
      component.ngOnChanges();
      expect(component.getRepositories).toHaveBeenCalled();
    });
    it(`#ngOnDestroy should unsubscribe observables`, () => {
      spyOn(component.subscriptions, 'unsubscribe');
      component.ngOnDestroy();
      expect(component.repos).toEqual([]);
      expect(component.subscriptions.unsubscribe).toHaveBeenCalled();
    });

    describe('#getRepositories', () => {
      it(`should reset props`, () => {
        spyOn(gitHubService, 'getRepos').and.callThrough();
        component.getRepositories();
        expect(component.loadingError).toBeFalse();
        expect(component.loading).toBeTrue();
        expect(component.repos).toEqual([]);
        expect(gitHubService.getRepos).toHaveBeenCalled();
      });
      it(`should reset props`, () => {
        spyOn(gitHubService, 'getRepos').and.returnValues(of([repoMock]));
        component.getRepositories();
        expect(gitHubService.getRepos).toHaveBeenCalled();
        expect(component.repos[0]).toEqual(repoMock);
        expect(component.loading).toBeFalse();
      });
    });

    it(`#toggleSort should sort repos and toggle #isSortingDesc`, () => {
      const prevState = component.isSortingDesc;
      spyOn(component.repos, 'sort');
      component.toggleSort();
      expect(component.repos.sort).toHaveBeenCalled();
      expect(component.isSortingDesc).not.toEqual(prevState);
    });

    it(`#sortDesc should sort and set #isSortingDesc as true`, () => {
      spyOn(component.repos, 'sort');
      component.sortDesc();
      expect(component.repos.sort).toHaveBeenCalled();
      expect(component.isSortingDesc).toBeTrue();
    });
  });

});
