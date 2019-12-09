import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TermDialogComponent } from './term-dialog.component';

describe('TermDialogComponent', () => {
  let component: TermDialogComponent;
  let fixture: ComponentFixture<TermDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TermDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TermDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
