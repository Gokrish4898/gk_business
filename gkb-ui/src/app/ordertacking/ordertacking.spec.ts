import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ordertacking } from './ordertacking';

describe('Ordertacking', () => {
  let component: Ordertacking;
  let fixture: ComponentFixture<Ordertacking>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Ordertacking]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Ordertacking);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
