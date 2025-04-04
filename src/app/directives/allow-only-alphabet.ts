import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appOnlyAlphabets]'
})
export class OnlyAlphabetsDirective {
  constructor(private control: NgControl) {}

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const cleanValue = input.value.replace(/[^a-zA-Z\s]/g, '');

    if (input.value !== cleanValue) {
      this.control.control?.setValue(cleanValue);
    }
  }
}
