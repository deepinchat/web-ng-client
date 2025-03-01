import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessaageListComponent } from './list.component';

describe('ListComponent', () => {
  let component: MessaageListComponent;
  let fixture: ComponentFixture<MessaageListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessaageListComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(MessaageListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
