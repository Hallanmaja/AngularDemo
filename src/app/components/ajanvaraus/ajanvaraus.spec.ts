import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ajanvaraus } from './ajanvaraus';

describe('Ajanvaraus', () => {
  let component: Ajanvaraus;
  let fixture: ComponentFixture<Ajanvaraus>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Ajanvaraus]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Ajanvaraus);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
