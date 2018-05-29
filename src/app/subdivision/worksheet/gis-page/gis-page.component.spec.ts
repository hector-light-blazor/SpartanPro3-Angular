import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GisPageComponent } from './gis-page.component';

describe('GisPageComponent', () => {
  let component: GisPageComponent;
  let fixture: ComponentFixture<GisPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GisPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GisPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
