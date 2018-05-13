import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IdentifyListComponent } from './identify-list.component';

describe('IdentifyListComponent', () => {
  let component: IdentifyListComponent;
  let fixture: ComponentFixture<IdentifyListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IdentifyListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IdentifyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
