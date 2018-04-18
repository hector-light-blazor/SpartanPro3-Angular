import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketUComponent } from './ticket-u.component';

describe('TicketUComponent', () => {
  let component: TicketUComponent;
  let fixture: ComponentFixture<TicketUComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketUComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketUComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
