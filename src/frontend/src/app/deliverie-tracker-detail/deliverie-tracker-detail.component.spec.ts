import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliverieTrackerDetailComponent } from './deliverie-tracker-detail.component';

describe('DeliverieTrackerDetailComponent', () => {
  let component: DeliverieTrackerDetailComponent;
  let fixture: ComponentFixture<DeliverieTrackerDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeliverieTrackerDetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeliverieTrackerDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
