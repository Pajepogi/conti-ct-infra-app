import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnicalContactsComponent } from './technical-contacts.component';

describe('TechnicalContactsComponent', () => {
  let component: TechnicalContactsComponent;
  let fixture: ComponentFixture<TechnicalContactsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TechnicalContactsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TechnicalContactsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
