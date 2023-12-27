import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VirtualServersComponent } from './virtual-servers.component';

describe('VirtualServersComponent', () => {
  let component: VirtualServersComponent;
  let fixture: ComponentFixture<VirtualServersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VirtualServersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VirtualServersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
