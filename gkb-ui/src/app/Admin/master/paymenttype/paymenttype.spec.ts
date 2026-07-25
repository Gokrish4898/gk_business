import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Paymenttype } from './paymenttype';

describe('Paymenttype', () => {
  let component: Paymenttype;
  let fixture: ComponentFixture<Paymenttype>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Paymenttype]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Paymenttype);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
