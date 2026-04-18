import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestmentResultComponent } from './investment-result.component';

describe('InvestmentResultComponent', () => {
  let component: InvestmentResultComponent;
  let fixture: ComponentFixture<InvestmentResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvestmentResultComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvestmentResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
