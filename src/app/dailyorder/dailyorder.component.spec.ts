import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyorderComponent } from './dailyorder.component';

describe('DailyorderComponent', () => {
  let component: DailyorderComponent;
  let fixture: ComponentFixture<DailyorderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DailyorderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
