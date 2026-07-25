import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtraTopping } from './extra-topping';

describe('ExtraTopping', () => {
  let component: ExtraTopping;
  let fixture: ComponentFixture<ExtraTopping>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExtraTopping]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExtraTopping);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
