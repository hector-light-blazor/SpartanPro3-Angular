import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketChartsComponent } from './ticket-charts.component';

describe('TicketChartsComponent', () => {
  let component: TicketChartsComponent;
  let fixture: ComponentFixture<TicketChartsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketChartsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
