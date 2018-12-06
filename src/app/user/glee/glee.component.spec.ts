import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GleeComponent } from './glee.component';

describe('GleeComponent', () => {
  let component: GleeComponent;
  let fixture: ComponentFixture<GleeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GleeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GleeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
