import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FoodTruckManagementComponent } from './food-truck-management.component';

describe('FoodTruckManagementComponent', () => {
  let component: FoodTruckManagementComponent;
  let fixture: ComponentFixture<FoodTruckManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FoodTruckManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FoodTruckManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
