import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InstallationFormPageComponent } from './installation-form-page.component';

describe('InstallationFormPageComponent', () => {
  let component: InstallationFormPageComponent;
  let fixture: ComponentFixture<InstallationFormPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InstallationFormPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstallationFormPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
