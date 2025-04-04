import { Directive, HostListener } from '@angular/core';

@Directive({
    selector: '[appPositiveNumber]'
})
export class PositiveNumberDirective {
    private regex: RegExp = new RegExp(/^[0-9]*\.?[0-9]*$/g);
    private specialKeys: string[] = ['Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight', 'Delete'];

    @HostListener('keydown', ['$event'])
    onKeyDown(event: KeyboardEvent): void {
        if (this.specialKeys.indexOf(event.key) !== -1) { return; }

        const input = (event.target as HTMLInputElement);
        const current: string = input.value;
        const next: string = current.concat(event.key);

        if (!String(next).match(this.regex)) {
            event.preventDefault();
        }
    }

    @HostListener('paste', ['$event'])
    onPaste(event: ClipboardEvent): void {
        const clipboardData = event.clipboardData || (window as any).clipboardData;
        const pastedText = clipboardData.getData('text');
        if (!String(pastedText).match(this.regex)) {
            event.preventDefault();
        }
    }
}
