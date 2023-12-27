import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhysicalStoragesComponent } from './physical-storages.component';

describe('PhysicalStoragesComponent', () => {
  let component: PhysicalStoragesComponent;
  let fixture: ComponentFixture<PhysicalStoragesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhysicalStoragesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhysicalStoragesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
