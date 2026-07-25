import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Deliverycharge } from './deliverycharge';

describe('Deliverycharge', () => {
  let component: Deliverycharge;
  let fixture: ComponentFixture<Deliverycharge>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Deliverycharge]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Deliverycharge);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
