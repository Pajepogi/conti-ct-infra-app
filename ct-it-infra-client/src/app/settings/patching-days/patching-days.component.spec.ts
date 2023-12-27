import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatchingDaysComponent } from './patching-days.component';

describe('PatchingDaysComponent', () => {
  let component: PatchingDaysComponent;
  let fixture: ComponentFixture<PatchingDaysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatchingDaysComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatchingDaysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
