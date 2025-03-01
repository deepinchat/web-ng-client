import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatEditorComponent } from './chat-editor.component';

describe('ChatEditorComponent', () => {
  let component: ChatEditorComponent;
  let fixture: ComponentFixture<ChatEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
