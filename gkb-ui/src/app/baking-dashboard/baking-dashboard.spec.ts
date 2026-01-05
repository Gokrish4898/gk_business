import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BakingDashboard } from './baking-dashboard';

describe('BakingDashboard', () => {
  let component: BakingDashboard;
  let fixture: ComponentFixture<BakingDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BakingDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BakingDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
