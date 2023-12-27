/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CloudStorageContainersComponent } from './cloud-storage-containers.component';

describe('CloudStorageContainersComponent', () => {
  let component: CloudStorageContainersComponent;
  let fixture: ComponentFixture<CloudStorageContainersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CloudStorageContainersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CloudStorageContainersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
