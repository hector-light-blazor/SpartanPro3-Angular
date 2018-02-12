import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TckCalendarViewComponent } from './tck-calendar-view.component';

describe('TckCalendarViewComponent', () => {
  let component: TckCalendarViewComponent;
  let fixture: ComponentFixture<TckCalendarViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TckCalendarViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TckCalendarViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
