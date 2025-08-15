import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OcaTrackingComponent } from './oca-tracking.component';

describe('OcaTrackingComponent', () => {
  let component: OcaTrackingComponent;
  let fixture: ComponentFixture<OcaTrackingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OcaTrackingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OcaTrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
