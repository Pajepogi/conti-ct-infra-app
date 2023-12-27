/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DiskBackupComponent } from './disk-backup.component';

describe('DiskBackupComponent', () => {
  let component: DiskBackupComponent;
  let fixture: ComponentFixture<DiskBackupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiskBackupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiskBackupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
