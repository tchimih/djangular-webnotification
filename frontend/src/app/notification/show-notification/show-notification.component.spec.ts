import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowNotificationComponent } from './show-notification.component';

describe('ShowNotificationComponent', () => {
  let component: ShowNotificationComponent;
  let fixture: ComponentFixture<ShowNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowNotificationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
