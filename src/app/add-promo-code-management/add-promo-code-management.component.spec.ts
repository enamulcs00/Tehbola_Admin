import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPromoCodeManagementComponent } from './add-promo-code-management.component';

describe('AddPromoCodeManagementComponent', () => {
  let component: AddPromoCodeManagementComponent;
  let fixture: ComponentFixture<AddPromoCodeManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPromoCodeManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPromoCodeManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
