import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationResultPageComponent } from './application-result-page.component';

describe('ApplicationResultPageComponent', () => {
  let component: ApplicationResultPageComponent;
  let fixture: ComponentFixture<ApplicationResultPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplicationResultPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationResultPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
