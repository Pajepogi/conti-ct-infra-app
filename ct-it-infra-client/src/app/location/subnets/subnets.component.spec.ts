import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubnetsComponent } from './subnets.component';

describe('SubnetsComponent', () => {
  let component: SubnetsComponent;
  let fixture: ComponentFixture<SubnetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubnetsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubnetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
