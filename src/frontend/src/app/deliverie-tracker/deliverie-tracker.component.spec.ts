import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliverieTrackerComponent } from './deliverie-tracker.component';

describe('DeliverieTrackerComponent', () => {
  let component: DeliverieTrackerComponent;
  let fixture: ComponentFixture<DeliverieTrackerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeliverieTrackerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeliverieTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
