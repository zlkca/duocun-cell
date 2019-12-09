import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationFormPageComponent } from './application-form-page.component';

describe('ApplicationFormPageComponent', () => {
  let component: ApplicationFormPageComponent;
  let fixture: ComponentFixture<ApplicationFormPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplicationFormPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationFormPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
