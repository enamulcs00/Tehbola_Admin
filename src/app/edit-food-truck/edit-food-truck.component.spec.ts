import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditFoodTruckComponent } from './edit-food-truck.component';

describe('EditFoodTruckComponent', () => {
  let component: EditFoodTruckComponent;
  let fixture: ComponentFixture<EditFoodTruckComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditFoodTruckComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditFoodTruckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
