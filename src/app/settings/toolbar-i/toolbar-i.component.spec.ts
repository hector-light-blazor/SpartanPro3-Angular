import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolbarIComponent } from './toolbar-i.component';

describe('ToolbarIComponent', () => {
  let component: ToolbarIComponent;
  let fixture: ComponentFixture<ToolbarIComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToolbarIComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolbarIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
