import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardTicketsComponent } from './dashboard-tickets.component';

describe('DashboardTicketsComponent', () => {
  let component: DashboardTicketsComponent;
  let fixture: ComponentFixture<DashboardTicketsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardTicketsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardTicketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
