import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FullScreenPickComponent } from './full-screen-pick.component';

describe('FullScreenPickComponent', () => {
  let component: FullScreenPickComponent;
  let fixture: ComponentFixture<FullScreenPickComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FullScreenPickComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FullScreenPickComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
