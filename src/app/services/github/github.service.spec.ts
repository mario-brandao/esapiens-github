import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { GitHubService } from './github.service';


describe('GitHubService', () => {
  let service: GitHubService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
    });
    service = TestBed.inject(GitHubService);
  });

  describe('Smoke tests', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('#searchUsers should be defined', () => {
      expect(service.searchUsers).toBeDefined();
    });
    it('#getUser should be defined', () => {
      expect(service.getUser).toBeDefined();
    });
    it('#getRepos should be defined', () => {
      expect(service.getRepos).toBeDefined();
    });
    it('#getRepoDetails should be defined', () => {
      expect(service.getRepoDetails).toBeDefined();
    });
  });
});
