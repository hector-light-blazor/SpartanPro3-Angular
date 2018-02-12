import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickPickToolsComponent } from './quick-pick-tools.component';

describe('QuickPickToolsComponent', () => {
  let component: QuickPickToolsComponent;
  let fixture: ComponentFixture<QuickPickToolsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuickPickToolsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickPickToolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
