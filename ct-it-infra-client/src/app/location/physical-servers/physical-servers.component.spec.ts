import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhysicalServersComponent } from './physical-servers.component';

describe('PhysicalServersComponent', () => {
  let component: PhysicalServersComponent;
  let fixture: ComponentFixture<PhysicalServersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhysicalServersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhysicalServersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
