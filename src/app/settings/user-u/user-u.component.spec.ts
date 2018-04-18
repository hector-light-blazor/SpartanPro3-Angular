import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserUComponent } from './user-u.component';

describe('UserUComponent', () => {
  let component: UserUComponent;
  let fixture: ComponentFixture<UserUComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserUComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserUComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
