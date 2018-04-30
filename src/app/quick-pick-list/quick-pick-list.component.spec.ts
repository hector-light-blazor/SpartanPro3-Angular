import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickPickListComponent } from './quick-pick-list.component';

describe('QuickPickListComponent', () => {
  let component: QuickPickListComponent;
  let fixture: ComponentFixture<QuickPickListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuickPickListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickPickListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
