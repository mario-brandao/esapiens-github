import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { LoaderComponent } from 'src/app/modules/shared/loader/loader.component';
import { UsersListComponent } from './users-list.component';


describe('UsersListComponent', () => {
  let component: UsersListComponent;
  let fixture: ComponentFixture<UsersListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsersListComponent, LoaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Smoke tests', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });
    it('#leave should be defined', () => {
      expect(component.leave).toBeDefined();
    });
    it('#loadMore should be defined', () => {
      expect(component.loadMore).toBeDefined();
    });
    it('#userRoute should be defined', () => {
      expect(component.userRoute).toBeDefined();
    });
    it('#scrollOffset should be defined', () => {
      expect(component.scrollOffset).toBeDefined();
    });
    it('#debounceScrollEv should be defined', () => {
      expect(component.debounceScrollEv).toBeDefined();
    });
  });

  describe('Functionality tests', () => {
    it('#ngAfterViewInit should be defined', () => {
      spyOn(component, 'debounceScrollEv');
      component.ngAfterViewInit();
      expect(component.ngAfterViewInit).toBeDefined();
      expect(component.debounceScrollEv).toHaveBeenCalled();
    });
    it(`#ngOnDestroy should unsubscribe observables`, () => {
      spyOn(component.subscriptions, 'unsubscribe');
      component.ngOnDestroy();
      expect(component.ngOnDestroy).toBeDefined();
      expect(component.subscriptions.unsubscribe).toHaveBeenCalled();
    });
    it(`#navigateAway should unsubscribe observables`, () => {
      spyOn(component.leave, 'emit');
      component.navigateAway();
      expect(component.navigateAway).toBeDefined();
      expect(component.leave.emit).toHaveBeenCalled();
    });
    it(`#onScroll should unsubscribe observables`, () => {
      spyOn(component.loadMore, 'emit');
      const event = {
        target: {
          scrollTop: 100,
          clientHeight: 100,
          scrollHeight: 280,
        }
      };
      component.onScroll(event);
      expect(component.loading).toBeTrue();
      expect(component.loadMore.emit).toHaveBeenCalled();
    });
    it(`#onScroll should unsubscribe observables`, () => {
      spyOn(component.loadMore, 'emit');
      const event = {
        target: {
          scrollTop: 100,
          clientHeight: 100,
          scrollHeight: 281,
        }
      };
      component.onScroll(event);
      expect(component.loading).toBeUndefined();
      expect(component.loadMore.emit).not.toHaveBeenCalled();
    });
  });

});
