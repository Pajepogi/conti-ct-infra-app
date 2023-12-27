/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TapeUnitComponent } from './tape-unit.component';

describe('TapeUnitComponent', () => {
  let component: TapeUnitComponent;
  let fixture: ComponentFixture<TapeUnitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TapeUnitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TapeUnitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
