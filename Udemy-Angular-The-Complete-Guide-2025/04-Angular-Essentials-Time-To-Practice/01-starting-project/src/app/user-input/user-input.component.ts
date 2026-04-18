import { Component, EventEmitter, Output, signal } from '@angular/core';
import { InvestmentService } from '../investment.service';

@Component({
  selector: 'app-user-input',
  templateUrl: './user-input.component.html',
  styleUrl: './user-input.component.css',
})
export class UserInputComponent {
  initialInvestment = signal<number>(0);
  annualContribution = signal<number>(0);
  expectedReturn = signal<number>(0);
  investmentDuration = signal<number>(0);

  @Output() calculate = new EventEmitter<{
    initialInvestment: number;
    annualInvestment: number;
    expectedReturn: number;
    duration: number;
  }>();

  constructor(private investmentService: InvestmentService) {}

  onSubmit() {
    this.investmentService.calculateInvestmentResults({
      initialInvestment: this.initialInvestment(),
      annualInvestment: this.annualContribution(),
      expectedReturn: this.expectedReturn(),
      duration: this.investmentDuration(),
    });

    this.initialInvestment.set(0);
    this.annualContribution.set(0);
    this.expectedReturn.set(0);
    this.investmentDuration.set(0);
  }
}
