import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketDataTableComponent } from './ticket-data-table.component';

describe('TicketDataTableComponent', () => {
  let component: TicketDataTableComponent;
  let fixture: ComponentFixture<TicketDataTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketDataTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketDataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
