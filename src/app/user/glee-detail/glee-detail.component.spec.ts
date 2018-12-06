import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GleeDetailComponent } from './glee-detail.component';

describe('GleeDetailComponent', () => {
  let component: GleeDetailComponent;
  let fixture: ComponentFixture<GleeDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GleeDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GleeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
