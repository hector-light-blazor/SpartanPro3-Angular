import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolbarUComponent } from './toolbar-u.component';

describe('ToolbarUComponent', () => {
  let component: ToolbarUComponent;
  let fixture: ComponentFixture<ToolbarUComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToolbarUComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolbarUComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
